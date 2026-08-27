package com.example.mustanadati.ui.screens

import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.net.Uri
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.rotate
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.asImageBitmap
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.mustanadati.viewmodel.MainViewModel

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun CameraScanScreen(
    viewModel: MainViewModel,
    onNavigateBack: () -> Unit,
    onConfirmedNext: () -> Unit
) {
    val context = LocalContext.current
    val capturedBitmap by viewModel.capturedBitmap.collectAsState()
    val rotation by viewModel.currentRotation.collectAsState()

    // ActivityResultLauncher for picking or taking picture
    val takePictureLauncher = rememberLauncherForActivityResult(
        contract = ActivityResultContracts.TakePicturePreview()
    ) { bitmap: Bitmap? ->
        if (bitmap != null) {
            viewModel.setCapturedBitmap(bitmap)
        }
    }

    val pickImageLauncher = rememberLauncherForActivityResult(
        contract = ActivityResultContracts.GetContent()
    ) { uri: Uri? ->
        uri?.let {
            val inputStream = context.contentResolver.openInputStream(it)
            val bmp = BitmapFactory.decodeStream(inputStream)
            viewModel.setCapturedBitmap(bmp)
        }
    }

    LaunchedEffect(Unit) {
        if (capturedBitmap == null) {
            takePictureLauncher.launch(null)
        }
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("تصوير المستند", fontWeight = FontWeight.Bold) },
                navigationIcon = {
                    IconButton(onClick = onNavigateBack) {
                        Icon(Icons.Default.ArrowBack, contentDescription = "رجوع")
                    }
                },
                actions = {
                    IconButton(onClick = { pickImageLauncher.launch("image/*") }) {
                        Icon(Icons.Default.PhotoLibrary, contentDescription = "من المعرض")
                    }
                }
            )
        }
    ) { innerPadding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding)
                .padding(16.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.SpaceBetween
        ) {
            if (capturedBitmap == null) {
                // Initial prompt / camera launcher
                Box(
                    modifier = Modifier
                        .weight(1f)
                        .fillMaxWidth()
                        .clip(RoundedCornerShape(16.dp))
                        .background(MaterialTheme.colorScheme.surfaceVariant),
                    contentAlignment = Alignment.Center
                ) {
                    Column(
                        horizontalAlignment = Alignment.CenterHorizontally,
                        verticalArrangement = Arrangement.spacedBy(16.dp)
                    ) {
                        Icon(
                            imageVector = Icons.Default.CameraAlt,
                            contentDescription = null,
                            modifier = Modifier.size(64.dp),
                            tint = MaterialTheme.colorScheme.primary
                        )
                        Text(
                            text = "وجه الكاميرا نحو المستند بدقة",
                            style = MaterialTheme.typography.bodyLarge,
                            fontWeight = FontWeight.Medium
                        )
                        Button(
                            onClick = { takePictureLauncher.launch(null) },
                            shape = RoundedCornerShape(12.dp)
                        ) {
                            Icon(Icons.Default.PhotoCamera, contentDescription = null)
                            Spacer(modifier = Modifier.width(8.dp))
                            Text("فتح الكاميرا والتقاط")
                        }
                    }
                }
            } else {
                // Preview & Image manipulation
                Box(
                    modifier = Modifier
                        .weight(1f)
                        .fillMaxWidth()
                        .clip(RoundedCornerShape(16.dp))
                        .background(Color.Black)
                        .padding(8.dp),
                    contentAlignment = Alignment.Center
                ) {
                    Image(
                        bitmap = capturedBitmap!!.asImageBitmap(),
                        contentDescription = "المستند الملتقط",
                        contentScale = ContentScale.Fit,
                        modifier = Modifier
                            .fillMaxSize()
                            .rotate(rotation)
                    )
                }

                Spacer(modifier = Modifier.height(16.dp))

                // Adjustment Tools: Rotate, Enhance, Grayscale
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceEvenly
                ) {
                    FilledTonalButton(
                        onClick = { viewModel.rotateCapturedImage() },
                        shape = RoundedCornerShape(12.dp)
                    ) {
                        Icon(Icons.Default.RotateRight, contentDescription = null)
                        Spacer(modifier = Modifier.width(4.dp))
                        Text("تدوير")
                    }

                    FilledTonalButton(
                        onClick = { viewModel.applyHighContrastFilter() },
                        shape = RoundedCornerShape(12.dp)
                    ) {
                        Icon(Icons.Default.AutoFixHigh, contentDescription = null)
                        Spacer(modifier = Modifier.width(4.dp))
                        Text("تحسين الوضوح")
                    }

                    FilledTonalButton(
                        onClick = { viewModel.applyGrayscaleFilter() },
                        shape = RoundedCornerShape(12.dp)
                    ) {
                        Icon(Icons.Default.FilterBAndW, contentDescription = null)
                        Spacer(modifier = Modifier.width(4.dp))
                        Text("أبيض وأسود")
                    }
                }

                Spacer(modifier = Modifier.height(16.dp))

                // Bottom Action Buttons: Retake vs Confirm
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    OutlinedButton(
                        onClick = {
                            viewModel.setCapturedBitmap(null)
                            takePictureLauncher.launch(null)
                        },
                        modifier = Modifier.weight(1f),
                        shape = RoundedCornerShape(12.dp)
                    ) {
                        Icon(Icons.Default.Replay, contentDescription = null)
                        Spacer(modifier = Modifier.width(6.dp))
                        Text("إعادة الالتقاط")
                    }

                    Button(
                        onClick = {
                            viewModel.confirmCapturedImage {
                                onConfirmedNext()
                            }
                        },
                        modifier = Modifier.weight(1f),
                        shape = RoundedCornerShape(12.dp)
                    ) {
                        Icon(Icons.Default.Check, contentDescription = null)
                        Spacer(modifier = Modifier.width(6.dp))
                        Text("تأكيد وحفظ")
                    }
                }
            }
        }
    }
}
