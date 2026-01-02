import React from 'react';
import {View, TouchableOpacity, StatusBar} from 'react-native';
import {WebView} from 'react-native-webview';
import {X} from 'lucide-react-native';
import {Portal} from '@gorhom/portal';
import styles from '../../styles/components/voice/YoutubePlayerModalStyles';

/**
 * YouTube 쇼츠 플레이어 모달
 * WebView로 YouTube 임베드 플레이어 표시
 */
export default function YoutubePlayerModal({visible, videoId, onClose}) {
  if (!visible || !videoId) return null;

  // YouTube nocookie 임베드 HTML (Privacy Enhanced Mode)
  const youtubeHTML = `
    <!DOCTYPE html>
    <html style='height:100%;width:100%'>
      <head>
        <meta name='viewport' content='width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no'>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body {
            background: #000;
            height: 100%;
            width: 100%;
            overflow: hidden;
          }
          .player-container {
            position: relative;
            width: 100%;
            height: 100%;
          }
          iframe {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            border: none;
          }
        </style>
      </head>
      <body>
        <div class="player-container">
          <iframe
            src='https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&playsinline=1&rel=0&modestbranding=1'
            frameborder='0'
            allow='accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture'
            referrerpolicy='strict-origin-when-cross-origin'
            allowfullscreen>
          </iframe>
        </div>
      </body>
    </html>
  `;

  return (
    <Portal>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />

      {/* 오버레이 */}
      <View style={styles.overlay}>
        {/* 컨테이너 */}
        <View style={styles.container}>
          {/* 닫기 버튼 */}
          <TouchableOpacity
            style={styles.closeButton}
            onPress={onClose}
            activeOpacity={0.8}>
            <X size={28} color="#FFFFFF" strokeWidth={2.5} />
          </TouchableOpacity>

          {/* YouTube WebView */}
          <WebView
            source={{
              html: youtubeHTML,
              baseUrl: 'https://www.youtube-nocookie.com',
            }}
            style={styles.webview}
            allowsFullscreenVideo
            allowsInlineMediaPlayback
            mediaPlaybackRequiresUserAction={false}
            javaScriptEnabled
            domStorageEnabled
            scrollEnabled={false}
            mixedContentMode="always"
            originWhitelist={['*']}
            allowsProtectedMedia
          />
        </View>
      </View>
    </Portal>
  );
}
