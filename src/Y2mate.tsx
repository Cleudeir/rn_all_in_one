import React, {useState, useRef, useEffect} from 'react';
import {StyleSheet, View, BackHandler} from 'react-native';
import {WebView, WebViewMessageEvent} from 'react-native-webview';

export const Y2mate = () => {
  const webViewRef = useRef<WebView | null>(null); // Ref for WebView
  const [canGoBack, setCanGoBack] = useState(false); // Manage back navigation state
  const baseUrl = 'https://www.y2mate.com/en1959/youtube-mp3';

  const script = `
  document.addEventListener('click', (event) => {   
      const clickedElement = event.target; // Get the clicked element   
      window.ReactNativeWebView.postMessage(JSON.stringify({ clickedElement }));
    });
`;

  const handleMessage = async (event: WebViewMessageEvent) => {
    console.log('handleMessage');
    try {
      const {clickedElement} = JSON.parse(event.nativeEvent.data);
      console.log('Element Details:', clickedElement);
    } catch (error) {
      console.error('Error parsing message from WebView:', error);
    }
  };

  const handleNavigation = (event: {url: string}) => {
    // Ensure all navigation stays within the WebView
    const whitelist = ['https://www.y2mate.com'];
    let checkUrl = whitelist.some(white => event.url.startsWith(white));

    // example 'https://dl258.dmate8.online/',
    const isDownloadServer =
      event.url.includes('https://dl') &&
      event.url.split('.')[1].startsWith('dmate') &&
      event.url.includes('.online/');
    if (isDownloadServer) {
      checkUrl = true;
    }

    console.log('checkUrl', checkUrl);
    if (!checkUrl) {
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
      webViewRef.current?.goForward(); // Go to the next page if no history
      return true; // Prevent default behavior
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

export default Y2mate;
