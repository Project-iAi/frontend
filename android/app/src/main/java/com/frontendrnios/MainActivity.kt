package com.frontendrnios

import android.os.Bundle
import android.util.Log
import android.widget.Toast
import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate

class MainActivity : ReactActivity() {

  companion object {
    private const val TAG = "MainActivity"
  }

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  override fun getMainComponentName(): String = "FrontendRNiOS"

  /**
   * Returns the instance of the [ReactActivityDelegate]. We use [DefaultReactActivityDelegate]
   * which allows you to enable New Architecture with a single boolean flags [fabricEnabled]
   */
  override fun createReactActivityDelegate(): ReactActivityDelegate =
      DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)

  override fun onCreate(savedInstanceState: Bundle?) {
    try {
      super.onCreate(savedInstanceState)
      Log.d(TAG, "MainActivity onCreate completed successfully")
    } catch (e: Exception) {
      Log.e(TAG, "Error in MainActivity onCreate: ${e.message}", e)
      // 크래시 방지를 위해 기본 동작 수행
      try {
        super.onCreate(savedInstanceState)
      } catch (e2: Exception) {
        Log.e(TAG, "Critical error in MainActivity onCreate: ${e2.message}", e2)
        // 최후의 수단으로 사용자에게 알림
        Toast.makeText(this, "앱 초기화 중 오류가 발생했습니다.", Toast.LENGTH_LONG).show()
      }
    }
  }

  override fun onResume() {
    try {
      super.onResume()
      Log.d(TAG, "MainActivity onResume completed")
    } catch (e: Exception) {
      Log.e(TAG, "Error in MainActivity onResume: ${e.message}", e)
      super.onResume()
    }
  }

  override fun onPause() {
    try {
      super.onPause()
      Log.d(TAG, "MainActivity onPause completed")
    } catch (e: Exception) {
      Log.e(TAG, "Error in MainActivity onPause: ${e.message}", e)
      super.onPause()
    }
  }
}
