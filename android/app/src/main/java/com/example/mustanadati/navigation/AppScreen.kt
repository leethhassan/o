package com.example.mustanadati.navigation

sealed class AppScreen(val route: String) {
    object Home : AppScreen("home")
    object Documents : AppScreen("documents")
    object Categories : AppScreen("categories")
    object Settings : AppScreen("settings")
    object CameraScan : AppScreen("camera_scan")
    object ImagePickerEditor : AppScreen("image_picker_editor")
    object PdfCreator : AppScreen("pdf_creator")
    object DocumentDetails : AppScreen("document_details/{docId}") {
        fun createRoute(docId: Long) = "document_details/$docId"
    }
}
