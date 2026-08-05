import { useEffect, useMemo, useRef, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { CameraView, useCameraPermissions } from 'expo-camera';
import {
  Alert,
  Button,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { ItemPhotoGallery } from './components/ItemPhotoGallery';
import { AnalyzingOverlay } from './components/ui/AnalyzingOverlay';
import { AppButton } from './components/ui/AppButton';
import { EmptyState } from './components/ui/EmptyState';
import { HintBanner } from './components/ui/HintBanner';
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
  dismissPdfExportHint,
  isPdfExportHintDismissed,
} from './lib/storage/hints';
import {
  isDisclaimerAccepted,
  setDisclaimerAccepted,
} from './lib/storage/disclaimer';
import {
  countItemsInRoom,
  deleteItemById,
  deleteStoredPhoto,
  getCatalogItems,
  loadItems,
  persistItemPhotos,
  upsertItem,
} from './lib/storage/items';
import { CatalogScreen } from './screens/CatalogScreen';
import { ItemDetailScreen } from './screens/ItemDetailScreen';
import { SellScreen } from './screens/SellScreen';
import {
  createItemFromAnalysis,
  type ItemPhoto,
  type ItemRecord,
} from './types/item';
import { colors, radii, screenContent, typography } from './lib/theme';

type Screen = 'home' | 'result' | 'itemDetail' | 'sell' | 'catalog';
type CameraPurpose = 'pending' | 'item';

export default function App() {
  const cameraRef = useRef<CameraView>(null);
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [languageMode, setLanguageMode] = useState<LanguageMode>('local');
  const [screen, setScreen] = useState<Screen>('home');
  const [showCamera, setShowCamera] = useState(false);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [cameraPurpose, setCameraPurpose] = useState<CameraPurpose>('pending');
  const [pendingPhotos, setPendingPhotos] = useState<ItemPhoto[]>([]);
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
  const [showPdfExportHint, setShowPdfExportHint] = useState(false);
  const [sellReturnScreen, setSellReturnScreen] = useState<'result' | 'itemDetail'>(
    'result',
  );
  const [catalogReturnScreen, setCatalogReturnScreen] = useState<Screen>('home');

  const { regionCode } = getDeviceLocale();
  const contentLocale = resolveContentLocale(languageMode);
  const strings = getStrings(contentLocale);
  const localLanguageLabel = getLocalLanguageLabel();
  const catalogCount = getCatalogItems(catalogItems).length;
  const analyzingSteps = useMemo(
    () => [
      strings.analyzingStepPhoto,
      strings.analyzingStepIdentify,
      strings.analyzingStepPrice,
    ],
    [strings],
  );
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
    void isPdfExportHintDismissed().then((dismissed) => {
      setShowPdfExportHint(!dismissed);
    });
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
    setPendingPhotos([]);
    setCurrentItem(null);
    setErrorMessage(null);
    setScreen('home');
  }

  async function takePhoto(purpose: CameraPurpose = 'pending') {
    if (!cameraPermission?.granted) {
      const permission = await requestCameraPermission();
      if (!permission.granted) {
        alert(strings.cameraPermission);
        return;
      }
    }

    setCameraPurpose(purpose);
    setIsCameraReady(false);
    setShowCamera(true);
  }

  async function capturePhoto() {
    if (!cameraRef.current || !isCameraReady) {
      return;
    }

    const photo = await cameraRef.current.takePictureAsync({ quality: 0.8 });

    if (photo?.uri) {
      const newPhoto: ItemPhoto = { uri: photo.uri, mimeType: 'image/jpeg' };

      if (cameraPurpose === 'item' && currentItem) {
        let updatedItem: ItemRecord = {
          ...currentItem,
          photos: [...currentItem.photos, newPhoto],
        };

        if (currentItem.inCatalog) {
          updatedItem = await persistItemPhotos(updatedItem);
        }

        const saved = await saveItem(updatedItem);
        setCurrentItem(saved);
      } else {
        setPendingPhotos((current) => [...current, newPhoto]);
        setCurrentItem(null);
        setErrorMessage(null);
        setScreen('home');
      }
    }

    setShowCamera(false);
  }

  async function analyzePhoto() {
    if (pendingPhotos.length === 0) {
      return;
    }

    const primaryPhoto = pendingPhotos[0];
    setIsAnalyzing(true);
    setErrorMessage(null);

    try {
      const analysis = await analyzeItemPhoto(
        primaryPhoto.uri,
        primaryPhoto.mimeType,
        contentLocale,
        regionCode,
      );
      const item = await saveItem(
        createItemFromAnalysis(analysis, pendingPhotos),
      );
      setPendingPhotos([]);
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

  async function handleAddPhotoToItem() {
    await takePhoto('item');
  }

  async function handleRemovePhotoFromItem(index: number) {
    if (!currentItem) {
      return;
    }

    const removed = currentItem.photos[index];
    const photos = currentItem.photos.filter((_, photoIndex) => photoIndex !== index);
    const updated = await saveItem({ ...currentItem, photos });
    setCurrentItem(updated);

    if (removed && currentItem.inCatalog) {
      await deleteStoredPhoto(removed.uri);
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
      let itemToSave = currentItem;

      if (!currentItem.inCatalog) {
        itemToSave = await persistItemPhotos(currentItem);
      }

      const updated = await saveItem({
        ...itemToSave,
        inCatalog: true,
        roomId,
      });
      setCurrentItem(updated);
      Alert.alert(strings.savedToCatalog);

      if (!updated.forSale) {
        Alert.alert(strings.alsoSellTitle, strings.alsoSellMessage, [
          { text: strings.no, style: 'cancel' },
          { text: strings.yes, onPress: () => goToSell('result') },
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
      serialNumber: draft.serialNumber,
      modelNumber: draft.modelNumber,
      barcode: draft.barcode,
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
              setScreen(screen === 'itemDetail' ? 'catalog' : 'home');
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

  function goToCatalog(from: Screen) {
    setCatalogReturnScreen(from);
    setScreen('catalog');
  }

  function goToSell(from: 'result' | 'itemDetail') {
    setSellReturnScreen(from);
    setScreen('sell');
  }

  function openCatalogItem(item: ItemRecord) {
    setCurrentItem(item);
    setScreen('itemDetail');
  }

  async function handleDismissPdfHint() {
    await dismissPdfExportHint();
    setShowPdfExportHint(false);
  }

  function renderHome() {
    const showHomeEmpty =
      catalogCount === 0 && pendingPhotos.length === 0 && !isAnalyzing;

    return (
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.container}>
          <Text style={styles.title}>SirPriceMe</Text>
          <Text style={styles.subtitle}>{strings.subtitle}</Text>

          <Pressable style={styles.catalogLink} onPress={() => goToCatalog('home')}>
            <Text style={styles.catalogLinkText}>
              {strings.myCatalog}
              {catalogCount > 0 ? ` (${catalogCount})` : ''}
            </Text>
          </Pressable>

          {showHomeEmpty ? (
            <EmptyState
              title={strings.homeEmptyTitle}
              message={strings.homeEmptyMessage}
            />
          ) : null}

          {showPdfExportHint && catalogCount > 0 ? (
            <HintBanner
              message={strings.pdfExportHint}
              dismissLabel={strings.dismissHint}
              onDismiss={() => void handleDismissPdfHint()}
            />
          ) : null}

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
            <AppButton
              label={
                pendingPhotos.length > 0 ? strings.addAnotherPhoto : strings.takePhoto
              }
              onPress={() => void takePhoto('pending')}
              style={styles.fullWidthButton}
            />
            {pendingPhotos.length > 0 ? (
              <AppButton
                label={strings.analyze}
                onPress={analyzePhoto}
                disabled={isAnalyzing}
                loading={isAnalyzing}
                style={styles.fullWidthButton}
              />
            ) : null}
          </View>

          {pendingPhotos.length > 0 ? (
            <View style={styles.homeGallery}>
              <ItemPhotoGallery
                photos={pendingPhotos}
                locale={contentLocale}
                editable
                onAddPhoto={() => void takePhoto('pending')}
                onRemovePhoto={(index) => {
                  setPendingPhotos((current) =>
                    current.filter((_, photoIndex) => photoIndex !== index),
                  );
                }}
              />
            </View>
          ) : !showHomeEmpty ? (
            <Text style={styles.hint}>{strings.photoHint}</Text>
          ) : null}

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
        <ItemDetailScreen
          item={currentItem}
          locale={contentLocale}
          customRooms={customRooms}
          mode="scan"
          onBack={() => setScreen('home')}
          onSell={() => goToSell('result')}
          onAddToCatalog={() => void beginAddToCatalog()}
          onRemoveFromCatalog={handleRemoveFromCatalog}
          onEdit={() => setShowEditModal(true)}
          onAddPhoto={() => void handleAddPhotoToItem()}
          onRemovePhoto={(index) => void handleRemovePhotoFromItem(index)}
          onMarkSold={() => setShowMarkSoldModal(true)}
          onUnmarkSold={handleUnmarkSold}
          onDeleteItem={handleDeleteItem}
          onOpenCatalog={() => goToCatalog('result')}
          onScanAnother={resetScan}
        />
      ) : null}
      {screen === 'itemDetail' && currentItem ? (
        <ItemDetailScreen
          item={currentItem}
          locale={contentLocale}
          customRooms={customRooms}
          mode="catalog"
          onBack={() => setScreen('catalog')}
          onSell={() => goToSell('itemDetail')}
          onAddToCatalog={() => void beginAddToCatalog()}
          onRemoveFromCatalog={handleRemoveFromCatalog}
          onEdit={() => setShowEditModal(true)}
          onAddPhoto={() => void handleAddPhotoToItem()}
          onRemovePhoto={(index) => void handleRemovePhotoFromItem(index)}
          onMarkSold={() => setShowMarkSoldModal(true)}
          onUnmarkSold={handleUnmarkSold}
          onDeleteItem={handleDeleteItem}
          onOpenCatalog={() => goToCatalog('itemDetail')}
          onScanAnother={resetScan}
        />
      ) : null}
      {screen === 'sell' && currentItem ? (
        <SellScreen
          item={currentItem}
          locale={contentLocale}
          regionCode={regionCode}
          onBack={() => setScreen(sellReturnScreen)}
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
          showPdfExportHint={showPdfExportHint}
          onDismissPdfHint={() => void handleDismissPdfHint()}
          onBack={() => setScreen(catalogReturnScreen)}
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

      <AnalyzingOverlay
        visible={isAnalyzing}
        photoUri={pendingPhotos[0]?.uri ?? null}
        steps={analyzingSteps}
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
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    padding: screenContent.padding,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    color: colors.text,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 8,
  },
  catalogLink: {
    marginBottom: 16,
  },
  catalogLinkText: {
    ...typography.link,
  },
  languageLabel: {
    ...typography.label,
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
    borderColor: colors.border,
    borderRadius: radii.md,
    paddingVertical: 10,
    paddingHorizontal: 12,
    alignItems: 'center',
  },
  languageOptionActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  languageOptionText: {
    fontSize: 14,
    color: '#444',
    fontWeight: '500',
  },
  languageOptionTextActive: {
    color: colors.primary,
    fontWeight: '700',
  },
  buttonRow: {
    gap: 12,
    marginBottom: 24,
    width: '100%',
  },
  fullWidthButton: {
    marginBottom: 0,
  },
  homeGallery: {
    width: '100%',
    marginBottom: 16,
  },
  hint: {
    color: colors.textMuted,
    fontSize: 14,
  },
  error: {
    color: colors.danger,
    textAlign: 'left',
    marginBottom: 16,
    width: '100%',
    fontSize: 13,
  },
  cameraContainer: {
    flex: 1,
    backgroundColor: colors.black,
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
