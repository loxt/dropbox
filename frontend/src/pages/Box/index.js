import React, { useState, useEffect } from 'react';
import { formatDistance } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Dropzone from 'react-dropzone';
import socket from 'socket.io-client';

import { MdInsertDriveFile } from 'react-icons/md';
import api from '../../services/api';

import logo from '../../assets/logo.png';

export default function Box(props) {
  const [box, setBox] = useState({});

  const subscribeToNewFiles = () => {
    const io = socket('https://backend-omnistack-week6.herokuapp.com');

    io.emit('connectRoom', props.match.params.id);

    io.on('file', (data) => {
      setBox({ ...box, files: [data, ...box.files] });
    });
  };

  useEffect(() => {
    const getBox = async () => {
      subscribeToNewFiles();
      const response = await api.get(`boxes/${box}`);
      setBox(response.data);
    };

    getBox().then(null);
  });

  const handleUpload = (files) => {
    files.forEach((file) => {
      const data = new FormData();
      const boxId = props.match.params.id;
      data.append('file', file);
      api.post(`/boxes/${boxId}/files`, data);
    });
  };

  return (
    <div id='box-container'>
      <header>
        <img src={logo} alt='' />
        <h1>{box.title}</h1>
      </header>
      <Dropzone onDropAccepted={handleUpload}>
        {({ getRootProps, getInputProps }) => (
          <div className='upload' {...getRootProps()}>
            <input {...getInputProps()} />
            <p>Arraste arquivos ou clique aqui</p>
          </div>
        )}
      </Dropzone>

      <ul>
        {box.files &&
          box.files.map(({ createdAt, title, url, _id }) => (
            <li key={_id}>
              <a className='fileInfo' href={url} target='_blank' rel='noopener noreferrer'>
                <MdInsertDriveFile size={24} color='#A5CFFF' />
                <strong>{title}</strong>
              </a>

              <span>criado faz {formatDistance(new Date(createdAt), new Date(), { locale: pt })}</span>
            </li>
          ))}
      </ul>
    </div>
  );
}
