package com.example.mustanadati.utils

import android.content.Context
import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.graphics.Canvas
import android.graphics.Paint
import android.graphics.pdf.PdfDocument
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import java.io.File
import java.io.FileOutputStream

object PdfGenerator {

    /**
     * Converts a list of image file paths into a single PDF document.
     * Standard A4 page size in 72 DPI is 595 x 842 points.
     */
    suspend fun createPdfFromImages(
        context: Context,
        imagePaths: List<String>,
        outputFileName: String,
        qualityPercent: Int = 85
    ): Result<File> = withContext(Dispatchers.IO) {
        try {
            val docsDir = File(context.filesDir, "docs").apply { if (!exists()) mkdirs() }
            val cleanName = if (outputFileName.endsWith(".pdf", ignoreCase = true)) {
                outputFileName
            } else {
                "$outputFileName.pdf"
            }
            val outputFile = File(docsDir, cleanName)

            val document = PdfDocument()
            val pageWidth = 595
            val pageHeight = 842

            imagePaths.forEachIndexed { index, path ->
                val options = BitmapFactory.Options().apply {
                    inPreferredConfig = Bitmap.Config.ARGB_8888
                }
                var bitmap = BitmapFactory.decodeFile(path, options) ?: return@forEachIndexed

                // Scale bitmap to fit page while maintaining aspect ratio
                val scale = (pageWidth.toFloat() / bitmap.width).coerceAtMost(pageHeight.toFloat() / bitmap.height)
                val targetW = (bitmap.width * scale).toInt()
                val targetH = (bitmap.height * scale).toInt()

                val scaledBitmap = Bitmap.createScaledBitmap(bitmap, targetW, targetH, true)

                val pageInfo = PdfDocument.PageInfo.Builder(pageWidth, pageHeight, index + 1).create()
                val page = document.startPage(pageInfo)
                val canvas: Canvas = page.canvas

                // Center on page
                val left = (pageWidth - targetW) / 2f
                val top = (pageHeight - targetH) / 2f

                canvas.drawBitmap(scaledBitmap, left, top, Paint(Paint.FILTER_BITMAP_FLAG))
                document.finishPage(page)

                scaledBitmap.recycle()
                bitmap.recycle()
            }

            FileOutputStream(outputFile).use { fos ->
                document.writeTo(fos)
            }
            document.close()

            Result.success(outputFile)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
}
