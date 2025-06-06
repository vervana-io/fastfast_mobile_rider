package com.facebook.react.flipper

import android.content.Context
import com.facebook.flipper.android.AndroidFlipperClient
import com.facebook.flipper.plugins.crashreporter.CrashReporterPlugin
import com.facebook.flipper.plugins.databases.DatabasesFlipperPlugin
import com.facebook.flipper.plugins.inspector.DescriptorMapping
import com.facebook.flipper.plugins.inspector.InspectorFlipperPlugin
import com.facebook.flipper.plugins.network.FlipperOkhttpInterceptor
import com.facebook.flipper.plugins.network.NetworkFlipperPlugin
import com.facebook.flipper.plugins.sharedpreferences.SharedPreferencesFlipperPlugin
import com.facebook.react.ReactInstanceManager

object ReactNativeFlipper {
    @JvmStatic
    fun initializeFlipper(context: Context, reactInstanceManager: ReactInstanceManager) {
        if (AndroidFlipperClient.getInstanceIfInitialized() != null) {
            val client = AndroidFlipperClient.getInstance(context)
            client.addPlugin(InspectorFlipperPlugin(context, DescriptorMapping.withDefaults()))
            client.addPlugin(DatabasesFlipperPlugin(context))
            client.addPlugin(SharedPreferencesFlipperPlugin(context))
            client.addPlugin(NetworkFlipperPlugin())
            client.addPlugin(CrashReporterPlugin.getInstance())
            client.start()
        }
    }
}