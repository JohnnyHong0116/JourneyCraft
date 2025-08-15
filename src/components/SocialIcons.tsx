import React from 'react';
import { View } from 'react-native';
import { FontAwesome5, AntDesign, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

interface SocialIconProps {
  size?: number;
}

const ICON_SIZE = 28;
const boxStyle = { width: ICON_SIZE, height: ICON_SIZE, alignItems: 'center' as const, justifyContent: 'center' as const };

export const WeChatIcon: React.FC<SocialIconProps> = ({ size = ICON_SIZE }) => (
  <View style={boxStyle}>
    <MaterialCommunityIcons name="wechat" size={size} color="#07C160" style={{ transform: [{ translateX: -1 }] }} />
  </View>
);

export const AppleIcon: React.FC<SocialIconProps> = ({ size = ICON_SIZE }) => (
  <View style={boxStyle}>
    <AntDesign name="apple1" size={size} color="#000000" style={{ transform: [{ scale: 0.9 }] }} />
  </View>
);

export const GoogleIcon: React.FC<SocialIconProps> = ({ size = ICON_SIZE }) => (
  <View style={boxStyle}>
    <AntDesign name="google" size={size} color="#EA4335" style={{ transform: [{ scale: 0.9 }] }} />
  </View>
);

export const PhoneIcon: React.FC<SocialIconProps> = ({ size = ICON_SIZE }) => (
  <View style={boxStyle}>
    <Ionicons name="call" size={size} color="#000000" />
  </View>
);
