import React, { useEffect, useMemo, useState, useRef } from 'react';
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
  Vibration,
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
  Easing,
} from 'react-native-reanimated';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import * as ImageManipulator from 'expo-image-manipulator';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors, Spacing, BorderRadius } from '@/theme/designSystem';
import { Icon } from '@/components/Icon';

const { width } = Dimensions.get('window');

// --- tokens ---
const SAFE_PADDING = 16;
const BANNER_CLOSED = 190;   // closed height (like FB/WeChat mini header)
const AVATAR_SIZE = 96;
const AVATAR_OVERLAP = 32;
const HIGHLIGHT_SIZE = 64;

// how far the user must scroll up into content before collapsing the full image
const COLLAPSE_AT = 64;  // try 64–96 for your taste
const THRESHOLD = 120;   // unchanged: pull-down distance to reveal

// your real cover image URI
const COVER_URI = 'https://picsum.photos/1200/1800'; // vertical example
const COVER_STORAGE_KEY = 'profile.cover.uri';
const COVER_CROP_KEY = 'profile.cover.crop';
const CROPPED_STORAGE_KEY = 'profile.cover.cropped';

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
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

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
      
      setCropArea({
        x: Math.max(0, centerX),
        y: Math.max(0, centerY),
        width: Math.min(cropWidth, width),
        height: Math.min(cropHeight, height)
      });
    });
  }, [imageUri, BANNER_AR]);

  const handleContainerLayout = (event: any) => {
    const { width, height } = event.nativeEvent.layout;
    setContainerSize({ width, height });
  };

  const handleTouchStart = (event: any) => {
    const { locationX, locationY } = event.nativeEvent;
    setDragStart({ x: locationX, y: locationY });
    setIsDragging(true);
  };

  const handleTouchMove = (event: any) => {
    if (!isDragging) return;
    
    const { locationX, locationY } = event.nativeEvent;
    const deltaX = locationX - dragStart.x;
    const deltaY = locationY - dragStart.y;
    
    // Convert screen coordinates to image coordinates
    const scaleX = imageSize.width / containerSize.width;
    const scaleY = imageSize.height / containerSize.height;
    
    // For now, just move the crop area (maintain aspect ratio)
    const newX = Math.max(0, Math.min(imageSize.width - cropArea.width, cropArea.x + deltaX * scaleX));
    const newY = Math.max(0, Math.min(imageSize.height - cropArea.height, cropArea.y + deltaY * scaleY));
    
    setCropArea(prev => ({
      ...prev,
      x: newX,
      y: newY
    }));
    
    setDragStart({ x: locationX, y: locationY });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const handleCrop = () => {
    onCropComplete(cropArea);
  };

  // Convert image coordinates to screen coordinates for display
  const screenCropArea = {
    x: (cropArea.x / imageSize.width) * containerSize.width,
    y: (cropArea.y / imageSize.height) * containerSize.height,
    width: (cropArea.width / imageSize.width) * containerSize.width,
    height: (cropArea.height / imageSize.height) * containerSize.height,
  };

  return (
    <View style={styles.cropOverlay}>
      <View style={styles.cropContainer}>
        <Text style={styles.cropTitle}>Select Cover Area</Text>
        <Text style={styles.cropSubtitle}>Drag to move the selection. The crop will match your banner perfectly.</Text>
        
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
          />
        </View>

        <View style={styles.cropButtons}>
          <TouchableOpacity style={styles.cropButton} onPress={onCancel}>
            <Text style={styles.cropButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.cropButton, styles.cropButtonPrimary]} onPress={handleCrop}>
            <Text style={[styles.cropButtonText, styles.cropButtonTextPrimary]}>Select</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default function ProfileTab() {
  const insets = useSafeAreaInsets();
  const scrollRef = useAnimatedRef<Animated.ScrollView>();

  // Custom cover image state
  const [customCoverUri, setCustomCoverUri] = useState<string | null>(null);
  const [cropInfo, setCropInfo] = useState<{ x: number; y: number; width: number; height: number } | null>(null);
  const [croppedCoverUri, setCroppedCoverUri] = useState<string | null>(null);
  const currentCoverUri = customCoverUri || COVER_URI;

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

  // get image aspect ratio so we can compute a true "full" height (no cropping)
  const [imgH, setImgH] = useState<number | null>(null);
  const [imgW, setImgW] = useState<number | null>(null);
  useEffect(() => {
    Image.getSize(
      currentCoverUri,
      (w, h) => { setImgW(w); setImgH(h); },
      () => { setImgW(width); setImgH(Math.round(width * 1.33)); }
    );
  }, [currentCoverUri]);

  // base header includes safe-top so the cover sits under status bar
  const HEADER_BASE = useMemo(() => BANNER_CLOSED + insets.top, [insets.top]);

  // full height = width * (imgH/imgW) + top inset (shows entire photo when revealed)
  const FULL_HEIGHT = useMemo(() => {
    if (!imgH || !imgW) return Math.max(HEADER_BASE, Math.round(width * 0.75) + insets.top);
    return Math.max(HEADER_BASE, Math.round(width * (imgH / imgW)) + insets.top);
  }, [imgH, imgW, insets.top, HEADER_BASE]);

  // --- reanimated state ---
  const y = useSharedValue(0);            // scroll offset
  const revealed = useSharedValue(0);     // 0 (closed) -> 1 (full open)

  // show/hide the scrim overlay only when revealed
  const [scrimActive, setScrimActive] = useState(false);
  useAnimatedReaction(
    () => revealed.value,
    (v) => {
      const isActive = v > 0;
      console.log('🎭 Scrim active:', isActive, 'revealed value:', v);
      runOnJS(setScrimActive)(isActive);
    }
  );

  // Collapse helper
  const collapseCover = () => {
    console.log('🎯 Tap detected! Collapsing cover...');
    Vibration.vibrate(30); // Light haptic feedback for collapse
    // animate cover back to closed height
    revealed.value = withSpring(0, {
      damping: 20,
      stiffness: 100,
      mass: 0.8,
    });

    // use Reanimated's UI-thread scrollTo to go back to top cleanly
    scrollTo(scrollRef, 0, 0, true);
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
      // copy (not move) to retain source; use moveAsync if you prefer
      await FileSystem.copyAsync({ from: fromUri, to: dest });
      await AsyncStorage.setItem(COVER_STORAGE_KEY, dest);
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

  // pick from library
  async function chooseFromLibrary() {
    // ask permission if needed
    if (!libPerm || libPerm.status !== 'granted') {
      const res = await requestLibPerm();
      if (res.status !== 'granted') return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'images',
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
    if (!camPerm || camPerm.status !== 'granted') {
      const res = await requestCamPerm();
      if (res.status !== 'granted') return;
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
    setCustomCoverUri(null);
    setCropInfo(null);
    setCroppedCoverUri(null);
  }

  // replace your handleChangeCover with this action sheet-ish prompt
  function onPressChangeCover() {
    // simple platform-neutral UI; replace with a fancy ActionSheet if you want
    Alert.alert('Change Cover Photo', undefined, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Choose from Library', onPress: chooseFromLibrary },
      { text: 'Take Photo', onPress: takePhoto },
      { text: 'Reset to Default', style: 'destructive', onPress: resetCover },
    ]);
  }

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (e: any) => {
      const cy = e.contentOffset.y;
      y.value = cy;

      // keep full reveal until you really scroll into content
      if (revealed.value > 0 && cy >= COLLAPSE_AT) {
        revealed.value = withSpring(0, {
          damping: 20,
          stiffness: 100,
          mass: 0.8,
        });
      }
    },
    onEndDrag: (e: any) => {
      // snap OPEN when pulled far enough
      if (e.contentOffset.y < -THRESHOLD && revealed.value === 0) {
        // Add haptic feedback when expanding
        runOnJS(Vibration.vibrate)(50);
        revealed.value = withSpring(1, {
          damping: 15,
          stiffness: 80,
          mass: 1.2,
        });
      }
    },
    // no collapse on momentum alone — rely on actual offset into content
    onMomentumEnd: () => {},
  });

  // animated height: base + max(-y,0) + revealedDelta
  const coverStyle = useAnimatedStyle(() => {
    const pull = Math.max(-y.value, 0);
    const revealedDelta = revealed.value * (FULL_HEIGHT - HEADER_BASE);
    return { height: HEADER_BASE + pull + revealedDelta };
  });

  // fade out header content when cover is revealed
  const headerContentStyle = useAnimatedStyle(() => {
    // Calculate opacity based on pull distance, not just revealed state
    const pull = Math.max(-y.value, 0);
    const maxPull = THRESHOLD; // Use threshold as the point where content should be fully faded
    const fadeProgress = Math.min(pull / maxPull, 1); // 0 to 1 as you pull
    
    // Instead of dissolving, darken the content when expanded
    // Keep content visible but with reduced opacity when background is expanded
    const opacity = revealed.value === 1 ? 0.3 : (1 - fadeProgress * 0.7); // Darken to 30% opacity when fully revealed
    
    // Debug logging
    console.log('🎨 Fade progress:', fadeProgress.toFixed(2), 'Opacity:', opacity.toFixed(2), 'Revealed:', revealed.value.toFixed(2));
    
    return { opacity };
  });

  // dissolve buttons when cover is revealed (make them transparent)
  const buttonsStyle = useAnimatedStyle(() => {
    // Calculate opacity based on pull distance, not just revealed state
    const pull = Math.max(-y.value, 0);
    const maxPull = THRESHOLD; // Use threshold as the point where content should be fully faded
    const fadeProgress = Math.min(pull / maxPull, 1); // 0 to 1 as you pull
    
    // Buttons dissolve completely when expanded
    const opacity = revealed.value === 1 ? 0 : (1 - fadeProgress); // Completely transparent when fully revealed
    
    return { opacity };
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

  // Render logic: closed = cropped, revealed = full
  const headerUri = scrimActive ? currentCoverUri : (croppedCoverUri ?? currentCoverUri);
  const headerResizeMode = scrimActive ? 'contain' : 'cover';

  // Scrim overlay style - covers full screen when revealed, but excludes button area
  const scrimStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(revealed.value * 0.2, { duration: 200 }),
      backgroundColor: 'black',
    };
  });

  return (
    <View style={styles.root}>
      {/* draw under status bar */}
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

      {/* NOTE: exclude 'top' here so content can live under the status bar */}
      <SafeAreaView edges={['left', 'right', 'bottom']} style={styles.container}>

        <Animated.ScrollView
          ref={scrollRef}
          showsVerticalScrollIndicator={false}
          // iOS pull-bounce; Android needs overScrollMode to allow negative y
          bounces
          overScrollMode="always"
          scrollEventThrottle={16}
          onScroll={scrollHandler}
          contentInsetAdjustmentBehavior="never"
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
              resizeMode={headerResizeMode}
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
                  onPressIn={() => console.log('🔘 Change Cover button pressed!')}
                >
                  <Icon name="photo-selected" size={20} color="#FFFFFF" />
                  <Text style={styles.changeCoverText}>Change Cover</Text>
                </TouchableOpacity>
              </Animated.View>
            </ImageBackground>
          </Animated.View>

          {/* ---- HEADER BLOCK under the cover (keeps same padding; only cover height changes) ---- */}
          <Animated.View style={[styles.headerContainer, headerContentStyle]}>
            {/* avatar overlaps upward into the cover's lower edge */}
            <View style={styles.avatarContainer}>
              <View style={styles.avatar} />
            </View>

            {/* actions */}
            <Animated.View style={[styles.actionsRow, buttonsStyle]}>
              <TouchableOpacity style={styles.editProfileButton}>
                <Text style={styles.editProfileText}>Edit Profile</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.gearButton}>
                <Icon name="setting" size={22} color={Colors.textPrimary} />
              </TouchableOpacity>
            </Animated.View>

            {/* name + stats */}
            <View style={styles.contentRow}>
              <View style={styles.leftTextBlock}>
                <Text style={styles.username} numberOfLines={1}>Username</Text>
                <Text style={styles.bio} numberOfLines={2}>balabababa 亲亲抱抱举高高</Text>
                <Text style={styles.bio} numberOfLines={2}>阿巴阿巴阿巴阿巴</Text>
              </View>

              <View style={styles.statsBlock}>
                <View style={styles.statCell}><Text style={styles.statNumber}>85</Text><Text style={styles.statLabel}>Posts</Text></View>
                <View style={styles.statCell}><Text style={styles.statNumber}>520</Text><Text style={styles.statLabel}>Days</Text></View>
                <View style={styles.statCell}><Text style={styles.statNumber}>116</Text><Text style={styles.statLabel}>Countries</Text></View>
              </View>
            </View>
          </Animated.View>

          {/* ---- highlights row (unchanged) ---- */}
          <View style={styles.highlightsContainer}>
            <Animated.ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flexGrow: 0 }}>
              {[1, 2, 3, 4, 5].map((i) => (
                <View key={i} style={{ marginRight: 12 }}>
                  <View style={styles.highlightThumb} />
                </View>
              ))}
            </Animated.ScrollView>
          </View>

          {/* Horizontal Divider */}
          <View style={styles.divider} />

          {/* ---- photo grid (unchanged) ---- */}
          <View style={styles.photoGrid}>
            <View style={styles.gridRow}>
              <View style={styles.gridImage} />
              <View style={styles.gridImage} />
              <View style={styles.gridImage} />
            </View>

            <View style={styles.gridRow}>
              <View style={[styles.gridImage, styles.largeImage]} />
              <View style={styles.smallImagesContainer}>
                <View style={styles.smallImage} />
                <View style={styles.smallImage} />
              </View>
            </View>

            <View style={styles.gridRow}>
              <View style={styles.gridImage} />
              <View style={styles.gridImage} />
              <View style={styles.gridImage} />
            </View>

            <View style={styles.gridRow}>
              <View style={styles.gridImage} />
              <View style={styles.gridImage} />
              <View style={styles.gridImage} />
            </View>

            <View style={{ height: 100 }} />
      </View>
        </Animated.ScrollView>
    </SafeAreaView>

      {/* Custom Cropping Interface */}
      {showCropInterface && tempImageUri && (
        <CustomCropInterface
          imageUri={tempImageUri}
          onCropComplete={handleCropComplete}
          onCancel={handleCropCancel}
        />
      )}
    </View>
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
  highlightThumb: {
    width: HIGHLIGHT_SIZE, height: HIGHLIGHT_SIZE, borderRadius: HIGHLIGHT_SIZE / 2,
    backgroundColor: Colors.white, borderWidth: 1, borderColor: Colors.borderBrandTertiary,
  },

  photoGrid: {
    paddingHorizontal: 7,
    paddingTop: Spacing.md,
    backgroundColor: Colors.backgroundDefault,
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
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  cropContainer: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: 20,
    margin: 20,
    maxWidth: width - 40,
    maxHeight: '80%',
  },
  cropTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: 8,
  },
  cropSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 20,
  },
  imageContainer: {
    position: 'relative',
    width: width - 80,
    height: 300,
    marginBottom: 20,
  },
  cropImage: {
    width: '100%',
    height: '100%',
  },
  cropSelection: {
    position: 'absolute',
    borderWidth: 2,
    borderColor: '#b7d58c',
    backgroundColor: 'rgba(183, 213, 140, 0.2)',
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
  cropButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  cropButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.borderBrandTertiary,
    alignItems: 'center',
  },
  cropButtonPrimary: {
    backgroundColor: '#b7d58c',
    borderColor: '#b7d58c',
  },
  cropButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  cropButtonTextPrimary: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  divider: {
    height: 1,
    backgroundColor: Colors.borderBrandTertiary,
    marginVertical: Spacing.md,
    marginHorizontal: SAFE_PADDING,
  },
});


