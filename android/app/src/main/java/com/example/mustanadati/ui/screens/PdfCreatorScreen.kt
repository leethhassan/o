package com.example.mustanadati.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.mustanadati.model.DocumentCategory
import com.example.mustanadati.model.DocumentItem
import com.example.mustanadati.utils.FileStorageHelper
import com.example.mustanadati.viewmodel.MainViewModel
import java.text.SimpleDateFormat
import java.util.*

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun PdfCreatorScreen(
    viewModel: MainViewModel,
    onNavigateBack: () -> Unit,
    onNavigateToDocumentDetails: (Long) -> Unit
) {
    val context = LocalContext.current
    val stagedImages by viewModel.stagedImagePaths.collectAsState()

    val defaultTitle = remember {
        val sdf = SimpleDateFormat("yyyy-MM-dd_HHmm", Locale.getDefault())
        "مستند_${sdf.format(Date())}"
    }

    var title by remember { mutableStateOf(defaultTitle) }
    var selectedCategory by remember { mutableStateOf(DocumentCategory.INVOICES.titleAr) }
    var selectedQuality by remember { mutableStateOf(85) } // 85% high, 65% medium, 45% low
    var isCreating by remember { mutableStateOf(false) }
    var createdDoc by remember { mutableStateOf<DocumentItem?>(null) }
    var errorMessage by remember { mutableStateOf<String?>(null) }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text(if (createdDoc == null) "إنشاء ملف PDF" else "تم إنشاء المستند", fontWeight = FontWeight.Bold) },
                navigationIcon = {
                    IconButton(onClick = onNavigateBack) {
                        Icon(Icons.Default.ArrowBack, contentDescription = "رجوع")
                    }
                }
            )
        }
    ) { innerPadding ->
        if (createdDoc != null) {
            // Success Screen with Preview, Share, Open, Delete
            val doc = createdDoc!!
            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(innerPadding)
                    .padding(24.dp),
                horizontalAlignment = Alignment.CenterHorizontally,
                verticalArrangement = Arrangement.Center
            ) {
                Surface(
                    shape = RoundedCornerShape(20.dp),
                    color = MaterialTheme.colorScheme.primary.copy(alpha = 0.15f),
                    modifier = Modifier.size(80.dp)
                ) {
                    Box(contentAlignment = Alignment.Center) {
                        Text("🎉", fontSize = 40.sp)
                    }
                }

                Spacer(modifier = Modifier.height(16.dp))

                Text(
                    text = "تم إنشاء ملف PDF بنجاح!",
                    style = MaterialTheme.typography.titleLarge,
                    fontWeight = FontWeight.Bold
                )

                Spacer(modifier = Modifier.height(8.dp))

                Text(
                    text = doc.title,
                    style = MaterialTheme.typography.bodyLarge,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )

                Spacer(modifier = Modifier.height(4.dp))

                Text(
                    text = "${doc.pagesCount} صفحة • ${FileStorageHelper.formatFileSize(doc.sizeBytes)}",
                    style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.primary,
                    fontWeight = FontWeight.SemiBold
                )

                Spacer(modifier = Modifier.height(32.dp))

                // Actions: Open PDF, Share PDF, View Details
                Button(
                    onClick = { FileStorageHelper.openPdf(context, doc.filePath) },
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(12.dp)
                ) {
                    Icon(Icons.Default.Visibility, contentDescription = null)
                    Spacer(modifier = Modifier.width(8.dp))
                    Text("معاينة وفتح PDF", fontWeight = FontWeight.Bold)
                }

                Spacer(modifier = Modifier.height(12.dp))

                FilledTonalButton(
                    onClick = { FileStorageHelper.sharePdf(context, doc.filePath) },
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(12.dp)
                ) {
                    Icon(Icons.Default.Share, contentDescription = null)
                    Spacer(modifier = Modifier.width(8.dp))
                    Text("مشاركة المستند")
                }

                Spacer(modifier = Modifier.height(12.dp))

                OutlinedButton(
                    onClick = { onNavigateToDocumentDetails(doc.id) },
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(12.dp)
                ) {
                    Text("عرض تفاصيل المستند والتصنيف")
                }
            }
        } else {
            // Configuration & Creation form
            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(innerPadding)
                    .padding(20.dp)
                    .verticalScroll(rememberScrollState()),
                verticalArrangement = Arrangement.spacedBy(20.dp)
            ) {
                // Info Banner
                Surface(
                    shape = RoundedCornerShape(14.dp),
                    color = MaterialTheme.colorScheme.primaryContainer.copy(alpha = 0.5f)
                ) {
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(16.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Icon(
                            Icons.Default.PictureAsPdf,
                            contentDescription = null,
                            tint = MaterialTheme.colorScheme.primary,
                            modifier = Modifier.size(32.dp)
                        )
                        Spacer(modifier = Modifier.width(12.dp))
                        Column {
                            Text(
                                text = "جاهز لتحويل ${stagedImages.size} صفحة إلى PDF",
                                style = MaterialTheme.typography.titleMedium,
                                fontWeight = FontWeight.Bold
                            )
                            Text(
                                text = "سيتم حفظ الملف محلياً على هاتفك بجودة عالية",
                                style = MaterialTheme.typography.bodyMedium,
                                color = MaterialTheme.colorScheme.onSurfaceVariant
                            )
                        }
                    }
                }

                // File Name
                Column {
                    Text(
                        text = "اسم المستند",
                        style = MaterialTheme.typography.titleMedium,
                        fontWeight = FontWeight.Bold
                    )
                    Spacer(modifier = Modifier.height(8.dp))
                    OutlinedTextField(
                        value = title,
                        onValueChange = { title = it },
                        modifier = Modifier.fillMaxWidth(),
                        singleLine = true,
                        shape = RoundedCornerShape(12.dp),
                        placeholder = { Text("مثال: فاتورة كهرباء - أغسطس 2026") }
                    )
                }

                // Category Selection
                Column {
                    Text(
                        text = "اختر التصنيف",
                        style = MaterialTheme.typography.titleMedium,
                        fontWeight = FontWeight.Bold
                    )
                    Spacer(modifier = Modifier.height(8.dp))
                    LazyRow(
                        horizontalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        items(DocumentCategory.values()) { cat ->
                            val isSelected = selectedCategory == cat.titleAr
                            FilterChip(
                                selected = isSelected,
                                onClick = { selectedCategory = cat.titleAr },
                                label = { Text("${cat.iconEmoji} ${cat.titleAr}") },
                                colors = FilterChipDefaults.filterChipColors(
                                    selectedContainerColor = MaterialTheme.colorScheme.primary.copy(alpha = 0.2f),
                                    selectedLabelColor = MaterialTheme.colorScheme.primary
                                )
                            )
                        }
                    }
                }

                // Quality Selection
                Column {
                    Text(
                        text = "جودة الصورة وحجم الملف",
                        style = MaterialTheme.typography.titleMedium,
                        fontWeight = FontWeight.Bold
                    )
                    Spacer(modifier = Modifier.height(8.dp))
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        val qualities = listOf(
                            Triple("عالية (85%)", 85, "أفضل وضوح"),
                            Triple("متوسطة (65%)", 65, "متوازن"),
                            Triple("مضغوطة (45%)", 45, "أصغر حجم")
                        )
                        qualities.forEach { (label, q, sub) ->
                            val isSelected = selectedQuality == q
                            Card(
                                modifier = Modifier
                                    .weight(1f)
                                    .clickable { selectedQuality = q },
                                shape = RoundedCornerShape(12.dp),
                                colors = CardDefaults.cardColors(
                                    containerColor = if (isSelected) MaterialTheme.colorScheme.primary.copy(alpha = 0.15f)
                                    else MaterialTheme.colorScheme.surface
                                ),
                                border = if (isSelected) CardDefaults.outlinedCardBorder().copy(
                                    brush = androidx.compose.ui.graphics.SolidColor(MaterialTheme.colorScheme.primary)
                                ) else null
                            ) {
                                Column(
                                    modifier = Modifier
                                        .fillMaxWidth()
                                        .padding(12.dp),
                                    horizontalAlignment = Alignment.CenterHorizontally
                                ) {
                                    Text(
                                        text = label,
                                        style = MaterialTheme.typography.labelLarge,
                                        fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Normal,
                                        color = if (isSelected) MaterialTheme.colorScheme.primary else MaterialTheme.colorScheme.onSurface
                                    )
                                    Text(
                                        text = sub,
                                        style = MaterialTheme.typography.bodyMedium.copy(fontSize = 11.sp),
                                        color = MaterialTheme.colorScheme.onSurfaceVariant
                                    )
                                }
                            }
                        }
                    }
                }

                if (errorMessage != null) {
                    Text(
                        text = errorMessage!!,
                        color = MaterialTheme.colorScheme.error,
                        style = MaterialTheme.typography.bodyMedium
                    )
                }

                Spacer(modifier = Modifier.weight(1f))

                // Create PDF Button
                Button(
                    onClick = {
                        if (title.isBlank()) {
                            errorMessage = "يرجى كتابة اسم للمستند"
                            return@Button
                        }
                        isCreating = true
                        errorMessage = null
                        viewModel.createAndSavePdf(
                            title = title,
                            category = selectedCategory,
                            quality = selectedQuality,
                            onSuccess = { doc ->
                                isCreating = false
                                createdDoc = doc
                            },
                            onError = { err ->
                                isCreating = false
                                errorMessage = err
                            }
                        )
                    },
                    enabled = !isCreating && stagedImages.isNotEmpty(),
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(54.dp),
                    shape = RoundedCornerShape(14.dp)
                ) {
                    if (isCreating) {
                        CircularProgressIndicator(
                            color = Color.White,
                            modifier = Modifier.size(24.dp),
                            strokeWidth = 2.dp
                        )
                        Spacer(modifier = Modifier.width(12.dp))
                        Text("جاري تحويل وحفظ ملف PDF...")
                    } else {
                        Icon(Icons.Default.Save, contentDescription = null)
                        Spacer(modifier = Modifier.width(8.dp))
                        Text("إنشاء وحفظ المستند الآن", fontWeight = FontWeight.Bold)
                    }
                }
            }
        }
    }
}
