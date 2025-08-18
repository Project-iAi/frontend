package com.frontendrnios

import android.app.Application
import android.util.Log
import com.facebook.react.PackageList
import com.facebook.react.ReactApplication
import com.facebook.react.ReactHost
import com.facebook.react.ReactNativeApplicationEntryPoint.loadReactNative
import com.facebook.react.ReactNativeHost
import com.facebook.react.ReactPackage
import com.facebook.react.defaults.DefaultReactHost.getDefaultReactHost
import com.facebook.react.defaults.DefaultReactNativeHost

class MainApplication : Application(), ReactApplication {

  companion object {
    private const val TAG = "MainApplication"
  }

  override val reactNativeHost: ReactNativeHost =
      object : DefaultReactNativeHost(this) {
        override fun getPackages(): List<ReactPackage> =
            PackageList(this).packages.apply {
              // Packages that cannot be autolinked yet can be added manually here, for example:
              // add(MyReactNativePackage())
            }

        override fun getJSMainModuleName(): String = "index"

        override fun getUseDeveloperSupport(): Boolean = BuildConfig.DEBUG

        override val isNewArchEnabled: Boolean = BuildConfig.IS_NEW_ARCHITECTURE_ENABLED
        override val isHermesEnabled: Boolean = BuildConfig.IS_HERMES_ENABLED
      }

  override val reactHost: ReactHost
    get() = getDefaultReactHost(applicationContext, reactNativeHost)

  override fun onCreate() {
    try {
      super.onCreate()
      Log.d(TAG, "MainApplication onCreate started")
      
      // 크래시 방지를 위한 전역 예외 처리기 설정
      Thread.setDefaultUncaughtExceptionHandler { thread, throwable ->
        Log.e(TAG, "Uncaught exception in thread ${thread.name}: ${throwable.message}", throwable)
        // 크래시 방지를 위해 예외를 로그로만 기록하고 앱은 계속 실행
      }
      
      loadReactNative(this)
      Log.d(TAG, "MainApplication onCreate completed successfully")
    } catch (e: Exception) {
      Log.e(TAG, "Error in MainApplication onCreate: ${e.message}", e)
      // 크래시 방지를 위해 기본 동작 수행
      super.onCreate()
    }
  }
}
