package com.example.mustanadati.model

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "documents")
data class DocumentItem(
    @PrimaryKey(autoGenerate = true)
    val id: Long = 0,
    val title: String,
    val category: String, // e.g. "فواتير", "دراسة", "عمل", "مستندات شخصية", "أخرى"
    val filePath: String,
    val thumbnailPath: String? = null,
    val pagesCount: Int = 1,
    val sizeBytes: Long = 0L,
    val createdAt: Long = System.currentTimeMillis()
)
