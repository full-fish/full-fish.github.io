---
title: "react-native-webview 웹뷰 흰페이지 나올때 해결법 (ssl ignore)"
date: 2023-11-30 13:22:51 +0900
render_with_liquid: false
categories: ["RN"]
tags: ["WebView", "웹뷰"]
---

특정 페이지가 에뮬레이터에서는 잘 나오는데 실기기에서 안나올 때가 있다

여러 이유가 있겠지만 주로 ssl인증 문제인것 같다

```bash
node_modules/react-native-webview/android/src/main/java/com/reactnativecommunity/webview/RNCWebviewManager.java
```

해당 파일에서

```bash
onReceivedSslError 함수 부분의
handler.cancle() 부분을
handler.proceed() 로 변경하면 ssl을 무시할 수 있다
```

참고로 최신 react-native-webview 버전이 12버전인데

12버전에서는 RNCWebviewManager.java가 없어서

npm i react-native-webview@11로 다운그레이드 했다
