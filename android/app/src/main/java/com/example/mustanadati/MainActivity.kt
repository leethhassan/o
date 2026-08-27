package com.example.mustanadati

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.viewModels
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Scaffold
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.navigation.NavType
import androidx.navigation.compose.*
import androidx.navigation.navArgument
import com.example.mustanadati.navigation.AppScreen
import com.example.mustanadati.ui.components.AppBottomNavigation
import com.example.mustanadati.ui.screens.*
import com.example.mustanadati.ui.theme.MustanadatiTheme
import com.example.mustanadati.viewmodel.MainViewModel

class MainActivity : ComponentActivity() {

    private val viewModel: MainViewModel by viewModels()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            val isDarkMode by viewModel.isDarkMode.collectAsState()

            MustanadatiTheme(darkTheme = isDarkMode ?: androidx.compose.foundation.isSystemInDarkTheme()) {
                MustanadatiNavHost(viewModel = viewModel)
            }
        }
    }
}

@Composable
fun MustanadatiNavHost(viewModel: MainViewModel) {
    val navController = rememberNavController()
    val navBackStackEntry by navController.currentBackStackEntryAsState()
    val currentRoute = navBackStackEntry?.destination?.route

    val isTopLevelScreen = currentRoute in listOf(
        AppScreen.Home.route,
        AppScreen.Documents.route,
        AppScreen.Categories.route,
        AppScreen.Settings.route
    )

    Scaffold(
        bottomBar = {
            if (isTopLevelScreen) {
                AppBottomNavigation(
                    currentRoute = currentRoute,
                    onNavigate = { route ->
                        navController.navigate(route) {
                            popUpTo(AppScreen.Home.route) { saveState = true }
                            launchSingleTop = true
                            restoreState = true
                        }
                    }
                )
            }
        }
    ) { innerPadding ->
        NavHost(
            navController = navController,
            startDestination = AppScreen.Home.route,
            modifier = Modifier.padding(innerPadding)
        ) {
            composable(AppScreen.Home.route) {
                HomeScreen(
                    viewModel = viewModel,
                    onNavigateToCamera = { navController.navigate(AppScreen.CameraScan.route) },
                    onNavigateToImagePicker = { navController.navigate(AppScreen.ImagePickerEditor.route) },
                    onNavigateToPdfCreator = { navController.navigate(AppScreen.PdfCreator.route) },
                    onNavigateToDocumentDetails = { docId ->
                        navController.navigate(AppScreen.DocumentDetails.createRoute(docId))
                    },
                    onNavigateToDocumentsList = { navController.navigate(AppScreen.Documents.route) }
                )
            }

            composable(AppScreen.Documents.route) {
                DocumentListScreen(
                    viewModel = viewModel,
                    onNavigateToDocumentDetails = { docId ->
                        navController.navigate(AppScreen.DocumentDetails.createRoute(docId))
                    },
                    onNavigateToScan = { navController.navigate(AppScreen.CameraScan.route) }
                )
            }

            composable(AppScreen.Categories.route) {
                CategoriesScreen(
                    viewModel = viewModel,
                    onCategorySelected = {
                        navController.navigate(AppScreen.Documents.route)
                    }
                )
            }

            composable(AppScreen.Settings.route) {
                SettingsScreen(viewModel = viewModel)
            }

            composable(AppScreen.CameraScan.route) {
                CameraScanScreen(
                    viewModel = viewModel,
                    onNavigateBack = { navController.popBackStack() },
                    onConfirmedNext = { navController.navigate(AppScreen.PdfCreator.route) }
                )
            }

            composable(AppScreen.ImagePickerEditor.route) {
                ImagePickerEditorScreen(
                    viewModel = viewModel,
                    onNavigateBack = { navController.popBackStack() },
                    onNavigateToPdfCreator = { navController.navigate(AppScreen.PdfCreator.route) }
                )
            }

            composable(AppScreen.PdfCreator.route) {
                PdfCreatorScreen(
                    viewModel = viewModel,
                    onNavigateBack = { navController.popBackStack() },
                    onNavigateToDocumentDetails = { docId ->
                        navController.navigate(AppScreen.DocumentDetails.createRoute(docId)) {
                            popUpTo(AppScreen.Home.route)
                        }
                    }
                )
            }

            composable(
                route = AppScreen.DocumentDetails.route,
                arguments = listOf(navArgument("docId") { type = NavType.LongType })
            ) { backStackEntry ->
                val docId = backStackEntry.arguments?.getLong("docId") ?: 0L
                DocumentDetailsScreen(
                    docId = docId,
                    viewModel = viewModel,
                    onNavigateBack = { navController.popBackStack() }
                )
            }
        }
    }
}
