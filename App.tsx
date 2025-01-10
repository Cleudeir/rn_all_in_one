import React from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  useColorScheme,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';

import {Y2mate} from './src/Y2mate';
import OverFlix from './src/OverFlix';

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: '#0d111d',
    flex: 1,
  };

  const [type, setType] = React.useState('OverFlix');

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={'light-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <View style={styles.container}>
        <View style={styles.containerButton}>
          <TouchableOpacity
            onPress={() => {
              setType('Y2mate');
            }}
            style={[styles.button]}>
            <Text style={styles.buttonText}>Y2mate</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setType('OverFlix');
            }}
            style={[styles.button]}>
            <Text style={styles.buttonText}>OverFlix</Text>
          </TouchableOpacity>
        </View>
        {type === 'Y2mate' && <Y2mate />}
        {type === 'OverFlix' && <OverFlix />}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  containerButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
  },
  button: {
    padding: 10,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff', // White text on dark background
    textAlign: 'center',
    fontSize: 16,
  },
});

export default App;
