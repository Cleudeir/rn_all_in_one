import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';

import {DownloadYouTube} from './src/Screens/DownloadYouTube';
import {ShowMoviesSeries} from './src/Screens/ShowMoviesSeries';
import {Music} from './src/Screens/Music';
import {Header} from './src/Components/Header';
import {Card} from './src/Components/Card';
import {GPT} from './src/Screens/GPT';
import {Encurtador} from './src/Screens/Encurtador';
import {ImageToPdf} from './src/Screens/ImageToPdf';
import {BomberMan} from './src/Screens/BomberMan';

export type screenName =
  | 'Download YouTube'
  | 'Show Movies Series'
  | 'Music'
  | 'GPT'
  | 'Encurtador'
  | 'Image to PDF'
  | 'BomberMan';

function App(): React.JSX.Element {
  const backgroundStyle = {
    backgroundColor: '#ffff',
    flex: 1,
  };

  const [selected, setSelected] = React.useState<screenName | ''>('');

  const screens: Record<screenName, JSX.Element> = {
    'Download YouTube': <DownloadYouTube />,
    'Show Movies Series': <ShowMoviesSeries />,
    Music: <Music />,
    GPT: <GPT />,
    Encurtador: <Encurtador />,
    'Image to PDF': <ImageToPdf />,
    BomberMan: <BomberMan />,
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <Header selected={selected} setSelected={setSelected} />
      {!selected ? (
        <ScrollView style={styles.container}>
          {Object.entries(screens).map(
            ([key]): JSX.Element => (
              <Card
                key={key}
                setSelected={setSelected}
                name={key as screenName}
              />
            ),
          )}
        </ScrollView>
      ) : (
        screens[selected]
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
});

export default App;
