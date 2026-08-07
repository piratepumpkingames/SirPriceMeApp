import { useEffect, useRef, useState } from 'react';
import { Button, Modal, StyleSheet, Text, View } from 'react-native';
import {
  SafeAreaProvider,
  SafeAreaView,
} from 'react-native-safe-area-context';
import { CameraView, useCameraPermissions } from 'expo-camera';
import type { ContentLocale } from '../lib/locale';
import { getStrings } from '../lib/locale';
import { colors, radii } from '../lib/theme';

type BarcodeScanModalProps = {
  visible: boolean;
  locale: ContentLocale;
  onScan: (barcode: string) => void;
  onCancel: () => void;
};

export function BarcodeScanModal({
  visible,
  locale,
  onScan,
  onCancel,
}: BarcodeScanModalProps) {
  const strings = getStrings(locale);
  const [permission, requestPermission] = useCameraPermissions();
  const [isReady, setIsReady] = useState(false);
  const scannedRef = useRef(false);

  useEffect(() => {
    if (visible) {
      scannedRef.current = false;
      setIsReady(false);
    }
  }, [visible]);

  async function ensurePermission() {
    if (permission?.granted) {
      return true;
    }

    const result = await requestPermission();
    return result.granted;
  }

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onCancel}>
      <SafeAreaProvider>
        <View style={styles.container}>
          <SafeAreaView edges={['top']} style={styles.header}>
            <Text style={styles.title}>{strings.scanBarcodeTitle}</Text>
            <Text style={styles.hint}>{strings.scanBarcodeHint}</Text>
          </SafeAreaView>

          {!permission?.granted ? (
            <View style={styles.permissionBox}>
              <Text style={styles.permissionText}>{strings.cameraPermission}</Text>
              <Button
                title={strings.scanBarcodeAllowCamera}
                onPress={() => void ensurePermission()}
              />
            </View>
          ) : (
            <CameraView
              style={styles.camera}
              facing="back"
              barcodeScannerSettings={{
                barcodeTypes: [
                  'ean13',
                  'ean8',
                  'upc_a',
                  'upc_e',
                  'code128',
                  'code39',
                  'qr',
                ],
              }}
              onCameraReady={() => setIsReady(true)}
              onBarcodeScanned={({ data }) => {
                if (scannedRef.current || !data.trim()) {
                  return;
                }

                scannedRef.current = true;
                onScan(data.trim());
              }}
            />
          )}

          <SafeAreaView edges={['bottom']} style={styles.controls}>
            <Button title={strings.cancel} onPress={onCancel} />
            {!isReady && permission?.granted ? (
              <Text style={styles.waiting}>{strings.scanBarcodeWaiting}</Text>
            ) : null}
          </SafeAreaView>
        </View>
      </SafeAreaProvider>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
  },
  header: {
    paddingHorizontal: 24,
    paddingBottom: 12,
  },
  title: {
    color: colors.white,
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
  },
  hint: {
    color: '#ccc',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
  },
  camera: {
    flex: 1,
    marginHorizontal: 16,
    borderRadius: radii.lg,
    overflow: 'hidden',
  },
  permissionBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    gap: 16,
  },
  permissionText: {
    color: colors.white,
    textAlign: 'center',
    fontSize: 15,
  },
  controls: {
    padding: 24,
    alignItems: 'center',
    gap: 8,
  },
  waiting: {
    color: '#aaa',
    fontSize: 13,
  },
});
