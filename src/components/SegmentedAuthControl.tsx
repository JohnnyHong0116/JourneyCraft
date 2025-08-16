import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, Easing, LayoutChangeEvent, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors, Spacing, Typography, Shadows } from '../theme/designSystem';

export type AuthTab = 'login' | 'signup';

interface SegmentedAuthControlProps {
	active: AuthTab;
	onChange: (next: AuthTab) => void;
}

const OUTER_RADIUS = 10;
const INNER_RADIUS = 7;

const SegmentedAuthControl: React.FC<SegmentedAuthControlProps> = ({ active, onChange }) => {
	const [width, setWidth] = useState<number>(360);
	const [height, setHeight] = useState<number>(36);
	const pillX = useRef(new Animated.Value(active === 'signup' ? width / 2 : 0)).current;

	useEffect(() => {
		const toValue = active === 'signup' ? width / 2 : 0;
		Animated.timing(pillX, {
			toValue,
			duration: 220,
			easing: Easing.out(Easing.quad),
			useNativeDriver: true,
		}).start();
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [active, width]);

	const onLayout = useCallback((e: LayoutChangeEvent) => {
		const { width: w, height: h } = e.nativeEvent.layout;
		setWidth(w);
		setHeight(h);
	}, []);

	const handlePress = (next: AuthTab) => {
		if (next === active) return;
		const toValue = next === 'signup' ? width / 2 : 0;
		// Start pill animation
		Animated.timing(pillX, {
			toValue,
			duration: 220,
			easing: Easing.out(Easing.quad),
			useNativeDriver: true,
		}).start();
		// Trigger content transition immediately for simultaneous animations
		onChange(next);
	};

	// Make the pill narrower and adjust position for better spacing
	const pillWidth = width / 2 - 24; // Extremely narrower for better spacing
	
	// Calculate position adjustments for centering
	const leftPadding = 12; // Extra padding from left edge
	const rightShift = 0; // No extra shift for right pill - move it left
	
	const pillStyle = {
		transform: [{ 
			translateX: active === 'signup' ? 
				// For Sign Up, use exact half width position with no extra shift
				Animated.add(pillX, new Animated.Value(-8)) : 
				// For Login, keep the left padding
				Animated.add(pillX, new Animated.Value(leftPadding))
		}],
		width: pillWidth,
		height: height - 4,
	};

	return (
		<View style={styles.container} onLayout={onLayout}>
			<Animated.View style={[styles.pill, pillStyle]} />
			<TouchableOpacity style={styles.segment} onPress={() => handlePress('login')}>
				<Text style={styles.text}>Log in</Text>
			</TouchableOpacity>
			<TouchableOpacity style={styles.segment} onPress={() => handlePress('signup')}>
				<Text style={styles.text}>Sign Up</Text>
			</TouchableOpacity>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		backgroundColor: Colors.inputSearchBackground,
		borderRadius: OUTER_RADIUS,
		padding: 2,
		width: 360,
		height: 36,
		alignSelf: 'center',
		overflow: 'hidden',
	},
	segment: {
		flex: 1,
		borderRadius: INNER_RADIUS,
		alignItems: 'center',
		justifyContent: 'center',
	},
	text: {
		fontSize: Typography.fontSize.sm,
		fontWeight: 'bold',
		color: Colors.black,
		letterSpacing: Typography.letterSpacing.wider,
	},
	pill: {
		position: 'absolute',
		left: 2,
		top: 2,
		borderRadius: INNER_RADIUS,
		backgroundColor: Colors.white,
		...Shadows.small,
	},
});

export default SegmentedAuthControl;
