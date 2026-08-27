package com.example.mustanadati.model

enum class DocumentCategory(
    val titleAr: String,
    val iconEmoji: String,
    val colorHex: Long
) {
    INVOICES("فواتير", "🧾", 0xFF059669),
    STUDY("دراسة", "📚", 0xFF0284C7),
    WORK("عمل", "💼", 0xFFD97706),
    PERSONAL("مستندات شخصية", "👤", 0xFF7C3AED),
    OTHER("أخرى", "📁", 0xFF64748B);

    companion object {
        fun fromString(value: String): DocumentCategory {
            return values().firstOrNull { it.name.equals(value, ignoreCase = true) || it.titleAr == value } ?: OTHER
        }
    }
}
