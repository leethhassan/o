package com.example.mustanadati.viewmodel

import android.app.Application
import android.graphics.Bitmap
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import com.example.mustanadati.data.DocumentDatabase
import com.example.mustanadati.model.DocumentCategory
import com.example.mustanadati.model.DocumentItem
import com.example.mustanadati.repository.DocumentRepository
import com.example.mustanadati.utils.FileStorageHelper
import com.example.mustanadati.utils.ImageCropperEnhancer
import com.example.mustanadati.utils.PdfGenerator
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch
import java.io.File

class MainViewModel(application: Application) : AndroidViewModel(application) {

    private val repository: DocumentRepository
    init {
        val db = DocumentDatabase.getDatabase(application)
        repository = DocumentRepository(db.documentDao())
    }

    val recentDocuments = repository.recentDocuments
    val allDocuments = repository.allDocuments

    private val _searchQuery = MutableStateFlow("")
    val searchQuery: StateFlow<String> = _searchQuery.asStateFlow()

    private val _selectedCategoryFilter = MutableStateFlow<String?>(null)
    val selectedCategoryFilter: StateFlow<String?> = _selectedCategoryFilter.asStateFlow()

    val filteredDocuments: StateFlow<List<DocumentItem>> = combine(
        allDocuments,
        _searchQuery,
        _selectedCategoryFilter
    ) { docs, query, cat ->
        docs.filter { item ->
            val matchesQuery = query.isBlank() ||
                    item.title.contains(query, ignoreCase = true) ||
                    item.category.contains(query, ignoreCase = true)
            val matchesCat = cat == null || item.category.equals(cat, ignoreCase = true)
            matchesQuery && matchesCat
        }
    }.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    // Active session image paths for creating PDF
    private val _stagedImagePaths = MutableStateFlow<List<String>>(emptyList())
    val stagedImagePaths: StateFlow<List<String>> = _stagedImagePaths.asStateFlow()

    // Temporary captured bitmap in scan mode
    private val _capturedBitmap = MutableStateFlow<Bitmap?>(null)
    val capturedBitmap: StateFlow<Bitmap?> = _capturedBitmap.asStateFlow()

    // Rotation angle
    private val _currentRotation = MutableStateFlow(0f)
    val currentRotation: StateFlow<Float> = _currentRotation.asStateFlow()

    // Theme mode setting
    private val _isDarkMode = MutableStateFlow<Boolean?>(null) // null = system default
    val isDarkMode: StateFlow<Boolean?> = _isDarkMode.asStateFlow()

    fun setSearchQuery(query: String) {
        _searchQuery.value = query
    }

    fun setCategoryFilter(category: String?) {
        _selectedCategoryFilter.value = category
    }

    fun setCapturedBitmap(bitmap: Bitmap?) {
        _capturedBitmap.value = bitmap
        _currentRotation.value = 0f
    }

    fun rotateCapturedImage() {
        _currentRotation.value = (_currentRotation.value + 90f) % 360f
    }

    fun applyHighContrastFilter() {
        val current = _capturedBitmap.value ?: return
        _capturedBitmap.value = ImageCropperEnhancer.enhanceContrastAndClarity(current, 1.4f, 15f)
    }

    fun applyGrayscaleFilter() {
        val current = _capturedBitmap.value ?: return
        _capturedBitmap.value = ImageCropperEnhancer.convertToDocumentScanGrayscale(current)
    }

    fun confirmCapturedImage(onDone: () -> Unit) {
        val bmp = _capturedBitmap.value ?: return
        val context = getApplication<Application>()
        val rotated = if (_currentRotation.value != 0f) {
            ImageCropperEnhancer.rotateBitmap(bmp, _currentRotation.value)
        } else {
            bmp
        }
        val fileName = "scan_page_${System.currentTimeMillis()}.jpg"
        val savedPath = FileStorageHelper.saveBitmapToInternalStorage(context, rotated, fileName)

        _stagedImagePaths.value = _stagedImagePaths.value + savedPath
        _capturedBitmap.value = null
        onDone()
    }

    fun addStagedImages(paths: List<String>) {
        _stagedImagePaths.value = _stagedImagePaths.value + paths
    }

    fun removeStagedImage(index: Int) {
        val list = _stagedImagePaths.value.toMutableList()
        if (index in list.indices) {
            list.removeAt(index)
            _stagedImagePaths.value = list
        }
    }

    fun reorderStagedImages(fromIndex: Int, toIndex: Int) {
        val list = _stagedImagePaths.value.toMutableList()
        if (fromIndex in list.indices && toIndex in list.indices) {
            val item = list.removeAt(fromIndex)
            list.add(toIndex, item)
            _stagedImagePaths.value = list
        }
    }

    fun clearStagedImages() {
        _stagedImagePaths.value = emptyList()
        _capturedBitmap.value = null
    }

    fun createAndSavePdf(
        title: String,
        category: String,
        quality: Int = 85,
        onSuccess: (DocumentItem) -> Unit,
        onError: (String) -> Unit
    ) {
        val imagePaths = _stagedImagePaths.value
        if (imagePaths.isEmpty()) {
            onError("لا توجد صور لإنشاء المستند")
            return
        }

        viewModelScope.launch {
            val context = getApplication<Application>()
            val result = PdfGenerator.createPdfFromImages(context, imagePaths, title, quality)
            result.onSuccess { pdfFile ->
                val newDoc = DocumentItem(
                    title = title.trim(),
                    category = category,
                    filePath = pdfFile.absolutePath,
                    thumbnailPath = imagePaths.firstOrNull(),
                    pagesCount = imagePaths.size,
                    sizeBytes = pdfFile.length(),
                    createdAt = System.currentTimeMillis()
                )
                val id = repository.insertDocument(newDoc)
                clearStagedImages()
                onSuccess(newDoc.copy(id = id))
            }.onFailure { error ->
                onError(error.localizedMessage ?: "حدث خطأ أثناء إنشاء ملف PDF")
            }
        }
    }

    fun renameDocument(id: Long, newTitle: String) {
        viewModelScope.launch {
            repository.renameDocument(id, newTitle.trim())
        }
    }

    fun updateCategory(id: Long, newCategory: String) {
        viewModelScope.launch {
            repository.updateCategory(id, newCategory)
        }
    }

    fun deleteDocument(doc: DocumentItem) {
        viewModelScope.launch {
            repository.deleteDocument(doc)
        }
    }

    fun clearAllDocuments() {
        viewModelScope.launch {
            repository.clearAllDocuments()
        }
    }

    fun setDarkMode(dark: Boolean?) {
        _isDarkMode.value = dark
    }
}
