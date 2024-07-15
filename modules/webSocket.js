import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import WebSocket from 'react-native-websocket';

const WebSocketComponent = () => {
  const [messages, setMessages] = useState([]);
  const espIP = '192.168.1.12'; // Replace with your ESP8266's IP address
  const espPort = 81; // The port you set in the ESP8266 WebSocket server

  return (
    <View style={styles.container}>
      <WebSocket
        url={`ws://${espIP}:${espPort}`}
        onOpen={() => {
          console.log('Connection opened');
        }}
        onMessage={event => {
          console.log('Received message:', event.data);
          setMessages(prevMessages => [...prevMessages, event.data]);
        }}
        onError={error => {
          console.error('Connection error:', error);
        }}
        onClose={() => {
          console.log('Connection closed');
        }}
      />
      <Text style={styles.header}>Received Messages:</Text>
      {messages.map((message, index) => (
        <Text key={index} style={styles.message}>
          {message}
        </Text>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  message: {
    fontSize: 16,
    marginBottom: 5,
  },
});

export default WebSocketComponent;
