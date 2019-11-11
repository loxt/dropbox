import React, { useState } from 'react';
import api from "../../services/api";

import './styles.css';
import logo from '../../assets/logo.png';

export default function Main(props) {
  const [newBox, setNewBox] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();

    const response = await api.post('boxes', {
      title: newBox,
    });

    const { _id } = response.data;
    props.history.push(`/box/${_id}`);
  }

  return (
    <div id="main-container">
      <form onSubmit={handleSubmit}>
        <img src={logo} alt="lostbox"/>
        <input type="text" placeholder="Criar um box" value={newBox} onChange={e => setNewBox(e.target.value)}/>
        <button type="submit">Criar</button>
      </form>
    </div>
  )
};
