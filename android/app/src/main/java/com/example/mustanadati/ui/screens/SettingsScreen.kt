package com.example.mustanadati.ui.screens

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.mustanadati.viewmodel.MainViewModel

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun SettingsScreen(
    viewModel: MainViewModel
) {
    val isDarkMode by viewModel.isDarkMode.collectAsState()
    var showDeleteAllDialog by remember { mutableStateOf(false) }
    var showPrivacyDialog by remember { mutableStateOf(false) }
    var showAboutDialog by remember { mutableStateOf(false) }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("الإعدادات", fontWeight = FontWeight.Bold) }
            )
        }
    ) { innerPadding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding)
                .padding(16.dp)
                .verticalScroll(rememberScrollState()),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            // Appearance Card
            SettingsSectionHeader(title = "المظهر والعرض")
            Card(
                shape = RoundedCornerShape(16.dp),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface)
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Icon(Icons.Default.DarkMode, contentDescription = null, tint = MaterialTheme.colorScheme.primary)
                            Spacer(modifier = Modifier.width(12.dp))
                            Text("الوضع الداكن", style = MaterialTheme.typography.bodyLarge)
                        }

                        Switch(
                            checked = isDarkMode == true,
                            onCheckedChange = { isChecked ->
                                viewModel.setDarkMode(isChecked)
                            }
                        )
                    }

                    Divider(
                        modifier = Modifier.padding(vertical = 12.dp),
                        color = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.5f)
                    )

                    SettingsClickableRow(
                        icon = Icons.Default.Language,
                        title = "لغة التطبيق",
                        subtitle = "العربية (الافتراضية)",
                        onClick = {}
                    )
                }
            }

            // Storage & Data
            SettingsSectionHeader(title = "البيانات والتخزين")
            Card(
                shape = RoundedCornerShape(16.dp),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface)
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    SettingsClickableRow(
                        icon = Icons.Default.Security,
                        title = "الخصوصية والأمان",
                        subtitle = "بياناتك ومستنداتك محفوظة محلياً 100%",
                        onClick = { showPrivacyDialog = true }
                    )

                    Divider(
                        modifier = Modifier.padding(vertical = 12.dp),
                        color = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.5f)
                    )

                    SettingsClickableRow(
                        icon = Icons.Default.DeleteSweep,
                        title = "حذف جميع المستندات",
                        subtitle = "مسح كافة المستندات المحفوظة من الجهاز",
                        titleColor = MaterialTheme.colorScheme.error,
                        onClick = { showDeleteAllDialog = true }
                    )
                }
            }

            // About
            SettingsSectionHeader(title = "حول التطبيق")
            Card(
                shape = RoundedCornerShape(16.dp),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface)
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    SettingsClickableRow(
                        icon = Icons.Default.Info,
                        title = "عن تطبيق مستنداتي",
                        subtitle = "تطبيق عربي لإدارة المستندات وتحويلها لـ PDF",
                        onClick = { showAboutDialog = true }
                    )

                    Divider(
                        modifier = Modifier.padding(vertical = 12.dp),
                        color = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.5f)
                    )

                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Icon(Icons.Default.Code, contentDescription = null, tint = MaterialTheme.colorScheme.primary)
                            Spacer(modifier = Modifier.width(12.dp))
                            Text("إصدار التطبيق", style = MaterialTheme.typography.bodyLarge)
                        }
                        Text("1.0.0", color = MaterialTheme.colorScheme.onSurfaceVariant, fontWeight = FontWeight.Bold)
                    }
                }
            }
        }
    }

    // Delete All Confirmation Dialog
    if (showDeleteAllDialog) {
        AlertDialog(
            onDismissRequest = { showDeleteAllDialog = false },
            title = { Text("حذف جميع المستندات؟", fontWeight = FontWeight.Bold) },
            text = {
                Text("سيتم حذف كافة الملفات والمستندات المحفوظة نهائياً من ذاكرة الجهاز. لا يمكن استرجاعها بعد ذلك.")
            },
            confirmButton = {
                Button(
                    onClick = {
                        viewModel.clearAllDocuments()
                        showDeleteAllDialog = false
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = MaterialTheme.colorScheme.error)
                ) {
                    Text("مسح الكل", color = Color.White)
                }
            },
            dismissButton = {
                TextButton(onClick = { showDeleteAllDialog = false }) {
                    Text("إلغاء")
                }
            }
        )
    }

    // Privacy Dialog
    if (showPrivacyDialog) {
        AlertDialog(
            onDismissRequest = { showPrivacyDialog = false },
            title = { Text("الخصوصية والأمان (Local-First)", fontWeight = FontWeight.Bold) },
            text = {
                Text(
                    "تطبيق \"مستنداتي\" يعمل بالكامل دون الحاجة إلى خوادم سحابية (Offline & Local-First).\n\n" +
                    "• لا يتم رفع صورك أو مستنداتك أو معلوماتك لأي جهة خارجية.\n" +
                    "• يتم تخزين وتوليد ملفات PDF محلياً داخل المساحة الآمنة للتطبيق على هاتفك.\n" +
                    "• تحكم كامل في تصدير وحذف الملفات متى شئت."
                )
            },
            confirmButton = {
                Button(onClick = { showPrivacyDialog = false }) {
                    Text("حسناً")
                }
            }
        )
    }

    // About Dialog
    if (showAboutDialog) {
        AlertDialog(
            onDismissRequest = { showAboutDialog = false },
            title = { Text("مستنداتي v1.0.0", fontWeight = FontWeight.Bold) },
            text = {
                Text(
                    "تطبيق عربي بسيط وعصري يتيح لك:\n\n" +
                    "1. تصوير المستندات والأوراق بدقة وتحسين وضوحها.\n" +
                    "2. دمج الصور المتعددة وإعادة ترتيب صفحاتها.\n" +
                    "3. إنشاء ملفات PDF عالية الجودة وتصنيفها والبحث فيها بسهولة.\n\n" +
                    "تم البناء باستخدام Kotlin و Jetpack Compose و Material 3."
                )
            },
            confirmButton = {
                Button(onClick = { showAboutDialog = false }) {
                    Text("إغلاق")
                }
            }
        )
    }
}

