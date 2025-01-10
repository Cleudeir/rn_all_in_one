import React, {useState, useRef, useEffect} from 'react';
import {StyleSheet, View, BackHandler} from 'react-native';
import {WebView, WebViewMessageEvent} from 'react-native-webview';

export const OverFlix = () => {
  const webViewRef = useRef<WebView | null>(null); // Ref for WebView
  const [canGoBack, setCanGoBack] = useState(false); // Manage back navigation state
  const baseUrl = 'https://overflixtv.im/';

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
    const startObserving = () =>{  
        const tagSources = [];
        const tags = document.querySelectorAll(['iframe' , 'video']);
        tags.forEach(tag => {
          if (tag.src) {
            tagSources.push(tag.src);
          }
            tag.click();
        });   
        window.ReactNativeWebView.postMessage(JSON.stringify({ tagSources }));      
    };

     addEventListener('click', startObserving);
  `;

  const handleMessage = async (event: WebViewMessageEvent) => {
    try {
      const {tagSources} = JSON.parse(event.nativeEvent.data);
      const message = `
        Video Sources: ${tagSources.join(', ') || 'None'}
      `;
      console.log('Media Sources Detected', message);
    } catch (error) {
      console.error('Error parsing message from WebView:', error);
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

export default OverFlix;
