package com.example.mustanadati

import android.app.Application
import com.example.mustanadati.data.DocumentDatabase
import com.example.mustanadati.repository.DocumentRepository

class MustanadatiApp : Application() {
    val database by lazy { DocumentDatabase.getDatabase(this) }
    val repository by lazy { DocumentRepository(database.documentDao()) }

    override fun onCreate() {
        super.onCreate()
    }
}