@Composable
fun SettingsSectionHeader(title: String) {
    Text(
        text = title,
        style = MaterialTheme.typography.titleMedium.copy(fontSize = 14.sp),
        color = MaterialTheme.colorScheme.primary,
        fontWeight = FontWeight.Bold,
        modifier = Modifier.padding(horizontal = 4.dp)
    )
}

@Composable
fun SettingsClickableRow(
    icon: ImageVector,
    title: String,
    subtitle: String? = null,
    titleColor: Color = Color.Unspecified,
    onClick: () -> Unit
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .clickable { onClick() },
        verticalAlignment = Alignment.CenterVertically
    ) {
        Icon(
            imageVector = icon,
            contentDescription = null,
            tint = if (titleColor != Color.Unspecified) titleColor else MaterialTheme.colorScheme.primary
        )
        Spacer(modifier = Modifier.width(12.dp))
        Column(modifier = Modifier.weight(1f)) {
            Text(
                text = title,
                style = MaterialTheme.typography.bodyLarge,
                color = if (titleColor != Color.Unspecified) titleColor else MaterialTheme.colorScheme.onSurface,
                fontWeight = FontWeight.Medium
            )
            if (subtitle != null) {
                Text(
                    text = subtitle,
                    style = MaterialTheme.typography.bodyMedium.copy(fontSize = 12.sp),
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
            }
        }
        Icon(
            imageVector = Icons.Default.ArrowBackIos,
            contentDescription = null,
            tint = MaterialTheme.colorScheme.onSurfaceVariant.copy(alpha = 0.4f),
            modifier = Modifier.size(16.dp)
        )
    }
}
