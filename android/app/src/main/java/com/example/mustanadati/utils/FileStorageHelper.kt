package com.example.mustanadati.utils

import android.content.Context
import android.content.Intent
import android.net.Uri
import androidx.core.content.FileProvider
import java.io.File
import java.io.FileOutputStream
import java.text.SimpleDateFormat
import java.util.*

object FileStorageHelper {

    fun createTempImageFile(context: Context): File {
        val timeStamp = SimpleDateFormat("yyyyMMdd_HHmmss", Locale.getDefault()).format(Date())
        val storageDir = File(context.filesDir, "temp_images").apply { if (!exists()) mkdirs() }
        return File(storageDir, "SCAN_${timeStamp}.jpg")
    }

    fun saveBitmapToInternalStorage(context: Context, bitmap: android.graphics.Bitmap, fileName: String): String {
        val imagesDir = File(context.filesDir, "images").apply { if (!exists()) mkdirs() }
        val file = File(imagesDir, fileName)
        FileOutputStream(file).use { out ->
            bitmap.compress(android.graphics.Bitmap.CompressFormat.JPEG, 90, out)
        }
        return file.absolutePath
    }

    fun sharePdf(context: Context, filePath: String) {
        val file = File(filePath)
        if (!file.exists()) return

        val uri: Uri = FileProvider.getUriForFile(
            context,
            "${context.packageName}.fileprovider",
            file
        )

        val intent = Intent(Intent.ACTION_SEND).apply {
            type = "application/pdf"
            putExtra(Intent.EXTRA_STREAM, uri)
            addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION)
        }
        context.startActivity(Intent.createChooser(intent, "مشاركة المستند"))
    }

    fun openPdf(context: Context, filePath: String) {
        val file = File(filePath)
        if (!file.exists()) return

        val uri: Uri = FileProvider.getUriForFile(
            context,
            "${context.packageName}.fileprovider",
            file
        )

        val intent = Intent(Intent.ACTION_VIEW).apply {
            setDataAndType(uri, "application/pdf")
            addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION)
            addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
        }
        try {
            context.startActivity(intent)
        } catch (_: Exception) {
            // In case no viewer is installed, prompt share
            sharePdf(context, filePath)
        }
    }

    fun formatFileSize(bytes: Long): String {
        if (bytes <= 0) return "0 ب"
        val units = arrayOf("ب", "ك.ب", "م.ب", "ج.ب")
        val digitGroups = (Math.log10(bytes.toDouble()) / Math.log10(1024.0)).toInt()
        return String.format(
            Locale.getDefault(),
            "%.1f %s",
            bytes / Math.pow(1024.0, digitGroups.toDouble()),
            units[digitGroups]
        )
    }

    fun formatDate(timestamp: Long): String {
        val sdf = SimpleDateFormat("yyyy/MM/dd - hh:mm a", Locale("ar"))
        return sdf.format(Date(timestamp))
    }
}
