import React, {useState, useEffect} from 'react';
import api from "../../services/api";
import {formatDistance} from 'date-fns';
import pt from 'date-fns/locale/pt';
import Dropzone from "react-dropzone";
import socket from 'socket.io-client';

import './styles.css';

import logo from '../../assets/logo.png';

import {MdInsertDriveFile} from 'react-icons/md';

export default function Box(props) {
  const [box, setBox] = useState({});

  useEffect(() => {
    const getBox = async () => {
      const box = props.match.params.id;
      const response = await api.get(`boxes/${box}`);
      setBox(response.data);
    };

    getBox().then(null);
  });

  const subscribeToNewFiles = () => {
    const box = props.match.params.id;
    const io = socket('https://backend-omnistack-week6.herokuapp.com/');

    io.emit('connectRoom', box);

    io.on('file', data => {
      setBox({...box, files: [data, ...box.files]})
    })
  };

  const handleUpload = (files) => {
    files.forEach(file => {
      const box = props.match.params.id;
      const data = new FormData();

      data.append('file', file);

      api.post(`boxes/${box}/files`, data).then(null);
    })
  };

  return (
    <div id="box-container">
      <header>
        <img src={logo} alt=""/>
        <h1>{box.title}</h1>
      </header>

      <Dropzone onDropAccepted={handleUpload}>
        {({getRootProps, getInputProps}) => (
          <div className="upload" {...getRootProps()}>
            <input {...getInputProps()}/>
            <p>Arraste arquivos ou clique aqui</p>
          </div>
        )}
      </Dropzone>

      <ul>
        {box.files && box.files.map(({createdAt, title, url, _id}) => (
          <li key={_id}>

            <a className="fileInfo" href={url} target="_blank" rel="noopener noreferrer">
              <MdInsertDriveFile size={24} color="#A5CFFF"/>
              <strong>{title}</strong>
            </a>

            <span>criado faz {formatDistance(new Date(createdAt), new Date(), {locale: pt})}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
