import React, {useState, useRef, useEffect} from 'react';
import {StyleSheet, View, BackHandler} from 'react-native';
import {WebView, WebViewMessageEvent} from 'react-native-webview';

export const ShowMoviesSeries = () => {
  const webViewRef = useRef<WebView | null>(null); // Ref for WebView
  const [canGoBack, setCanGoBack] = useState(false); // Manage back navigation state
  const baseUrl = 'https://redecanaishd.im/';

  const handleNavigation = (event: {url: string}) => {
    // Ensure all navigation stays within the WebView
    if (!event.url.includes(baseUrl)) {
      console.log('block url: ', JSON.stringify(event.url, null, 2));
      return false; // Prevent navigation to external URLs
    }
    console.log('allow url: ', JSON.stringify(event.url, null, 2));
    return true; // Allow navigation within the same URL
  };

  const onAndroidBackPress = () => {
    if (canGoBack && webViewRef.current) {
      webViewRef.current.goBack(); // Navigate to the previous page
      return true; // Prevent default back button behavior
    } else {
      return false; // Allow the default back button behavior
    }
  };

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      onAndroidBackPress,
    );
    return () => {
      backHandler.remove(); // Cleanup the event listener
    };
  }, [canGoBack]);

  const script = `
    (function () {
  const allowedDomains = ['https://redecanaishd.im/'];

  // Override fetch
  const originalFetch = window.fetch;
  window.fetch = function (url, options) {
    const domain = url;
    if (!allowedDomains.includes(domain) && domain.startsWith('https://')) {
      window.ReactNativeWebView.postMessage(JSON.stringify({ domain: 'Blocked fetch request :' + domain }));
      return Promise.reject(new Error('Blocked request'));
    }
    window.ReactNativeWebView.postMessage(JSON.stringify({ domain: 'Allowed fetch request :' + domain }));
    return originalFetch(url, options);
  };

  // Override XMLHttpRequest
  const originalXhr = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function (method, url) {
    const domain = url;
    if (!allowedDomains.includes(domain) && domain.startsWith('https://')) {
      window.ReactNativeWebView.postMessage(JSON.stringify({ domain: 'Blocked XMLHttpRequest request :' + domain }));
      return;
    }
    window.ReactNativeWebView.postMessage(JSON.stringify({ domain: 'Allowed XMLHttpRequest request :' + domain }))
    return originalXhr.apply(this, arguments);
  };
})();

document.addEventListener('click', (event) => {

  window.ReactNativeWebView.postMessage(JSON.stringify({ event: 'click', target: event.target.id, type: event.type }));
  const rect = event.target.getBoundingClientRect();
  const details = {
    x: rect.left + window.scrollX,
    y: rect.top + window.scrollY,
    width: rect.width,
    height: rect.height,
    tagName: event.target.tagName,
  };

  window.ReactNativeWebView.postMessage(JSON.stringify(details));

});

const fixStyles = () => {
  document.querySelectorAll(['div', 'span']).forEach(
    element => {
      const position = window.getComputedStyle(element).position;
      if (position === 'absolute') {
       // element.style.display = 'none';
        window.ReactNativeWebView.postMessage(JSON.stringify({ element: element.id, position: position }));
      }
    });
};

setInterval(fixStyles, 2000);
 `;

  const handleMessage = async (event: WebViewMessageEvent) => {
    console.log('handleMessage');
    try {
      const data = JSON.parse(event.nativeEvent.data);
      console.log('Element Details:', data);
      if (data.x && data.y) {
        triggerClick(data.x, data.y);
      }
    } catch (error) {
      console.error('Error parsing message from WebView:', error);
    }
  };

  const triggerClick = (x: number, y: number) => {
    if (webViewRef.current) {
      const injectedScript = `
        const element = document.elementFromPoint(${x}, ${y});
        if (element) {
          element.click();
        }
      `;
      webViewRef.current.injectJavaScript(injectedScript);
    }
  };
  return (
    <View style={styles.container}>
      <WebView
        ref={webViewRef}
        style={styles.webView}
        source={{uri: baseUrl}}
        onShouldStartLoadWithRequest={handleNavigation}
        allowsFullscreenVideo={true}
        onNavigationStateChange={navState => setCanGoBack(navState.canGoBack)}
        setSupportMultipleWindows={false}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        injectedJavaScript={script}
        onMessage={handleMessage}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webView: {
    flex: 1,
  },
});

export default ShowMoviesSeries;
