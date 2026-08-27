package com.example.mustanadati.data

import androidx.room.*
import com.example.mustanadati.model.DocumentItem
import kotlinx.coroutines.flow.Flow

@Dao
interface DocumentDao {
    @Query("SELECT * FROM documents ORDER BY createdAt DESC")
    fun getAllDocuments(): Flow<List<DocumentItem>>

    @Query("SELECT * FROM documents ORDER BY createdAt DESC LIMIT :limit")
    fun getRecentDocuments(limit: Int = 5): Flow<List<DocumentItem>>

    @Query("SELECT * FROM documents WHERE id = :id LIMIT 1")
    suspend fun getDocumentById(id: Long): DocumentItem?

    @Query("SELECT * FROM documents WHERE title LIKE '%' || :query || '%' OR category LIKE '%' || :query || '%' ORDER BY createdAt DESC")
    fun searchDocuments(query: String): Flow<List<DocumentItem>>

    @Query("SELECT * FROM documents WHERE category = :category ORDER BY createdAt DESC")
    fun getDocumentsByCategory(category: String): Flow<List<DocumentItem>>

    @Query("SELECT COUNT(*) FROM documents WHERE category = :category")
    fun getCategoryCount(category: String): Flow<Int>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertDocument(document: DocumentItem): Long

    @Update
    suspend fun updateDocument(document: DocumentItem)

    @Query("UPDATE documents SET title = :newTitle WHERE id = :id")
    suspend fun updateTitle(id: Long, newTitle: String)

    @Query("UPDATE documents SET category = :newCategory WHERE id = :id")
    suspend fun updateCategory(id: Long, newCategory: String)

    @Delete
    suspend fun deleteDocument(document: DocumentItem)

    @Query("DELETE FROM documents WHERE id = :id")
    suspend fun deleteDocumentById(id: Long)

    @Query("DELETE FROM documents")
    suspend fun clearAllDocuments()
}
