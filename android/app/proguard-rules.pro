# Keep all Firebase classes
-keep class com.google.firebase.** { *; }
-dontwarn com.google.firebase.**

-keep class com.google.firebase.sessions.** { *; }
-dontwarn com.google.firebase.sessions.**

-keep class com.google.firebase.Firebase { *; }
-dontwarn com.google.firebase.Firebase

-keep class com.swmansion.rnscreens.** { *; }
-dontwarn com.swmansion.rnscreens.**

-dontwarn org.slf4j.**
-keep class org.slf4j.** { *; }

-keep class com.reactnativecommunity.rnpermissions.** { *; }
-dontwarn com.reactnativecommunity.rnpermissions.**