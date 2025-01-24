import React from 'react';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';

import {screenName} from '../../App';

export type Props = {
  name: screenName;
  setSelected: React.Dispatch<React.SetStateAction<screenName | ''>>;
};

export function Card({name, setSelected}: Props): React.JSX.Element {
  return (
    <TouchableOpacity
      onPress={() => {
        setSelected(name as screenName);
      }}
      style={styles.containerButton}
      key={name}>
      <View style={styles.button}>
        <Text style={styles.buttonText}>{name}</Text>
      </View>
      <View style={[styles.button]}>
        <Text style={styles.buttonIcon}>{'▶︎'}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  containerButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    borderBottomWidth: 1,
    borderColor: '#cdd3e9',
    paddingBottom: 20,
  },
  button: {
    padding: 10,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#263258', // White text on dark background
    textAlign: 'center',
    fontSize: 16,
    width: '100%',
  },
  buttonIcon: {
    color: '#868a97', // White text on dark background
    textAlign: 'center',
    fontSize: 24,
    width: '100%',
  },
});
