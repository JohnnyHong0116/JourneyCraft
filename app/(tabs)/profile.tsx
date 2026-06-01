import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  StatusBar,
  Image,
  ImageBackground,
  TouchableOpacity,
  Platform,
  Pressable,
  Alert,
  Linking,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useAnimatedReaction,
  useAnimatedRef,
  withTiming,
  withSpring,
  runOnJS,
  scrollTo,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system/legacy';
import * as ImageManipulator from 'expo-image-manipulator';
import * as Haptics from 'expo-haptics';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors, Spacing, BorderRadius, Typography } from '@/theme/designSystem';
import { Icon } from '@/components/Icon';
import { router } from 'expo-router';
import { galleryImages, getProfileMetrics, mockTrips, profileMemoryCategories } from '@/data/appData';
import { useAppState } from '@/state/AppStateContext';
import { AppPalette } from '@/components/layout/AppScreen';
import { ActionSheetModal, OverlayActionRow } from '@/components/ui/OverlaySurface';
import { useTranslation } from '@/i18n/useTranslation';
import {
  getClosedCoverUri,
  getProfileCoverHeight,
  getRevealProgress,
  shouldTriggerRevealHaptic,
} from '../../features/profile/profileCoverModel';

const { width } = Dimensions.get('window');

// --- tokens ---
const SAFE_PADDING = 16;
const BANNER_CLOSED = 190;   // closed height (like FB/WeChat mini header)
const AVATAR_SIZE = 96;
const AVATAR_OVERLAP = 32;
const HIGHLIGHT_SIZE = 64;

// how far the user must scroll up into content before collapsing the full image
const COLLAPSE_AT = 96;
const THRESHOLD = 120;

// your real cover image URI
const COVER_URI = 'https://picsum.photos/1200/1800'; // vertical example
const COVER_STORAGE_KEY = 'profile.cover.uri';
const COVER_CROP_KEY = 'profile.cover.crop';
const CROPPED_STORAGE_KEY = 'profile.cover.cropped';

type ProfileHighlight = {
  id: string;
  name: string;
  emoji: string;
  imageUri?: string;
  href: string;
};

