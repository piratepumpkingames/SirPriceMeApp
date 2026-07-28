import { useRef, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { CameraView, useCameraPermissions } from 'expo-camera';
import {
  ActivityIndicator,
  Alert,
  Button,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { analyzeItemPhoto, type AnalysisResult } from './lib/analyzeItem';

export default function App() {
  const cameraRef = useRef<CameraView>(null);
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [showCamera, setShowCamera] = useState(false);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [photoMimeType, setPhotoMimeType] = useState('image/jpeg');
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function takePhoto() {
    if (!cameraPermission?.granted) {
      const permission = await requestCameraPermission();
      if (!permission.granted) {
        alert('Camera permission is required to take photos.');
        return;
      }
    }

    setIsCameraReady(false);
    setShowCamera(true);
  }

  async function capturePhoto() {
    if (!cameraRef.current || !isCameraReady) {
      return;
    }

    const photo = await cameraRef.current.takePictureAsync({
      quality: 0.8,
    });

    if (photo?.uri) {
      setPhotoUri(photo.uri);
      setPhotoMimeType('image/jpeg');
      setAnalysis(null);
      setErrorMessage(null);
    }

    setShowCamera(false);
  }

  async function analyzePhoto() {
    if (!photoUri) {
      return;
    }

    setIsAnalyzing(true);
    setErrorMessage(null);

    try {
      const result = await analyzeItemPhoto(photoUri, photoMimeType);
      setAnalysis(result);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Something went wrong.';
      console.error('Analyze failed:', error);
      setErrorMessage(message);
      setAnalysis(null);
      Alert.alert('Analyze failed', message);
    } finally {
      setIsAnalyzing(false);
    }
  }

  return (
    <>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.container}>
          <Text style={styles.title}>SirPriceMe</Text>
          <Text style={styles.subtitle}>
            Take a photo of any object to estimate its value
          </Text>

          <View style={styles.buttonRow}>
            <Button title="Take photo" onPress={takePhoto} />
            {photoUri ? (
              <Button
                title={isAnalyzing ? 'Analyzing...' : 'Analyze'}
                onPress={analyzePhoto}
                disabled={isAnalyzing}
              />
            ) : null}
          </View>

          {isAnalyzing ? (
            <ActivityIndicator size="large" style={styles.loader} />
          ) : null}

          {photoUri ? (
            <Image source={{ uri: photoUri }} style={styles.preview} />
          ) : (
            <Text style={styles.hint}>Your photo will appear here</Text>
          )}

          {errorMessage ? (
            <Text selectable style={styles.error}>
              {errorMessage}
            </Text>
          ) : null}

          {analysis ? (
            <View style={styles.resultCard}>
              <Text style={styles.resultTitle}>{analysis.objectName}</Text>
              <Text style={styles.price}>
                ~€{analysis.estimatedPriceEUR.toFixed(0)}
              </Text>
              <Text style={styles.label}>Condition</Text>
              <Text style={styles.value}>{analysis.condition}</Text>
              <Text style={styles.label}>Explanation</Text>
              <Text style={styles.value}>{analysis.explanation}</Text>
            </View>
          ) : null}

          <StatusBar style="auto" />
        </View>
      </ScrollView>

      <Modal visible={showCamera} animationType="slide">
        <View style={styles.cameraContainer}>
          <CameraView
            ref={cameraRef}
            facing="back"
            style={styles.camera}
            onCameraReady={() => setIsCameraReady(true)}
          />
          <View style={styles.cameraControls}>
            <Button title="Cancel" onPress={() => setShowCamera(false)} />
            <Button
              title="Capture"
              onPress={capturePhoto}
              disabled={!isCameraReady}
            />
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  buttonRow: {
    gap: 12,
    marginBottom: 24,
  },
  loader: {
    marginBottom: 16,
  },
  preview: {
    width: 280,
    height: 280,
    borderRadius: 12,
    resizeMode: 'cover',
    marginBottom: 16,
  },
  hint: {
    color: '#999',
    fontSize: 14,
  },
  error: {
    color: '#b00020',
    textAlign: 'left',
    marginBottom: 16,
    width: '100%',
    fontSize: 13,
  },
  resultCard: {
    width: '100%',
    backgroundColor: '#f5f7fb',
    borderRadius: 12,
    padding: 16,
  },
  resultTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  price: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1a7f37',
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#444',
    marginBottom: 4,
  },
  value: {
    fontSize: 15,
    color: '#333',
    marginBottom: 12,
  },
  cameraContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
  },
  cameraControls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 24,
    backgroundColor: '#111',
  },
});
