import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { RNCamera } from 'react-native-camera';

const Setting = () => {
  const [scannedDataList, setScannedDataList] = useState<string[]>([]);
  const [data, setData] = useState('Scan Something')

  const handleScan = ({ data }: { data: string }) => {
    setData(data);
    setScannedDataList(prevDataList => [...prevDataList, data]);
  };
  return (
    <View style={{ flex: 1 }}>
      <QRCodeScanner
        onRead={handleScan}
        flashMode={RNCamera.Constants.FlashMode.torch}
        showMarker={true}
        reactivate={true}
        reactivateTimeout={500}
        topContent={
          // <Text style={styles.centerText}>
          //   Go to{' '}
          //   <Text style={styles.textBold}>wikipedia.org/wiki/QR_code</Text> on
          //   your computer and scan the QR code.
          // </Text>
          <ScrollView style={styles.listContainer} >
            <Text style={styles.buttonText}>Scanned QR Codes</Text>
            {scannedDataList.map((scannedData, index) => (
              <Text key={index} style={styles.listItem}>
                {scannedData}
              </Text>
            ))}
          </ScrollView>

        }
      />
    </View>
  )
}

export default Setting;

const styles = StyleSheet.create({
  centerText: {
    flex: 1,
    fontSize: 18,
    padding: 32,
    color: '#777',
    // marginBottom: 34
  },
  textBold: {
    fontWeight: '500',
    color: '#000'
  },
  buttonText: {
    fontSize: 18,
    color: 'rgb(0,122,255)'
  },
  listContainer: {
    // flex: 1,
    padding: 16,
    // marginBottom: 100
  },
  listItem: {
    fontSize: 16,
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
})