package com.example.mustanadati.repository

import com.example.mustanadati.data.DocumentDao
import com.example.mustanadati.model.DocumentItem
import kotlinx.coroutines.flow.Flow
import java.io.File

class DocumentRepository(private val dao: DocumentDao) {

    val allDocuments: Flow<List<DocumentItem>> = dao.getAllDocuments()
    val recentDocuments: Flow<List<DocumentItem>> = dao.getRecentDocuments(5)

    fun searchDocuments(query: String): Flow<List<DocumentItem>> {
        return if (query.isBlank()) {
            dao.getAllDocuments()
        } else {
            dao.searchDocuments(query.trim())
        }
    }

    fun getDocumentsByCategory(category: String): Flow<List<DocumentItem>> {
        return dao.getDocumentsByCategory(category)
    }

    suspend fun getDocumentById(id: Long): DocumentItem? {
        return dao.getDocumentById(id)
    }

    suspend fun insertDocument(document: DocumentItem): Long {
        return dao.insertDocument(document)
    }

    suspend fun renameDocument(id: Long, newTitle: String) {
        dao.updateTitle(id, newTitle)
    }

    suspend fun updateCategory(id: Long, newCategory: String) {
        dao.updateCategory(id, newCategory)
    }

    suspend fun deleteDocument(document: DocumentItem) {
        try {
            val file = File(document.filePath)
            if (file.exists()) file.delete()
            document.thumbnailPath?.let {
                val thumbFile = File(it)
                if (thumbFile.exists()) thumbFile.delete()
            }
        } catch (_: Exception) {}
        dao.deleteDocument(document)
    }

    suspend fun clearAllDocuments() {
        dao.clearAllDocuments()
    }
}
