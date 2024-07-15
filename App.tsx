import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

const App = () => {
  const [data, setData] = useState({});
  const [connected, setConnected] = useState(false);
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    connectWebSocket('ws://192.168.0.197:81');

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, []);

  const connectWebSocket = (url: string) => {
    if (ws.current) {
      ws.current.close();
    }

    ws.current = new WebSocket(url);
    ws.current.onopen = () => {
      setConnected(true);
      console.log('Connected to WebSocket server');
    };

    ws.current.onmessage = event => {
      const message = event.data;
      console.log('Received message:', message);

      try {
        const jsonData = JSON.parse(message);
        setData(jsonData);
        console.log('Parsed JSON:', jsonData);
      } catch (error) {
        console.error('Failed to parse JSON:', error);
      }
    };

    ws.current.onerror = event => {
      console.log(`Error occurred: ${event.message}`);
    };

    ws.current.onclose = () => {
      setConnected(false);
      console.log('Disconnected from WebSocket server');
    };
  };

  const handleToggleRelay = (relayNumber: number) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      const command =
        JSON.stringify({
          command: 'toggleRelay',
          relay: relayNumber,
        }) + '\n';
      ws.current.send(command);
      console.log(`Sent command: ${command}`);
    } else {
      console.log('WebSocket not connected');
    }
  };

  const CustomButton = ({title, onPress, relayName}) => {
    const isOn = data[relayName];
    const buttonStyle = isOn
      ? [styles.button, styles.buttonOn]
      : [styles.button, styles.buttonOff];
    const buttonText = `${title} - ${isOn ? 'ON' : 'OFF'}`;

    return (
      <TouchableOpacity style={buttonStyle} onPress={() => onPress(relayName)}>
        <Text style={styles.buttonText}>{buttonText}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Smart Home Dashboard</Text>
      </View>
      <View style={styles.statusContainer}>
        <Text style={styles.statusText}>
          Connected: {connected ? 'Yes' : 'No'}
        </Text>
      </View>
      <View style={styles.dataContainer}>
        <Text style={styles.sectionTitle}>Sensor Data</Text>
        <View style={styles.dataRow}>
          <Text style={styles.dataLabel}>Outside Temperature:</Text>
          <Text style={styles.dataValue}>{data.temperatureValue} °C</Text>
        </View>
        <View style={styles.dataRow}>
          <Text style={styles.dataLabel}>Thermistor Value:</Text>
          <Text style={styles.dataValue}>{data.thermistorValue}</Text>
        </View>
        <View style={styles.dataRow}>
          <Text style={styles.dataLabel}>Humidity:</Text>
          <Text style={styles.dataValue}>{data.humidityValue} %</Text>
        </View>
        <View style={styles.dataRow}>
          <Text style={styles.dataLabel}>Brightness:</Text>
          <Text style={styles.dataValue}>{data.brightnessValue} lux</Text>
        </View>
        <View style={styles.dataRow}>
          <Text style={styles.dataLabel}>Wind Speed:</Text>
          <Text style={styles.dataValue}>{data.windValue} m/s</Text>
        </View>
        <View style={styles.dataRow}>
          <Text style={styles.dataLabel}>Battery Percentage:</Text>
          <Text style={styles.dataValue}>{data.batteryPercentage} %</Text>
        </View>
        <View style={styles.dataRow}>
          <Text style={styles.dataLabel}>Current:</Text>
          <Text style={styles.dataValue}>{data.currentValue} A</Text>
        </View>
        <View style={styles.dataRow}>
          <Text style={styles.dataLabel}>Voltage:</Text>
          <Text style={styles.dataValue}>{data.voltageValue} V</Text>
        </View>
        <View style={styles.dataRow}>
          <Text style={styles.dataLabel}>Power:</Text>
          <Text style={styles.dataValue}>
            {(data.voltageValue * data.currentValue).toFixed(2)} W
          </Text>
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <Text style={styles.sectionTitle}>Control Relays</Text>
        <CustomButton
          title="Relay 1"
          onPress={() => handleToggleRelay(1)}
          relayName="relay1"
        />
        <CustomButton
          title="Relay 2"
          onPress={() => handleToggleRelay(2)}
          relayName="relay2"
        />
        <CustomButton
          title="Relay 3"
          onPress={() => handleToggleRelay(3)}
          relayName="relay3"
        />
        <CustomButton
          title="Relay 4"
          onPress={() => handleToggleRelay(4)}
          relayName="relay4"
        />
        <CustomButton
          title="Consumer"
          onPress={() => handleToggleRelay(5)}
          relayName="socketRelay"
        />
        <CustomButton
          title="Battery"
          onPress={() => handleToggleRelay(6)}
          relayName="invtobatRelay"
        />
        <CustomButton
          title="Panel"
          onPress={() => handleToggleRelay(7)}
          relayName="paneltoinvRelay"
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  header: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#4CAF50',
    borderRadius: 10,
    alignItems: 'center',
  },
  headerText: {
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  statusContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  statusText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
  },
  buttonContainer: {
    marginVertical: 20,
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 10,
    textAlign: 'center',
  },
  button: {
    width: '90%',
    padding: 15,
    marginVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonOn: {
    backgroundColor: '#4CAF50',
  },
  buttonOff: {
    backgroundColor: 'transparent',
    borderColor: '#4CAF50',
    borderWidth: 4,
    color: '#4CAF50',
  },
  buttonText: {
    color: '#333333',
    fontSize: 16,
    fontWeight: 'bold',
  },
  dataContainer: {
    marginVertical: 20,
  },
  dataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#DDDDDD',
  },
  dataLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
  },
  dataValue: {
    fontSize: 16,
    color: '#666666',
  },
});

export default App;
