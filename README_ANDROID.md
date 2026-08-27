# تطبيق "مستنداتي" (Mustanadati) 📱📄
### تطبيق أندرويد أصلي (Kotlin + Jetpack Compose + Material 3) لإدارة المستندات وتحويلها إلى PDF

---

## 🌟 المواصفات والميزات
- **الحزمة:** `com.example.mustanadati`
- **اللغة والواجهة:** 100% Kotlin + Jetpack Compose + Material 3
- **الاتجاه:** واجهة عربية أصيلة مع دعم RTL كامل
- **التخزين المحلي:** قاعدة بيانات SQLite عبر Room بدون الحاجة لأي خادم خارجي (Local-first & Offline)
- **إنشاء PDF:** تحويل الصور وصفحات المستندات الملتقطة بواسطة `PdfDocument` بجودات متعددة
- **معالجة الصور:** تدوير، قص، تحسين التباين، وتحويل للوضع الأبيض والأسود الماسح للوثائق
- **تنظيم وبحث فوري:** تصنيفات تلقائية (فواتير، دراسة، عمل، مستندات شخصية، أخرى) مع بحث لحظي سريع

---

## 🛠️ كيفية البناء والتشغيل من Termux على الهاتف أو أي جهاز:

### 1. المتطلبات في Termux:
```bash
pkg update && pkg upgrade
pkg install openjdk-17 git gradle
```

### 2. الدخول إلى مجلد المشروع وبناء التطبيق:
```bash
cd android
chmod +x gradlew
./gradlew assembleDebug
```

سيتم إنشاء ملف الـ APK النهائي في المسار:
`app/build/outputs/apk/debug/app-debug.apk`

---

## 📁 هيكلية المشروع:
- `app/src/main/java/com/example/mustanadati/`
  - `model/`: `DocumentItem.kt`, `DocumentCategory.kt`
  - `data/`: `DocumentDao.kt`, `DocumentDatabase.kt` (Room)
  - `repository/`: `DocumentRepository.kt`
  - `utils/`: `PdfGenerator.kt`, `ImageCropperEnhancer.kt`, `FileStorageHelper.kt`
  - `viewmodel/`: `MainViewModel.kt`
  - `navigation/`: `AppScreen.kt`
  - `ui/theme/`: `Theme.kt`, `Color.kt`, `Type.kt`
  - `ui/components/`: `CommonComponents.kt`
  - `ui/screens/`:
    - `HomeScreen.kt` (الرئيسية)
    - `CameraScanScreen.kt` (تصوير المستند)
    - `ImagePickerEditorScreen.kt` (اختيار الصور وترتيبها)
    - `PdfCreatorScreen.kt` (توليد الـ PDF والتسمية)
    - `DocumentListScreen.kt` (المستندات والبحث)
    - `CategoriesScreen.kt` (التصنيفات)
    - `DocumentDetailsScreen.kt` (تفاصيل المستند والمشاركة)
    - `SettingsScreen.kt` (الإعدادات والخصوصية)
