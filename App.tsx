import { useRef, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { CameraView, useCameraPermissions } from 'expo-camera';
import {
  ActivityIndicator,
  Alert,
  Button,
  Image,
  Linking,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { analyzeItemPhoto, type AnalysisResult } from './lib/analyzeItem';
import {
  getDeviceLocale,
  getLocalLanguageLabel,
  getStrings,
  resolveContentLocale,
  type LanguageMode,
} from './lib/locale';
import { getMarketplaceLinks } from './lib/marketplaceLinks';

export default function App() {
  const cameraRef = useRef<CameraView>(null);
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [languageMode, setLanguageMode] = useState<LanguageMode>('local');
  const [showCamera, setShowCamera] = useState(false);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [photoMimeType, setPhotoMimeType] = useState('image/jpeg');
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { regionCode } = getDeviceLocale();
  const contentLocale = resolveContentLocale(languageMode);
  const strings = getStrings(contentLocale);
  const localLanguageLabel = getLocalLanguageLabel();

  function setLanguage(mode: LanguageMode) {
    setLanguageMode(mode);
    setAnalysis(null);
    setErrorMessage(null);
  }

  async function takePhoto() {
    if (!cameraPermission?.granted) {
      const permission = await requestCameraPermission();
      if (!permission.granted) {
        alert(strings.cameraPermission);
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
      const result = await analyzeItemPhoto(
        photoUri,
        photoMimeType,
        contentLocale,
        regionCode,
      );
      setAnalysis(result);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : strings.genericError;
      console.error('Analyze failed:', error);
      setErrorMessage(message);
      setAnalysis(null);
      Alert.alert(strings.analyzeFailedTitle, message);
    } finally {
      setIsAnalyzing(false);
    }
  }

  async function openMarketplaceLink(url: string) {
    try {
      await Linking.openURL(url);
    } catch {
      Alert.alert(strings.linkOpenFailedTitle, strings.linkOpenFailedMessage);
    }
  }

  return (
    <>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.container}>
          <Text style={styles.title}>SirPriceMe</Text>
          <Text style={styles.subtitle}>{strings.subtitle}</Text>

          <Text style={styles.languageLabel}>{strings.languageLabel}</Text>
          <View style={styles.languageRow}>
            <Pressable
              style={[
                styles.languageOption,
                languageMode === 'en' && styles.languageOptionActive,
              ]}
              onPress={() => setLanguage('en')}
            >
              <Text
                style={[
                  styles.languageOptionText,
                  languageMode === 'en' && styles.languageOptionTextActive,
                ]}
              >
                {strings.languageEnglish}
              </Text>
            </Pressable>
            <Pressable
              style={[
                styles.languageOption,
                languageMode === 'local' && styles.languageOptionActive,
              ]}
              onPress={() => setLanguage('local')}
            >
              <Text
                style={[
                  styles.languageOptionText,
                  languageMode === 'local' && styles.languageOptionTextActive,
                ]}
              >
                {localLanguageLabel}
              </Text>
            </Pressable>
          </View>

          <View style={styles.buttonRow}>
            <Button title={strings.takePhoto} onPress={takePhoto} />
            {photoUri ? (
              <Button
                title={isAnalyzing ? strings.analyzing : strings.analyze}
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
            <Text style={styles.hint}>{strings.photoHint}</Text>
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
              <Text style={styles.label}>{strings.condition}</Text>
              <Text style={styles.value}>{analysis.condition}</Text>
              <Text style={styles.label}>{strings.explanation}</Text>
              <Text style={styles.value}>{analysis.explanation}</Text>

              <Text style={styles.label}>{strings.whereToSell}</Text>
              <Text style={styles.marketplaceHint}>{strings.marketplaceHint}</Text>
              {getMarketplaceLinks(
                analysis.marketplaceSearchQuery,
                regionCode,
                contentLocale,
              ).map((link) => (
                <Pressable
                  key={link.id}
                  style={styles.marketplaceLink}
                  onPress={() => openMarketplaceLink(link.url)}
                >
                  <Text style={styles.marketplaceLinkText}>{link.label}</Text>
                </Pressable>
              ))}
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
            <Button
              title={strings.cameraCancel}
              onPress={() => setShowCamera(false)}
            />
            <Button
              title={strings.cameraCapture}
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
    marginBottom: 16,
  },
  languageLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#444',
    marginBottom: 8,
    alignSelf: 'flex-start',
    width: '100%',
  },
  languageRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 24,
    width: '100%',
  },
  languageOption: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    alignItems: 'center',
  },
  languageOptionActive: {
    borderColor: '#1a5fb4',
    backgroundColor: '#e8f2ff',
  },
  languageOptionText: {
    fontSize: 14,
    color: '#444',
    fontWeight: '500',
  },
  languageOptionTextActive: {
    color: '#1a5fb4',
    fontWeight: '700',
  },
  buttonRow: {
    gap: 12,
    marginBottom: 24,
    width: '100%',
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
  marketplaceHint: {
    fontSize: 13,
    color: '#666',
    marginBottom: 12,
  },
  marketplaceLink: {
    backgroundColor: '#fff',
    borderColor: '#1a5fb4',
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  marketplaceLinkText: {
    color: '#1a5fb4',
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
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
