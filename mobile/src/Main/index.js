import React, { useState, useEffect } from 'react';
import { Text, View, Image, TextInput, TouchableOpacity, AsyncStorage } from 'react-native';
import api from '../services/api';

import styles from './styles';

import logo from '../assets/logo.png';

export default function Main({ navigation }) {
  const [newBox, setNewBox] = useState('');

  useEffect(() => {
    async function getBox() {
      const box = await AsyncStorage.getItem('@RocketBox:box');
      if (box) {
        navigation.navigate('Box');
      }
    }

    getBox();
  }, []);

  async function handleSignIn() {
    const response = await api.post('boxes', { title: newBox });
    await AsyncStorage.setItem('@RocketBox:box', response.data._id);
    navigation.navigate('Box');
  }

  return (
    <View style={styles.container}>
      <Image style={styles.logo} source={logo} />

      <TextInput
        style={styles.input}
        placeholder='Crie um box'
        placeholderTextColor='#999'
        autoCapitalize='none'
        value={newBox}
        onChangeText={text => setNewBox(text)}
      />

      <TouchableOpacity onPress={() => handleSignIn()} style={styles.button}>
        <Text style={styles.buttonText}>Criar</Text>
      </TouchableOpacity>
    </View>
  );
}
