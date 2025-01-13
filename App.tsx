import React from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';

import {DownloadYouTube} from './src/DownloadYouTube';
import ShowMoviesSeries from './src/ShowMoviesSeries';

function App(): React.JSX.Element {
  const backgroundStyle = {
    backgroundColor: '#0d111d',
    flex: 1,
  };

  const [type, setType] = React.useState('ShowMoviesSeries');

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
              setType('Download YouTube');
            }}
            style={[styles.button]}>
            <Text style={styles.buttonText}>Download YouTube</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setType('ShowMoviesSeries');
            }}
            style={[styles.button]}>
            <Text style={styles.buttonText}>Movies</Text>
          </TouchableOpacity>
        </View>
        {type === 'Download YouTube' && <DownloadYouTube />}
        {type === 'ShowMoviesSeries' && <ShowMoviesSeries />}
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