// Custom Cropping Interface Component
const CustomCropInterface = ({ 
  imageUri, 
  onCropComplete, 
  onCancel 
}: { 
  imageUri: string; 
  onCropComplete: (cropData: { x: number; y: number; width: number; height: number }) => void; 
  onCancel: () => void; 
}) => {
  const [cropArea, setCropArea] = useState({ x: 0, y: 0, width: 200, height: 150 });
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const cropAreaRef = useRef(cropArea);
  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });

  // Enforce banner aspect ratio
  const screenW = Dimensions.get('window').width;
  const bannerH = 190;
  const BANNER_AR = screenW / bannerH; // width / height (e.g., ~2.05)

  useEffect(() => {
    Image.getSize(imageUri, (width, height) => {
      setImageSize({ width, height });
      
      // Calculate default crop area to match banner dimensions
      const maxCropWidth = width * 0.9; // Use 90% of image width max
      const maxCropHeight = height * 0.9; // Use 90% of image height max
      
      let cropWidth, cropHeight;
      
      // Determine crop size based on banner aspect ratio
      if (BANNER_AR > 1) {
        // Banner is wider than tall (typical phone)
        cropHeight = Math.min(maxCropHeight, Math.max(300, height * 0.6)); // At least 300px or 60% of image height
        cropWidth = cropHeight * BANNER_AR;
        
        // If crop width exceeds image width, adjust
        if (cropWidth > maxCropWidth) {
          cropWidth = maxCropWidth;
          cropHeight = cropWidth / BANNER_AR;
        }
      } else {
        // Banner is taller than wide (unusual but possible)
        cropWidth = Math.min(maxCropWidth, Math.max(400, width * 0.6)); // At least 400px or 60% of image width
        cropHeight = cropWidth / BANNER_AR;
        
        // If crop height exceeds image height, adjust
        if (cropHeight > maxCropHeight) {
          cropHeight = maxCropHeight;
          cropWidth = cropHeight * BANNER_AR;
        }
      }
      
      // Center the crop area in the image
      const centerX = (width - cropWidth) / 2;
      const centerY = (height - cropHeight) / 2;
      
      const nextCropArea = {
        x: Math.max(0, centerX),
        y: Math.max(0, centerY),
        width: Math.min(cropWidth, width),
        height: Math.min(cropHeight, height)
      };
      cropAreaRef.current = nextCropArea;
      setCropArea(nextCropArea);
    });
  }, [imageUri, BANNER_AR]);

  const handleContainerLayout = (event: any) => {
    const { width, height } = event.nativeEvent.layout;
    setContainerSize({ width, height });
  };

  const handleTouchStart = (event: any) => {
    const { locationX, locationY } = event.nativeEvent;
    dragStart.current = { x: locationX, y: locationY };
    isDragging.current = true;
  };

  const handleTouchMove = (event: any) => {
    if (!isDragging.current || !containerSize.width || !containerSize.height) return;
    
    const { locationX, locationY } = event.nativeEvent;
    const deltaX = locationX - dragStart.current.x;
    const deltaY = locationY - dragStart.current.y;
    
    // Convert screen coordinates to image coordinates
    const containScale = Math.min(containerSize.width / imageSize.width, containerSize.height / imageSize.height);
    
    // For now, just move the crop area (maintain aspect ratio)
    const currentCropArea = cropAreaRef.current;
    const newX = Math.max(0, Math.min(imageSize.width - currentCropArea.width, currentCropArea.x + deltaX / containScale));
    const newY = Math.max(0, Math.min(imageSize.height - currentCropArea.height, currentCropArea.y + deltaY / containScale));
    
    const nextCropArea = {
      ...currentCropArea,
      x: newX,
      y: newY
    };
    cropAreaRef.current = nextCropArea;
    setCropArea(nextCropArea);
    
    dragStart.current = { x: locationX, y: locationY };
  };

  const handleTouchEnd = () => {
    isDragging.current = false;
  };

  const handleCrop = () => {
    onCropComplete(cropArea);
  };

  // Convert image coordinates to screen coordinates for display
  const containScale = imageSize.width && imageSize.height
    ? Math.min(containerSize.width / imageSize.width, containerSize.height / imageSize.height)
    : 0;
  const imageLeft = (containerSize.width - imageSize.width * containScale) / 2;
  const imageTop = (containerSize.height - imageSize.height * containScale) / 2;
  const screenCropArea = {
    x: imageLeft + cropArea.x * containScale,
    y: imageTop + cropArea.y * containScale,
    width: cropArea.width * containScale,
    height: cropArea.height * containScale,
  };

  return (
    <View style={styles.cropOverlay}>
      <View style={styles.cropHeader}>
        <Pressable accessibilityRole="button" onPress={onCancel} style={styles.cropHeaderButton}>
          <Text style={styles.cropHeaderButtonText}>Cancel</Text>
        </Pressable>
        <Text style={styles.cropTitle}>Position Cover</Text>
        <Pressable accessibilityRole="button" onPress={handleCrop} style={styles.cropHeaderButton}>
          <Text style={styles.cropHeaderDone}>Done</Text>
        </Pressable>
      </View>
      <View style={styles.cropContainer}>
        <Text style={styles.cropSubtitle}>Drag the frame to choose the visible cover area.</Text>
        
        <View 
          style={styles.imageContainer}
          onLayout={handleContainerLayout}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <Image 
            source={{ uri: imageUri }} 
            style={styles.cropImage}
            resizeMode="contain"
          />
          <View 
            style={[
              styles.cropSelection,
              {
                left: screenCropArea.x,
                top: screenCropArea.y,
                width: screenCropArea.width,
                height: screenCropArea.height,
              }
            ]}
          >
            <View style={[styles.cropGridLine, styles.cropGridLineVertical]} />
            <View style={[styles.cropGridLine, styles.cropGridLineVertical, { left: '66.66%' }]} />
            <View style={[styles.cropGridLine, styles.cropGridLineHorizontal]} />
          </View>
        </View>
      </View>
    </View>
  );
};

