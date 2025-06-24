# Keep all Firebase classes
-keep class com.google.firebase.** { *; }
-dontwarn com.google.firebase.**

-keep class com.google.firebase.sessions.** { *; }
-dontwarn com.google.firebase.sessions.**

-keep class com.swmansion.rnscreens.** { *; }
-dontwarn com.swmansion.rnscreens.**

# Also keep the generated module list and React Native interfaces
-keep class com.facebook.react.modules.core.DefaultHardwareBackBtnHandler
-keep class com.facebook.react.bridge.** { *; }
-keep class com.facebook.react.modules.** { *; }
-keep class com.facebook.react.ReactPackage


-dontwarn org.slf4j.**
-keep class org.slf4j.** { *; }
