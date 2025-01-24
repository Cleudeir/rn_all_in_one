import React, {useEffect, useRef, useState} from 'react';
import {BackHandler, Dimensions, StyleSheet, View} from 'react-native';
import {WebView, WebViewMessageEvent} from 'react-native-webview';
import {FileDownloadEvent} from 'react-native-webview/lib/WebViewTypes';
type Props = {
  baseUrl: string;
  whitelist: string[];
  isIframe?: boolean;
};

export const CustomWebView = ({
  baseUrl: uri,
  whitelist,
  isIframe,
}: Props): JSX.Element => {
  whitelist.push(uri);
  console.log('whitelist: ', JSON.stringify(whitelist, null, 2));
  const webViewRef = useRef<WebView | null>(null);
  const [canGoBack, setCanGoBack] = useState(false);
  const script = `
 (function () {
    // Define allowed domains for requests
    const allowedDomains =   [${whitelist
      .map(white => '"' + white + '"')
      .join(', ')}];  

    // Helper function to check if a URL is allowed
    function isAllowedUrl(url) {
        return allowedDomains.some(function(domain) { return url.startsWith(domain); });
    }

    // Override the window.fetch function
    const originalFetch = window.fetch;
    window.fetch = function (url, options) {
        if (url.startsWith('https://')) {
            if (!isAllowedUrl(url)) {
                window.ReactNativeWebView.postMessage(
                    JSON.stringify({ domain: 'Blocked fetch request: ' + url })
                );
                return Promise.reject(new Error('Blocked request'));
            }
            window.ReactNativeWebView.postMessage(
                JSON.stringify({ domain: 'Allowed fetch request: ' + url })
            );
        }
        return originalFetch(url, options);
    };

    // Override the XMLHttpRequest.prototype.open method
    const originalXhrOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function (method, url) {
        if (url.startsWith('https://')) {
            if (!isAllowedUrl(url)) {
                window.ReactNativeWebView.postMessage(
                    JSON.stringify({ domain: 'Blocked XMLHttpRequest request: ' + url })
                );
                return;
            }
            window.ReactNativeWebView.postMessage(
                JSON.stringify({ domain: 'Allowed XMLHttpRequest request: ' + url })
            );
        }
        return originalXhrOpen.apply(this, arguments);
    };
})();
`;

  const html = `
<!DOCTYPE html>
<html lang="en" style="margin: 0; padding: 0; width: 100%; height: 100%;">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>WebView Example</title>
  </head>
  <body style="margin: 0; padding: 0; width: 100%; height: 100%;">
    <Iframe frameborder="0" allowfullscreen="true" src="${uri}" style="width: 100% ; height: ${
    Dimensions.get('window').height - 60
  }px;margin: 0; padding: 0;"></Iframe>
    </body>
</html>
`;

  const handleMessage = async (event: WebViewMessageEvent) => {
    console.log('handleMessage');
    try {
      const data = JSON.parse(event.nativeEvent.data);
      console.log('data: ', JSON.stringify(data, null, 2));
    } catch (error) {
      console.error('Error parsing message from WebView:', error);
    }
  };

  const handleNavigation = (event: {url: string}) => {
    const checkUrl = whitelist.some(white => event.url.startsWith(white));
    if (!checkUrl) {
      return false;
    }
    return true;
  };

  const onAndroidBackPress = () => {
    if (canGoBack && webViewRef.current) {
      webViewRef.current.goBack();
      return true;
    } else {
      return true;
    }
  };

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      onAndroidBackPress,
    );
    return () => {
      backHandler.remove();
    };
  }, [canGoBack]);

  const handleFileDownload = (event: FileDownloadEvent) => {
    console.log('handleFileDownload');
    console.log('event: ', event.currentTarget);
  };

  return (
    <View style={styles.container}>
      <WebView
        ref={webViewRef}
        style={styles.webView}
        source={isIframe ? {html} : {uri}}
        onShouldStartLoadWithRequest={handleNavigation}
        allowsFullscreenVideo={true}
        onNavigationStateChange={navState => setCanGoBack(navState.canGoBack)}
        setSupportMultipleWindows={false}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        injectedJavaScript={script}
        cacheEnabled={true}
        cacheMode="LOAD_CACHE_ELSE_NETWORK"
        allowsLinkPreview={true}
        downloadingMessage="Downloading..."
        onFileDownload={handleFileDownload}
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
