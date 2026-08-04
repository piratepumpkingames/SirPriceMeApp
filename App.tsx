import { useEffect, useMemo, useRef, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { CameraView, useCameraPermissions } from 'expo-camera';
import {
  ActivityIndicator,
  Alert,
  Button,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { DisclaimerModal } from './components/DisclaimerModal';
import { EditItemModal, type ItemEditDraft } from './components/EditItemModal';
import { ManageRoomsModal } from './components/ManageRoomsModal';
import { MarkSoldModal } from './components/MarkSoldModal';
import { RoomPickerModal } from './components/RoomPickerModal';
import { analyzeItemPhoto } from './lib/analyzeItem';
import {
  formatString,
  getDeviceLocale,
  getLocalLanguageLabel,
  getStrings,
  resolveContentLocale,
  type LanguageMode,
} from './lib/locale';
import {
  addCustomRoom,
  deleteCustomRoom,
  loadCustomRooms,
  updateCustomRoom,
  type CustomRoom,
} from './lib/storage/customRooms';
import {
  isDisclaimerAccepted,
  setDisclaimerAccepted,
} from './lib/storage/disclaimer';
import {
  countItemsInRoom,
  deleteItemById,
  getCatalogItems,
  loadItems,
  persistPhotoUri,
  upsertItem,
} from './lib/storage/items';
import { CatalogScreen } from './screens/CatalogScreen';
import { ResultHubScreen } from './screens/ResultHubScreen';
import { SellScreen } from './screens/SellScreen';
import { createItemFromAnalysis, type ItemRecord } from './types/item';

type Screen = 'home' | 'result' | 'sell' | 'catalog';

export default function App() {
  const cameraRef = useRef<CameraView>(null);
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [languageMode, setLanguageMode] = useState<LanguageMode>('local');
  const [screen, setScreen] = useState<Screen>('home');
  const [showCamera, setShowCamera] = useState(false);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [photoMimeType, setPhotoMimeType] = useState('image/jpeg');
  const [currentItem, setCurrentItem] = useState<ItemRecord | null>(null);
  const [catalogItems, setCatalogItems] = useState<ItemRecord[]>([]);
  const [customRooms, setCustomRooms] = useState<CustomRoom[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const [showRoomPicker, setShowRoomPicker] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showMarkSoldModal, setShowMarkSoldModal] = useState(false);
  const [showManageRoomsModal, setShowManageRoomsModal] = useState(false);

  const { regionCode } = getDeviceLocale();
  const contentLocale = resolveContentLocale(languageMode);
  const strings = getStrings(contentLocale);
  const localLanguageLabel = getLocalLanguageLabel();
  const catalogCount = getCatalogItems(catalogItems).length;
  const itemCountByRoomId = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const room of customRooms) {
      counts[room.id] = countItemsInRoom(catalogItems, room.id);
    }
    return counts;
  }, [catalogItems, customRooms]);

  useEffect(() => {
    void refreshCatalog();
    void refreshCustomRooms();
  }, []);

  async function refreshCatalog() {
    const items = await loadItems();
    setCatalogItems(Array.isArray(items) ? items : []);
  }

  async function refreshCustomRooms() {
    const rooms = await loadCustomRooms();
    setCustomRooms(Array.isArray(rooms) ? rooms : []);
  }

  async function saveItem(item: ItemRecord): Promise<ItemRecord> {
    const saved = await upsertItem(item);
    await refreshCatalog();
    return saved;
  }

  function setLanguage(mode: LanguageMode) {
    setLanguageMode(mode);
    setErrorMessage(null);
  }

  function resetScan() {
    setPhotoUri(null);
    setCurrentItem(null);
    setErrorMessage(null);
    setScreen('home');
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

    const photo = await cameraRef.current.takePictureAsync({ quality: 0.8 });

    if (photo?.uri) {
      setPhotoUri(photo.uri);
      setPhotoMimeType('image/jpeg');
      setCurrentItem(null);
      setErrorMessage(null);
      setScreen('home');
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
      const analysis = await analyzeItemPhoto(
        photoUri,
        photoMimeType,
        contentLocale,
        regionCode,
      );
      const item = await saveItem(
        createItemFromAnalysis(analysis, photoUri, photoMimeType),
      );
      setCurrentItem(item);
      setScreen('result');
    } catch (error) {
      const message =
        error instanceof Error ? error.message : strings.genericError;
      console.error('Analyze failed:', error);
      setErrorMessage(message);
      Alert.alert(strings.analyzeFailedTitle, message);
    } finally {
      setIsAnalyzing(false);
    }
  }

  async function beginAddToCatalog() {
    if (!currentItem) {
      return;
    }

    const accepted = await isDisclaimerAccepted();
    if (accepted) {
      setShowRoomPicker(true);
    } else {
      setShowDisclaimer(true);
    }
  }

  async function handleDisclaimerAccept(dontShowAgain: boolean) {
    if (dontShowAgain) {
      await setDisclaimerAccepted();
    }
    setShowDisclaimer(false);
    setShowRoomPicker(true);
  }

  async function handleRoomSelect(roomId: string) {
    if (!currentItem) {
      return;
    }

    setShowRoomPicker(false);

    try {
      let photoUriToSave = currentItem.photoUri;
      if (!currentItem.inCatalog) {
        photoUriToSave = await persistPhotoUri(currentItem.photoUri);
      }

      const updated = await saveItem({
        ...currentItem,
        photoUri: photoUriToSave,
        inCatalog: true,
        roomId,
      });
      setCurrentItem(updated);
      Alert.alert(strings.savedToCatalog);

      if (!updated.forSale) {
        Alert.alert(strings.alsoSellTitle, strings.alsoSellMessage, [
          { text: strings.no, style: 'cancel' },
          { text: strings.yes, onPress: () => setScreen('sell') },
        ]);
      }
    } catch (error) {
      console.error('Catalog save failed:', error);
      Alert.alert(strings.analyzeFailedTitle, strings.genericError);
    }
  }

  async function handleMarkListed() {
    if (!currentItem) {
      return;
    }

    const updated = await saveItem({
      ...currentItem,
      forSale: true,
      listedAt: new Date().toISOString(),
    });
    setCurrentItem(updated);
    Alert.alert(strings.markedAsListed);

    if (!updated.inCatalog) {
      Alert.alert(strings.alsoAddToCatalogTitle, strings.alsoAddToCatalogMessage, [
        { text: strings.no, style: 'cancel' },
        { text: strings.yes, onPress: () => void beginAddToCatalog() },
      ]);
    }
  }

  async function handleListingSaved(
    listingTitle: string,
    listingDescription: string,
  ) {
    if (!currentItem) {
      return;
    }

    const updated = await saveItem({
      ...currentItem,
      listingTitle,
      listingDescription,
    });
    setCurrentItem(updated);
  }

  async function handleEditSave(draft: ItemEditDraft) {
    if (!currentItem) {
      return;
    }

    const updated = await saveItem({
      ...currentItem,
      objectName: draft.objectName,
      condition: draft.condition,
      estimatedPriceEUR: draft.estimatedPriceEUR,
      explanation: draft.explanation,
      userNotes: draft.userNotes,
    });
    setCurrentItem(updated);
    setShowEditModal(false);
    Alert.alert(strings.itemUpdated);
  }

  async function handleMarkSoldConfirm(soldPriceEUR: number) {
    if (!currentItem) {
      return;
    }

    const updated = await saveItem({
      ...currentItem,
      soldAt: new Date().toISOString(),
      soldPriceEUR,
      forSale: false,
      listedAt: null,
    });
    setCurrentItem(updated);
    setShowMarkSoldModal(false);
    Alert.alert(strings.markedAsSold);
  }

  function handleUnmarkSold() {
    if (!currentItem) {
      return;
    }

    Alert.alert(
      strings.unmarkAsSoldConfirmTitle,
      strings.unmarkAsSoldConfirmMessage,
      [
        { text: strings.cancel, style: 'cancel' },
        {
          text: strings.confirm,
          onPress: () => {
            void (async () => {
              const updated = await saveItem({
                ...currentItem,
                soldAt: null,
                soldPriceEUR: null,
              });
              setCurrentItem(updated);
              Alert.alert(strings.unmarkedAsSold);
            })();
          },
        },
      ],
    );
  }

  function handleDeleteItem() {
    if (!currentItem) {
      return;
    }

    Alert.alert(
      strings.deleteItemConfirmTitle,
      strings.deleteItemConfirmMessage,
      [
        { text: strings.cancel, style: 'cancel' },
        {
          text: strings.deleteItem,
          style: 'destructive',
          onPress: () => {
            void (async () => {
              const deletedId = currentItem.id;
              await deleteItemById(deletedId);
              await refreshCatalog();
              setCurrentItem(null);
              setScreen('home');
              Alert.alert(strings.itemDeleted);
            })();
          },
        },
      ],
    );
  }

  async function handleRenameRoom(roomId: string, label: string) {
    await updateCustomRoom(roomId, label);
    await refreshCustomRooms();
  }

  async function handleDeleteRoom(roomId: string) {
    if (countItemsInRoom(catalogItems, roomId) > 0) {
      throw new Error(strings.roomNotEmpty);
    }

    await deleteCustomRoom(roomId);
    await refreshCustomRooms();
  }

  function handleRemoveFromCatalog() {
    if (!currentItem) {
      return;
    }

    Alert.alert(
      strings.removeFromCatalogConfirmTitle,
      strings.removeFromCatalogConfirmMessage,
      [
        { text: strings.cancel, style: 'cancel' },
        {
          text: strings.confirm,
          style: 'destructive',
          onPress: () => {
            void (async () => {
              const updated = await saveItem({
                ...currentItem,
                inCatalog: false,
                roomId: null,
              });
              setCurrentItem(updated);
              Alert.alert(strings.removedFromCatalog);
            })();
          },
        },
      ],
    );
  }

  function handleUnmarkListed() {
    if (!currentItem) {
      return;
    }

    Alert.alert(
      strings.unmarkAsListedConfirmTitle,
      strings.unmarkAsListedConfirmMessage,
      [
        { text: strings.cancel, style: 'cancel' },
        {
          text: strings.confirm,
          onPress: () => {
            void (async () => {
              const updated = await saveItem({
                ...currentItem,
                forSale: false,
                listedAt: null,
              });
              setCurrentItem(updated);
              Alert.alert(strings.unmarkedAsListed);
            })();
          },
        },
      ],
    );
  }

  async function handleCreateCustomRoom(label: string) {
    const room = await addCustomRoom(label);
    await refreshCustomRooms();
    return room;
  }

  function openCatalogItem(item: ItemRecord) {
    setCurrentItem(item);
    setScreen('result');
  }

  function renderHome() {
    return (
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.container}>
          <Text style={styles.title}>SirPriceMe</Text>
          <Text style={styles.subtitle}>{strings.subtitle}</Text>

          <Pressable style={styles.catalogLink} onPress={() => setScreen('catalog')}>
            <Text style={styles.catalogLinkText}>
              {strings.myCatalog}
              {catalogCount > 0 ? ` (${catalogCount})` : ''}
            </Text>
          </Pressable>

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
        </View>
      </ScrollView>
    );
  }

  return (
    <>
      {screen === 'home' ? renderHome() : null}
      {screen === 'result' && currentItem ? (
        <ResultHubScreen
          item={currentItem}
          locale={contentLocale}
          customRooms={customRooms}
          onSell={() => setScreen('sell')}
          onAddToCatalog={() => void beginAddToCatalog()}
          onRemoveFromCatalog={handleRemoveFromCatalog}
          onEdit={() => setShowEditModal(true)}
          onMarkSold={() => setShowMarkSoldModal(true)}
          onUnmarkSold={handleUnmarkSold}
          onDeleteItem={handleDeleteItem}
          onOpenCatalog={() => setScreen('catalog')}
          onScanAnother={resetScan}
        />
      ) : null}
      {screen === 'sell' && currentItem ? (
        <SellScreen
          item={currentItem}
          locale={contentLocale}
          regionCode={regionCode}
          onBack={() => setScreen('result')}
          onMarkListed={() => void handleMarkListed()}
          onUnmarkListed={handleUnmarkListed}
          onMarkSold={() => setShowMarkSoldModal(true)}
          onUnmarkSold={handleUnmarkSold}
          onListingSaved={(title, description) =>
            void handleListingSaved(title, description)
          }
        />
      ) : null}
      {screen === 'catalog' ? (
        <CatalogScreen
          items={catalogItems}
          locale={contentLocale}
          customRooms={customRooms}
          onBack={() => setScreen(currentItem ? 'result' : 'home')}
          onSelectItem={openCatalogItem}
          onManageRooms={() => setShowManageRoomsModal(true)}
        />
      ) : null}

      <DisclaimerModal
        visible={showDisclaimer}
        locale={contentLocale}
        onAccept={(dontShowAgain) => void handleDisclaimerAccept(dontShowAgain)}
        onCancel={() => setShowDisclaimer(false)}
      />
      <RoomPickerModal
        visible={showRoomPicker}
        locale={contentLocale}
        customRooms={customRooms}
        onSelect={(roomId) => void handleRoomSelect(roomId)}
        onCreateCustomRoom={handleCreateCustomRoom}
        onCancel={() => setShowRoomPicker(false)}
      />
      <EditItemModal
        visible={showEditModal}
        item={currentItem}
        locale={contentLocale}
        onSave={(draft) => void handleEditSave(draft)}
        onCancel={() => setShowEditModal(false)}
      />
      <MarkSoldModal
        visible={showMarkSoldModal}
        item={currentItem}
        locale={contentLocale}
        onConfirm={(price) => void handleMarkSoldConfirm(price)}
        onCancel={() => setShowMarkSoldModal(false)}
      />
      <ManageRoomsModal
        visible={showManageRoomsModal}
        locale={contentLocale}
        customRooms={customRooms}
        itemCountByRoomId={itemCountByRoomId}
        onRenameRoom={handleRenameRoom}
        onDeleteRoom={handleDeleteRoom}
        onClose={() => setShowManageRoomsModal(false)}
      />

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

      <StatusBar style="auto" />
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
    marginBottom: 8,
  },
  catalogLink: {
    marginBottom: 16,
  },
  catalogLinkText: {
    color: '#1a5fb4',
    fontSize: 16,
    fontWeight: '600',
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
