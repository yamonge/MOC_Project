package com.moc

import android.content.pm.PackageManager
import android.os.Build
import android.os.Bundle
import android.util.Base64
import android.util.Log
import android.view.View
import android.view.WindowInsetsController
import androidx.core.view.WindowCompat
import androidx.core.view.WindowInsetsCompat
import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate
import java.security.MessageDigest
import java.security.NoSuchAlgorithmException

class MainActivity : ReactActivity() {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  override fun getMainComponentName(): String = "moc"

  /**
   * Returns the instance of the [ReactActivityDelegate]. We use [DefaultReactActivityDelegate]
   * which allows you to enable New Architecture with a single boolean flags [fabricEnabled]
   */
  override fun createReactActivityDelegate(): ReactActivityDelegate =
      DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)

  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
    
    // ✅ Facebook Key Hash 출력 (디버그용)
    printKeyHash()
    
    // Edge-to-Edge 설정 (상태바/네비게이션바 뒤로 컨텐츠 확장)
    WindowCompat.setDecorFitsSystemWindows(window, false)
    
    // 시스템 바 숨기기 (현대적 방식)
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
      // Android 11+ (API 30+)
      window.insetsController?.let { controller ->
        controller.hide(WindowInsetsCompat.Type.statusBars() or WindowInsetsCompat.Type.navigationBars())
        controller.systemBarsBehavior = WindowInsetsController.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE
      }
    } else {
      // Android 10 이하 (하위 호환성)
      @Suppress("DEPRECATION")
      window.decorView.systemUiVisibility = (
        View.SYSTEM_UI_FLAG_LAYOUT_STABLE
        or View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
        or View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
        or View.SYSTEM_UI_FLAG_HIDE_NAVIGATION
        or View.SYSTEM_UI_FLAG_FULLSCREEN
        or View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY
      )
    }
  }
  
  /**
   * Facebook Key Hash 출력 (디버그용)
   * Logcat에서 "KeyHash:" 검색
   */
  private fun printKeyHash() {
    try {
      val info = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) {
        packageManager.getPackageInfo(
          packageName,
          PackageManager.GET_SIGNING_CERTIFICATES
        )
      } else {
        @Suppress("DEPRECATION")
        packageManager.getPackageInfo(
          packageName,
          PackageManager.GET_SIGNATURES
        )
      }
      
      val signatures = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) {
        info.signingInfo?.apkContentsSigners
      } else {
        @Suppress("DEPRECATION")
        info.signatures
      }
      
      signatures?.forEach { signature ->
        val md = MessageDigest.getInstance("SHA")
        md.update(signature.toByteArray())
        val keyHash = Base64.encodeToString(md.digest(), Base64.DEFAULT)
        Log.d("KeyHash", keyHash)
        println("🔑 Facebook KeyHash: $keyHash")
      }
    } catch (e: Exception) {
      Log.e("KeyHash", "Error getting key hash", e)
      println("❌ KeyHash Error: ${e.message}")
    }
  }
}
