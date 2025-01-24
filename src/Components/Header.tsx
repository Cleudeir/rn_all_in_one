import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import {screenName} from '../../App';

type Props = {
  selected: screenName | '';
  setSelected: React.Dispatch<React.SetStateAction<screenName | ''>>;
};

export function Header({selected, setSelected}: Props): React.JSX.Element {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, selected === '' && {display: 'none'}]}
        onPress={() => setSelected('')}>
        <Text style={styles.buttonText}>{'<'}</Text>
      </TouchableOpacity>
      <Text style={styles.buttonText}>{selected || 'Home'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#263258',
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    left: 15,
    borderColor: '#fff',
    borderWidth: 1,
    borderRadius: 500,
    paddingVertical: 8,
    paddingHorizontal: 15,
  },
  buttonText: {
    color: '#fff', // White text on dark background
    textAlign: 'center',
    fontSize: 16,
  },
});
