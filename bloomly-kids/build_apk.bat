call npm run build
call npx cap sync android
cd android
set "JAVA_HOME=C:\Program Files\Android\Android Studio\jbr"
call gradlew assembleDebug
cd ..
copy "android\app\build\outputs\apk\debug\app-debug.apk" ".\"