export default function ProfileTab() {
  const { profile, updateProfile, mode } = useAppState();
  const { t } = useTranslation();
  const palette = AppPalette[mode];
  const profileMetrics = getProfileMetrics();
  const insets = useSafeAreaInsets();
  const scrollRef = useAnimatedRef<Animated.ScrollView>();

  // Custom cover image state
  const [customCoverUri, setCustomCoverUri] = useState<string | null>(null);
  const [cropInfo, setCropInfo] = useState<{ x: number; y: number; width: number; height: number } | null>(null);
  const [croppedCoverUri, setCroppedCoverUri] = useState<string | null>(null);
  const [coverActionsVisible, setCoverActionsVisible] = useState(false);
  const currentCoverUri = customCoverUri || profile.coverPhotoUri || COVER_URI;
  const memoryPhotos = useMemo(() => {
    const categoryIds = new Set(profileMemoryCategories.flatMap((category) => category.relatedCardIds));
    const ranked = mockTrips
      .flatMap((trip) => trip.photos.map((uri, index) => ({
        id: `${trip.id}-${index}`,
        uri,
        tripId: trip.id,
        score: (trip.isSaved ? 4 : 0) + (categoryIds.has(trip.id) ? 3 : 0) + ((trip.peopleIds?.length ?? 0) > 0 ? 2 : 0) + (Date.parse(trip.displayDate) / 10000000000000),
      })))
      .sort((a, b) => b.score - a.score);
    return ranked.length ? ranked : galleryImages.map((uri, index) => ({ id: `fallback-${index}`, uri, tripId: mockTrips[0]?.id ?? '1', score: 0 }));
  }, []);
  const highlights = useMemo<ProfileHighlight[]>(() => {
    return profileMemoryCategories.map((category) => ({
      id: category.id,
      name: category.name,
      emoji: category.emoji,
      imageUri: category.coverImageUri,
      href: `/profile/category/${category.id}`,
    }));
  }, []);

  // load saved cover on mount
  useEffect(() => {
    (async () => {
      const saved = await AsyncStorage.getItem(COVER_STORAGE_KEY);
      const savedCrop = await AsyncStorage.getItem(COVER_CROP_KEY);
      const savedCropped = await AsyncStorage.getItem(CROPPED_STORAGE_KEY);
      if (saved) setCustomCoverUri(saved);
      if (savedCrop) setCropInfo(JSON.parse(savedCrop));
      if (savedCropped) setCroppedCoverUri(savedCropped);
    })();
  }, []);

  // permissions hooks (friendlier than manual request calls)
  const [libPerm, requestLibPerm] = ImagePicker.useMediaLibraryPermissions();
  const [camPerm, requestCamPerm] = ImagePicker.useCameraPermissions();

  // base header includes safe-top so the cover sits under status bar
  const HEADER_BASE = useMemo(() => BANNER_CLOSED + insets.top, [insets.top]);
  const EXPANDED_HEIGHT = useMemo(() => Math.max(HEADER_BASE + THRESHOLD, Math.round(width * 1.12) + insets.top), [HEADER_BASE, insets.top]);

  // --- reanimated state ---
  const y = useSharedValue(0);            // scroll offset
  const revealed = useSharedValue(0);
  const revealLocked = useSharedValue(false);
  const thresholdTriggered = useSharedValue(false);

  // show/hide the scrim overlay only when revealed
  const [scrimActive, setScrimActive] = useState(false);
  useAnimatedReaction(
    () => revealed.value,
    (v) => {
      const isActive = v > 0.02;
      runOnJS(setScrimActive)(isActive);
    }
  );

  // Collapse helper
  const collapseCover = () => {
    revealed.value = withTiming(0, { duration: 220 });
    revealLocked.value = false;
    thresholdTriggered.value = false;
    scrollTo(scrollRef, 0, 0, true);
  };

  const playRevealHaptic = () => {
    void Haptics.impactAsync(Platform.OS === 'ios'
      ? Haptics.ImpactFeedbackStyle.Soft
      : Haptics.ImpactFeedbackStyle.Light);
  };

  // util: ensure app folder exists, copy to a stable path, and persist
  async function persistCoverAsync(fromUri: string, cropData?: { x: number; y: number; width: number; height: number }) {
    const dir = FileSystem.documentDirectory + 'covers';
    try {
      const dirInfo = await FileSystem.getInfoAsync(dir);
      if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(dir, { intermediates: true });
      }
      const ext = fromUri.split('.').pop()?.toLowerCase() || 'jpg';
      const dest = `${dir}/cover.${ext}`;
      if ((await FileSystem.getInfoAsync(dest)).exists) {
        await FileSystem.deleteAsync(dest, { idempotent: true });
      }
      await FileSystem.copyAsync({ from: fromUri, to: dest });
      await AsyncStorage.setItem(COVER_STORAGE_KEY, dest);
      await updateProfile({ coverPhotoUri: dest });
      setCustomCoverUri(dest);
      
      // Save crop info if provided
      if (cropData) {
        await AsyncStorage.setItem(COVER_CROP_KEY, JSON.stringify(cropData));
        setCropInfo(cropData);
      }
      
      // Force a re-render to update the image display immediately
      console.log('🖼️ Cover updated with crop data:', cropData);
    } catch (e) {
      console.warn('Persist cover failed:', e);
    }
  }

  // Crop and persist the cropped image
  async function cropAndPersistAsync(srcUri: string, crop: { x: number; y: number; width: number; height: number }) {
    try {
      // ImageManipulator expects integer crop box
      const action = { 
        crop: {
          originX: Math.round(crop.x),
          originY: Math.round(crop.y),
          width: Math.round(crop.width),
          height: Math.round(crop.height),
        }
      };

      const result = await ImageManipulator.manipulateAsync(
        srcUri,
        [action],
        { compress: 0.9, format: ImageManipulator.SaveFormat.JPEG }
      );

      // persist cropped file separately (don't overwrite the full image)
      const dir = FileSystem.documentDirectory + 'covers';
      if (!(await FileSystem.getInfoAsync(dir)).exists) {
        await FileSystem.makeDirectoryAsync(dir, { intermediates: true });
      }
      const dest = `${dir}/cover_cropped.jpg`;
      if ((await FileSystem.getInfoAsync(dest)).exists) {
        await FileSystem.deleteAsync(dest, { idempotent: true });
      }
      await FileSystem.copyAsync({ from: result.uri, to: dest });

      await AsyncStorage.setItem(CROPPED_STORAGE_KEY, dest);
      setCroppedCoverUri(dest);

      console.log('✂️ Cropped image saved:', dest);
      return dest;
    } catch (e) {
      console.warn('Crop and persist failed:', e);
      throw e;
    }
  }

  // Custom cropping interface
  const [showCropInterface, setShowCropInterface] = useState(false);
  const [tempImageUri, setTempImageUri] = useState<string | null>(null);

  const handleCropComplete = async (cropData: { x: number; y: number; width: number; height: number }) => {
    if (tempImageUri) {
      // Save the full image as usual (so expanded mode can show it)
      await persistCoverAsync(tempImageUri);
      
      // Now crop and persist the "closed header" bitmap
      await cropAndPersistAsync(tempImageUri, cropData);
      
                  // Collapse the header back to original size so user can see the cropped image
            revealed.value = withSpring(0, {
              damping: 20,
              stiffness: 100,
              mass: 0.8,
            });
      
      // Scroll back to top to show the cropped image
      if (scrollRef.current) {
        scrollRef.current.scrollTo({ y: 0, animated: true });
      }
      
      setShowCropInterface(false);
      setTempImageUri(null);
    }
  };

  const handleCropCancel = () => {
    setShowCropInterface(false);
    setTempImageUri(null);
  };

  const waitForSheetDismiss = () => new Promise((resolve) => setTimeout(resolve, Platform.OS === 'ios' ? 350 : 100));

  const settleProfilePosition = () => {
    revealed.value = withTiming(0, { duration: 180 });
    revealLocked.value = false;
    thresholdTriggered.value = false;
    scrollTo(scrollRef, 0, 0, true);
  };

  const closeCoverActions = () => {
    setCoverActionsVisible(false);
    settleProfilePosition();
  };

  const showPermissionMessage = (title: string, body: string, canAskAgain?: boolean) => {
    Alert.alert(title, body, canAskAgain === false ? [
      { text: t('profile.cancel'), style: 'cancel' },
      { text: t('profile.openSettings'), onPress: () => Linking.openSettings() },
    ] : undefined);
  };

  // pick from library
  async function chooseFromLibrary() {
    await waitForSheetDismiss();
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted && permission.accessPrivileges !== 'limited') {
        showPermissionMessage(t('profile.photoPermissionTitle'), t('profile.photoPermissionBody'), permission.canAskAgain);
        return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: false,     // No cropping - use full image
      quality: 0.9,
      exif: false,
    });
    if (!result.canceled && result.assets?.[0]?.uri) {
      // Show custom cropping interface
      setTempImageUri(result.assets[0].uri);
      setShowCropInterface(true);
    }
  }

  // take a photo
  async function takePhoto() {
    await waitForSheetDismiss();
    const permission = camPerm?.granted ? camPerm : await requestCamPerm();
    if (!permission.granted) {
        showPermissionMessage(t('profile.cameraPermissionTitle'), t('profile.cameraPermissionBody'), permission.canAskAgain);
        return;
    }
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: false, // No cropping - use full image
      quality: 0.9,
      exif: false,
    });
    if (!result.canceled && result.assets?.[0]?.uri) {
      // Show custom cropping interface
      setTempImageUri(result.assets[0].uri);
      setShowCropInterface(true);
    }
  }

  // optional: reset to default
  async function resetCover() {
    await AsyncStorage.removeItem(COVER_STORAGE_KEY);
    await AsyncStorage.removeItem(COVER_CROP_KEY);
    await AsyncStorage.removeItem(CROPPED_STORAGE_KEY);
    await updateProfile({ coverPhotoUri: undefined });
    setCustomCoverUri(null);
    setCropInfo(null);
    setCroppedCoverUri(null);
  }

  function onPressChangeCover() {
    settleProfilePosition();
    setCoverActionsVisible(true);
  }

  async function handleChooseCoverFromLibrary() {
    closeCoverActions();
    await chooseFromLibrary();
  }

  async function handleTakeCoverPhoto() {
    closeCoverActions();
    await takePhoto();
  }

  async function handleResetCoverPhoto() {
    closeCoverActions();
    await resetCover();
  }

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (e: any) => {
      const cy = e.contentOffset.y;
      y.value = cy;

      if (revealLocked.value) {
        revealed.value = getRevealProgress(cy, COLLAPSE_AT);
        if (revealed.value === 0) {
          revealLocked.value = false;
          thresholdTriggered.value = false;
        }
      } else if (shouldTriggerRevealHaptic(cy, THRESHOLD, thresholdTriggered.value)) {
        thresholdTriggered.value = true;
        runOnJS(playRevealHaptic)();
      } else if (cy > -THRESHOLD + 16) {
        thresholdTriggered.value = false;
      }
    },
    onEndDrag: (e: any) => {
      if (!revealLocked.value && thresholdTriggered.value && e.contentOffset.y <= -THRESHOLD) {
        revealLocked.value = true;
        revealed.value = withSpring(1, {
          damping: 22,
          stiffness: 180,
          mass: 0.82,
        });
        scrollTo(scrollRef, 0, 0, true);
      } else if (!revealLocked.value) {
        thresholdTriggered.value = false;
      }
    },
  });

  const coverStyle = useAnimatedStyle(() => {
    return {
      height: getProfileCoverHeight({
        scrollY: revealLocked.value ? Math.max(y.value, 0) : Math.max(y.value, -THRESHOLD),
        baseHeight: HEADER_BASE,
        expandedHeight: EXPANDED_HEIGHT,
        revealProgress: revealed.value,
      }),
    };
  });

  // fade out header content when cover is revealed
  const headerContentStyle = useAnimatedStyle(() => {
    // Calculate opacity based on pull distance, not just revealed state
    const pull = Math.max(-y.value, 0);
    const progress = Math.max(Math.min(pull / THRESHOLD, 1), revealed.value);
    return { opacity: 1 - progress * 0.7 };
  });

  // dissolve buttons when cover is revealed (make them transparent)
  const buttonsStyle = useAnimatedStyle(() => {
    // Calculate opacity based on pull distance, not just revealed state
    const pull = Math.max(-y.value, 0);
    const progress = Math.max(Math.min(pull / THRESHOLD, 1), revealed.value);
    return { opacity: 1 - progress };
  });

  // Change cover button style - appears when fully revealed
  const changeCoverStyle = useAnimatedStyle(() => {
    const opacity = withSpring(revealed.value, {
      damping: 20,
      stiffness: 100,
      mass: 0.8,
    });
    return { opacity };
  });

  // Force re-render when crop info changes
  const imageKey = useMemo(() => {
    return `${currentCoverUri}-${JSON.stringify(cropInfo)}`;
  }, [currentCoverUri, cropInfo]);

  const headerUri = getClosedCoverUri(croppedCoverUri, currentCoverUri);

  // Scrim overlay style - covers full screen when revealed, but excludes button area
  const scrimStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(revealed.value * 0.2, { duration: 200 }),
      backgroundColor: 'black',
    };
  });

  return (
    <LinearGradient
      colors={[palette.backgroundTop, mode === 'dark' ? '#101f1b' : '#E3EDDC', palette.backgroundBottom]}
      style={styles.root}
    >
      {/* draw under status bar */}
      <StatusBar translucent backgroundColor="transparent" barStyle={mode === 'dark' ? 'light-content' : 'dark-content'} />

      {/* NOTE: exclude 'top' here so content can live under the status bar */}
      <SafeAreaView edges={['left', 'right', 'bottom']} style={styles.container}>

        <Animated.ScrollView
          ref={scrollRef}
          showsVerticalScrollIndicator={false}
          scrollEnabled={!coverActionsVisible && !showCropInterface}
          // iOS pull-bounce; Android needs overScrollMode to allow negative y
          bounces
          overScrollMode="always"
          scrollEventThrottle={16}
          onScroll={scrollHandler}
          contentInsetAdjustmentBehavior="never"
          pointerEvents={coverActionsVisible ? 'none' : 'auto'}
        >
          {/* ---- STRETCHY COVER (lives in scroll content so it scrolls away) ---- */}
          <Animated.View style={[styles.coverContainer, coverStyle]}>
            {/* Local scrim: only as tall as the cover; collapses on tap */}
            {scrimActive && (
              <Animated.View
                pointerEvents="auto"
                style={[styles.coverScrim, scrimStyle]}   // absolute fill, zIndex: 20
              >
                <Pressable style={StyleSheet.absoluteFill} onPress={collapseCover} />
              </Animated.View>
            )}

            <ImageBackground
              source={{ uri: headerUri }}
              resizeMode="cover"
              style={styles.coverImage}
              key={imageKey}                              // Force re-render when crop changes
            >
              {/* optional dark overlay for contrast */}
              <View style={styles.coverOverlay} />

              {/* Change Cover Button — render AFTER scrim, higher zIndex */}
              <Animated.View
                style={[styles.changeCoverContainer, changeCoverStyle]} // zIndex: 30
                pointerEvents="auto"
              >
                <TouchableOpacity 
                  style={styles.changeCoverButton} 
                  onPress={onPressChangeCover}
                >
                  <Icon name="cardimage" size={20} color="#FFFFFF" />
                  <Text style={styles.changeCoverText}>{t('profile.changeCover')}</Text>
                </TouchableOpacity>
              </Animated.View>
            </ImageBackground>
          </Animated.View>

          {/* ---- HEADER BLOCK under the cover (keeps same padding; only cover height changes) ---- */}
          <Animated.View style={[styles.headerContainer, { backgroundColor: 'transparent' }, headerContentStyle]}>
            {/* avatar overlaps upward into the cover's lower edge */}
            <View style={styles.avatarContainer}>
              {profile.avatarUri ? <Image source={{ uri: profile.avatarUri }} style={styles.avatar} /> : <View style={styles.avatar} />}
            </View>

            {/* actions */}
            <Animated.View style={[styles.actionsRow, buttonsStyle]}>
              <TouchableOpacity style={[styles.editProfileButton, { backgroundColor: palette.card, borderColor: palette.divider }]} onPress={() => router.push('/settings/profile')}>
                <Text style={[styles.editProfileText, { color: palette.text }]}>Edit Profile</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.gearButton, { backgroundColor: palette.card, borderColor: palette.divider }]} onPress={() => router.push('/settings')}>
                <Icon name="setting-unselected" size={22} color={palette.text} />
              </TouchableOpacity>
            </Animated.View>

            {/* name + stats */}
            <View style={styles.contentRow}>
              <View style={styles.leftTextBlock}>
                <Text style={[styles.username, { color: palette.text }]} numberOfLines={1}>{profile.username}</Text>
                <Text style={[styles.bio, { color: palette.secondaryText }]} numberOfLines={2}>{profile.bio}</Text>
                {profile.location ? <Text style={[styles.bio, { color: palette.secondaryText }]} numberOfLines={1}>{profile.location}</Text> : null}
              </View>

              <View style={styles.statsBlock}>
                <View style={styles.statCell}><Text style={[styles.statNumber, { color: palette.text }]}>{profileMetrics.posts}</Text><Text style={[styles.statLabel, { color: palette.secondaryText }]}>Posts</Text></View>
                <View style={styles.statCell}><Text style={[styles.statNumber, { color: palette.text }]}>{profileMetrics.days}</Text><Text style={[styles.statLabel, { color: palette.secondaryText }]}>Days</Text></View>
                <View style={styles.statCell}><Text style={[styles.statNumber, { color: palette.text }]}>{profileMetrics.places}</Text><Text style={[styles.statLabel, { color: palette.secondaryText }]}>Places</Text></View>
              </View>
            </View>
          </Animated.View>

          {/* ---- entity highlights ---- */}
          <View style={styles.highlightsContainer}>
            <Animated.ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flexGrow: 0 }}>
              {highlights.length > 0 ? highlights.map((item) => (
                <Pressable
                  key={item.id}
                  accessibilityRole="button"
                  accessibilityLabel={item.name}
                  onPress={() => router.push(item.href as any)}
                  style={({ pressed }) => [styles.highlightItem, pressed && styles.pressedItem]}
                >
                  <View style={styles.highlightRing}>
                    {item.imageUri ? (
                      <Image source={{ uri: item.imageUri }} style={styles.highlightThumb} />
                    ) : (
                      <View style={[styles.highlightThumb, styles.highlightFallback]}>
                        <Text style={styles.highlightEmoji}>{item.emoji}</Text>
                      </View>
                    )}
                  </View>
                  <Text style={[styles.highlightLabel, { color: palette.secondaryText }]} numberOfLines={1}>{item.name}</Text>
                </Pressable>
              )) : (
                <Pressable style={styles.emptyHighlight} onPress={() => Alert.alert(t('profile.addCategory'), t('profile.createCategoryTodo'))}>
                  <View style={styles.emptyHighlightCircle}><Text style={styles.emptyHighlightPlus}>+</Text></View>
                  <Text style={[styles.emptyHighlightText, { color: palette.secondaryText }]}>{t('profile.createFirstCategory')}</Text>
                </Pressable>
              )}
            </Animated.ScrollView>
          </View>

          {/* Horizontal Divider */}
          <View style={[styles.divider, { backgroundColor: palette.divider }]} />

          {/* ---- memory photo grid ---- */}
          <View style={styles.photoGrid}>
            <View style={styles.gridRow}>
              {memoryPhotos.slice(0, 3).map((photo) => (
                <Pressable key={photo.id} onPress={() => router.push(`/trip/${photo.tripId}` as any)} style={({ pressed }) => pressed && styles.pressedItem}>
                  <Image source={{ uri: photo.uri }} style={styles.gridImage} />
                </Pressable>
              ))}
            </View>

            <View style={styles.gridRow}>
              {memoryPhotos[3] ? (
                <Pressable onPress={() => router.push(`/trip/${memoryPhotos[3].tripId}` as any)} style={({ pressed }) => pressed && styles.pressedItem}>
                  <Image source={{ uri: memoryPhotos[3].uri }} style={[styles.gridImage, styles.largeImage]} />
                </Pressable>
              ) : null}
              <View style={styles.smallImagesContainer}>
                {memoryPhotos.slice(4, 6).map((photo) => (
                  <Pressable key={photo.id} onPress={() => router.push(`/trip/${photo.tripId}` as any)} style={({ pressed }) => pressed && styles.pressedItem}>
                    <Image source={{ uri: photo.uri }} style={styles.smallImage} />
                  </Pressable>
                ))}
              </View>
            </View>

            <View style={styles.gridRow}>
              {memoryPhotos.slice(6, 9).map((photo) => (
                <Pressable key={photo.id} onPress={() => router.push(`/trip/${photo.tripId}` as any)} style={({ pressed }) => pressed && styles.pressedItem}>
                  <Image source={{ uri: photo.uri }} style={styles.gridImage} />
                </Pressable>
              ))}
            </View>

            <View style={styles.gridRow}>
              {memoryPhotos.slice(9, 12).map((photo) => (
                <Pressable key={photo.id} onPress={() => router.push(`/trip/${photo.tripId}` as any)} style={({ pressed }) => pressed && styles.pressedItem}>
                  <Image source={{ uri: photo.uri }} style={styles.gridImage} />
                </Pressable>
              ))}
            </View>

            <View style={{ height: 100 }} />
      </View>
        </Animated.ScrollView>
    </SafeAreaView>

      {coverActionsVisible ? (
        <Pressable
          style={styles.coverBackdrop}
          onPress={closeCoverActions}
          onTouchMove={closeCoverActions}
        >
          {Platform.OS === 'ios' ? (
            <BlurView intensity={42} tint={mode === 'dark' ? 'dark' : 'light'} style={StyleSheet.absoluteFill} />
          ) : (
            <View style={[StyleSheet.absoluteFill, styles.coverBackdropFallback]} />
          )}
          <View style={styles.coverBackdropDim} />
        </Pressable>
      ) : null}

      {coverActionsVisible ? (
        <View pointerEvents="none" style={[styles.coverClearLayer, { height: HEADER_BASE }]}>
          <ImageBackground
            source={{ uri: croppedCoverUri ?? currentCoverUri }}
            resizeMode="cover"
            style={styles.coverImage}
          >
            <View style={styles.coverOverlay} />
            <View style={styles.changeCoverContainer}>
              <View style={styles.changeCoverButton}>
                <Icon name="cardimage" size={20} color="#FFFFFF" />
                <Text style={styles.changeCoverText}>{t('profile.changeCover')}</Text>
              </View>
            </View>
          </ImageBackground>
        </View>
      ) : null}

      {/* Custom Cropping Interface */}
      {showCropInterface && tempImageUri && (
        <CustomCropInterface
          imageUri={tempImageUri}
          onCropComplete={handleCropComplete}
          onCancel={handleCropCancel}
        />
      )}

      <ActionSheetModal visible={coverActionsVisible} onDismiss={closeCoverActions}>
        <Text style={[styles.coverSheetTitle, { color: palette.text }]}>{t('profile.changeCoverPhoto')}</Text>
        <Text style={[styles.coverSheetDescription, { color: palette.secondaryText }]}>
          {t('profile.coverSheetDescription')}
        </Text>
        <OverlayActionRow
          label={t('profile.chooseFromLibrary')}
          leading={<Icon name="cardimage" size={20} color={palette.text} />}
          onPress={handleChooseCoverFromLibrary}
        />
        <OverlayActionRow
          label={t('profile.takePhoto')}
          leading={<Icon name="camera" size={20} color={palette.text} />}
          onPress={handleTakeCoverPhoto}
        />
        <View style={[styles.coverSheetDivider, { backgroundColor: palette.divider }]} />
        <OverlayActionRow
          label={t('profile.resetCoverPhoto')}
          danger
          leading={<Icon name="trash" size={20} color="#ed5b55" />}
          onPress={handleResetCoverPhoto}
        />
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t('profile.cancel')}
          style={styles.coverSheetCancel}
          onPress={closeCoverActions}
        >
          <Text style={[styles.coverSheetCancelText, { color: palette.text }]}>{t('profile.cancel')}</Text>
        </Pressable>
      </ActionSheetModal>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.backgroundDefault },
  container: { flex: 1 },

  // cover in the flow so it scrolls away
  coverContainer: {
    width: '100%',
    overflow: 'hidden',
  },
  coverImage: {
    flex: 1,
    width: '100%',
  },
  coverOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.12)' },

  // Local scrim styles
  coverScrim: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 20,
  },
  coverBackdrop: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 80,
  },
  coverBackdropFallback: {
    backgroundColor: 'rgba(245,245,240,0.72)',
  },
  coverBackdropDim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.38)',
  },
  coverClearLayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 90,
    overflow: 'hidden',
  },

  // Change Cover Button styles
  changeCoverContainer: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    zIndex: 30, // Higher than scrim (20) and everything else
  },
  changeCoverButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
    minWidth: 60,
  },
  changeCoverText: {
    fontSize: 10,
    fontWeight: '500',
    color: '#FFFFFF',
    marginTop: 2,
    textAlign: 'center',
  },

  headerContainer: {
    width: '100%',
    paddingTop: 8,
    paddingBottom: SAFE_PADDING,
    paddingHorizontal: SAFE_PADDING,
    position: 'relative',
    backgroundColor: 'transparent',
  },
  avatarContainer: {
    position: 'absolute',
    left: SAFE_PADDING,
    top: -AVATAR_OVERLAP,
    zIndex: 2,
  },
  avatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    backgroundColor: Colors.backgroundGreen,
    borderWidth: 4,
    borderColor: Colors.white,
  },
  actionsRow: {
    flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center',
    gap: 12, marginBottom: 12, marginRight: -8, marginTop: 4,
  },
  editProfileButton: {
    height: 32, paddingHorizontal: 16, backgroundColor: Colors.white,
    borderWidth: 1, borderColor: '#E5E5EA', borderRadius: 16,
    justifyContent: 'center', alignItems: 'center', minWidth: 40, minHeight: 40,
  },
  editProfileText: { fontSize: 15, fontWeight: '600', color: Colors.textPrimary },
  gearButton: {
    width: 32, height: 32, backgroundColor: Colors.white,
    borderWidth: 1, borderColor: '#E5E5EA', borderRadius: 16,
    justifyContent: 'center', alignItems: 'center', minWidth: 40, minHeight: 40,
  },

  contentRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start',
    marginTop: 8, minHeight: 80,
  },
  leftTextBlock: { flex: 1, marginRight: 2 },
  username: { fontSize: 24, fontWeight: '700', color: '#111827', marginBottom: 4 },
  bio: { fontSize: 14, fontWeight: '400', color: '#6B7280', lineHeight: 18, marginBottom: 2 },

  statsBlock: { flexDirection: 'row', justifyContent: 'space-between', width: '48%' },
  statCell: { alignItems: 'center', flex: 1, minWidth: 60 },
  statNumber: { fontSize: 28, fontWeight: '600', color: '#111827', marginBottom: 4, letterSpacing: -0.5, textAlign: 'center' },
  statLabel: { fontSize: 11, fontWeight: '500', color: '#6B7280', textAlign: 'center' },

  highlightsContainer: { marginTop: 2, paddingHorizontal: SAFE_PADDING },
  highlightItem: { width: 74, marginRight: 12, alignItems: 'center' },
  highlightRing: {
    width: HIGHLIGHT_SIZE + 8,
    height: HIGHLIGHT_SIZE + 8,
    borderRadius: (HIGHLIGHT_SIZE + 8) / 2,
    borderWidth: 3,
    borderColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  highlightThumb: {
    width: HIGHLIGHT_SIZE, height: HIGHLIGHT_SIZE, borderRadius: HIGHLIGHT_SIZE / 2,
    backgroundColor: Colors.white, borderWidth: 1, borderColor: Colors.borderBrandTertiary,
  },
  highlightFallback: { alignItems: 'center', justifyContent: 'center', backgroundColor: '#EEF4E8' },
  highlightEmoji: { fontSize: 28 },
  highlightLabel: { marginTop: 6, fontSize: 11, fontWeight: '600', maxWidth: 70 },
  emptyHighlight: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 8, paddingRight: 16 },
  emptyHighlightCircle: {
    width: HIGHLIGHT_SIZE,
    height: HIGHLIGHT_SIZE,
    borderRadius: HIGHLIGHT_SIZE / 2,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#b7d58c',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.58)',
  },
  emptyHighlightPlus: { fontSize: 30, lineHeight: 34, color: '#5faf70', fontWeight: '300' },
  emptyHighlightText: { width: 150, fontSize: 13, lineHeight: 17, fontWeight: '600' },
  pressedItem: { opacity: 0.72, transform: [{ scale: 0.98 }] },

  photoGrid: {
    paddingHorizontal: 7,
    paddingTop: Spacing.md,
  },
  gridRow: { flexDirection: 'row', marginBottom: 2 },
  gridImage: {
    width: (width - 14 - 4) / 3,
    height: (width - 14 - 4) / 3,
    marginRight: 2,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.borderBrandTertiary,
  },
  largeImage: {
    width: ((width - 14 - 4) / 3) * 2 + 2,
    height: ((width - 14 - 4) / 3) * 2 + 2,
  },
  smallImagesContainer: { flex: 1 },
  smallImage: {
    width: '100%',
    height: (width - 14 - 4) / 3 - 1,
    marginBottom: 2,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.borderBrandTertiary,
  },

  // Custom Cropping Interface Styles
  cropOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#050505',
    zIndex: 1000,
  },
  cropHeader: {
    minHeight: 92,
    paddingTop: 44,
    paddingHorizontal: Spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cropHeaderButton: {
    minWidth: 58,
    minHeight: 40,
    justifyContent: 'center',
  },
  cropHeaderButtonText: {
    color: '#ffffff',
    fontSize: Typography.fontSize.md,
    fontWeight: '600',
  },
  cropHeaderDone: {
    color: '#b7d58d',
    fontSize: Typography.fontSize.md,
    fontWeight: '700',
    textAlign: 'right',
  },
  cropContainer: {
    flex: 1,
    justifyContent: 'center',
    gap: Spacing.lg,
  },
  cropTitle: {
    fontSize: Typography.fontSize.md,
    fontWeight: '700',
    color: '#ffffff',
    textAlign: 'center',
  },
  cropSubtitle: {
    fontSize: Typography.fontSize.sm,
    color: 'rgba(255,255,255,0.72)',
    textAlign: 'center',
    paddingHorizontal: Spacing.xl,
  },
  imageContainer: {
    position: 'relative',
    width,
    height: Math.min(430, Math.round(width * 1.12)),
  },
  cropImage: {
    width: '100%',
    height: '100%',
  },
  cropSelection: {
    position: 'absolute',
    borderWidth: 2,
    borderColor: '#ffffff',
    backgroundColor: 'rgba(183, 213, 140, 0.08)',
  },
  cropGrid: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'none',
  },
  cropGridLine: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
  },
  cropGridLineVertical: {
    width: 1,
    height: '100%',
    left: '33.33%',
  },
  cropGridLineHorizontal: {
    width: '100%',
    height: 1,
    top: '50%',
  },
  divider: {
    height: 1,
    backgroundColor: Colors.borderBrandTertiary,
    marginVertical: Spacing.md,
    marginHorizontal: SAFE_PADDING,
  },
  coverSheetTitle: {
    fontSize: 20,
    lineHeight: 26,
    fontWeight: '700',
    textAlign: 'center',
  },
  coverSheetDescription: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.sm,
  },
  coverSheetDivider: {
    height: StyleSheet.hairlineWidth,
    marginHorizontal: Spacing.md,
    marginVertical: Spacing.xs,
  },
  coverSheetCancel: {
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.xs,
  },
  coverSheetCancelText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
