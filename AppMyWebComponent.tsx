/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useState, useRef, useEffect} from 'react';
import {StyleSheet, View, Button, BackHandler, Alert} from 'react-native';
import {WebView} from 'react-native-webview';


export const MyWebComponent = () => {
  const webViewRef = useRef(null); // Ref for WebView
  const [canGoBack, setCanGoBack] = useState(false); // Manage back navigation state
  const [lastUrl, setLastUrl] = useState(baseUrl);
  const baseUrl = 'https://redecanaishd.im';

  const handleNavigation = event => {
    console.log('url: ', JSON.stringify(event.url, null, 2));
    // Ensure all navigation stays within the WebView
    if (!event.url.includes(baseUrl)) {  
      return false; // Prevent navigation to external URLs
    }
    setLastUrl(event.url);
    return true; // Allow navigation within the same URL
    
  };

  const onAndroidBackPress = () => {
    if (canGoBack) {
      webViewRef.current.goBack(); // Navigate to the previous page
      return true; // Prevent default back button behavior
    } else {
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
        onNavigationStateChange={navState => setCanGoBack(navState.canGoBack)} // Track navigation state
        setSupportMultipleWindows={false}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
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
  backButton: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    right: 10,
    backgroundColor: 'white',
    borderRadius: 5,
    elevation: 3,
  },
});

export default MyWebComponent;
