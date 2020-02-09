import React from 'react';
import { Text, View, Image, TextInput, TouchableOpacity } from 'react-native';

import styles from './styles';

import logo from '../assets/logo.png';

export default function Main() {
  return (
    <View style={styles.container}>
      <Image style={styles.logo} source={logo} />

      <TextInput
        style={styles.input}
        placeholder='Crie um box'
        placeholderTextColor='#999'
        autoCapitalize='none'
      />

      <TouchableOpacity onPress={() => {}} style={styles.button}>
        <Text style={styles.buttonText}>Criar</Text>
      </TouchableOpacity>
    </View>
  );
}
