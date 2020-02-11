import React, { useState, useEffect } from 'react';
import { Text, SafeAreaView, View, FlatList, TouchableOpacity, AsyncStorage, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';
import { formatDistance } from 'date-fns';
import socket from 'socket.io-client';
import br from 'date-fns/locale/pt-BR';
import api from '../services/api';

import styles from './styles';

export default function Box() {
  const [box, setBox] = useState({});
  useEffect(() => {
    async function getBox() {
      const boxStoraged = await AsyncStorage.getItem('@RocketBox:box');
      subscribeToNewFiles(boxStoraged);
      const response = await api.get(`boxes/${boxStoraged}`);

      setBox(response.data);
    }

    getBox();
  }, [box]);

  const subscribeToNewFiles = boxFile => {
    const io = socket('https://backend-omnistack-week6.herokuapp.com');

    io.emit('connectRoom', boxFile);

    io.emit('file', data => {
      setBox({ ...box, files: [data, ...box.files] });
    });
  };

  const openFile = async file => {
    try {
      const path = `${FileSystem.cacheDirectory}${file.title}`;
      await FileSystem.downloadAsync(file.url, path);
      await MediaLibrary.saveToLibraryAsync(path);
      Alert.alert('Deu certo, arquivo pronto na galeria!');
    } catch (err) {
      Alert.alert(`Deu erro: ${err}`);
    }
  };

  function renderItem({ item }) {
    return (
      <>
        <TouchableOpacity onPress={() => openFile(item)} style={styles.file}>
          <View style={styles.fileInfo}>
            <MaterialIcons name='insert-drive-file' size={24} color='#A5CFFF' />
            <Text style={styles.fileTitle}>{item.title}</Text>
          </View>
        </TouchableOpacity>

        <Text style={styles.fileDate}>
          <Text style={styles.fileDate}>
            há {formatDistance(new Date(item.createdAt), new Date(), { locale: br })}
          </Text>
        </Text>
      </>
    );
  }

  async function handleUpload() {
    const status = await ImagePicker.requestCameraPermissionsAsync();
    if (!status.granted) {
      Alert.alert('Sem permissão, sem RocketBox. Direitos iguais!');
    }

    const file = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsMultipleSelection: false
    });

    if (file.cancelled) {
      Alert.alert('Você cancelou, nada enviado.');
    } else {
      const uriParts = file.uri.split('.');
      const fileType = uriParts[uriParts.length - 1];
      const ext = fileType.toLowerCase() === 'heic' ? 'jpg' : fileType;

      // eslint-disable-next-line no-undef
      const data = new FormData();
      data.append('file', {
        uri: file.uri,
        name: `IMG_${new Date().getTime().toString()}.${ext}`,
        type: `image/${ext}`
      });

      const options = {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'multipart/form-data'
        }
      };
      await api.post(`boxes/${box._id}/files`, data, options);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.boxTitle}>{box.title}</Text>

      <FlatList
        style={styles.list}
        data={box.files}
        keyExtractor={file => file._id}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        renderItem={renderItem}
      />

      <TouchableOpacity style={styles.fab} onPress={() => handleUpload()}>
        <MaterialIcons name='cloud-upload' size={24} color='#FFF' />
      </TouchableOpacity>
    </SafeAreaView>
  );
}
