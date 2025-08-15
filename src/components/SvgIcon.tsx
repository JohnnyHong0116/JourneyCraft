import React from 'react';
import { View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

interface SvgIconProps {
  width?: number;
  height?: number;
  color?: string;
  children: React.ReactNode;
}

export const SvgIcon: React.FC<SvgIconProps> = ({ 
  width = 24, 
  height = 24, 
  color = '#000000',
  children 
}) => {
  return (
    <View style={{ width, height }}>
      <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
        {children}
      </Svg>
    </View>
  );
};

// Predefined icons based on Figma design
export const UserIcon = ({ width = 24, height = 24, color = '#000000' }) => (
  <SvgIcon width={width} height={height} color={color}>
    <Path 
      d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" 
      stroke={color} 
      strokeWidth="1.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    <Path 
      d="M20.5899 22C20.5899 18.13 16.7399 15 11.9999 15C7.25991 15 3.40991 18.13 3.40991 22" 
      stroke={color} 
      strokeWidth="1.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </SvgIcon>
);

export const LockIcon = ({ width = 24, height = 24, color = '#000000' }) => (
  <SvgIcon width={width} height={height} color={color}>
    <Path 
      d="M19 11H5C3.89543 11 3 11.8954 3 13V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V13C21 11.8954 20.1046 11 19 11Z" 
      stroke={color} 
      strokeWidth="1.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    <Path 
      d="M7 11V7C7 5.67392 7.52678 4.40215 8.46447 3.46447C9.40215 2.52678 10.6739 2 12 2C13.3261 2 14.5979 2.52678 15.5355 3.46447C16.4732 4.40215 17 5.67392 17 7V11" 
      stroke={color} 
      strokeWidth="1.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </SvgIcon>
);

export const EyeIcon = ({ width = 24, height = 24, color = '#000000' }) => (
  <SvgIcon width={width} height={height} color={color}>
    <Path 
      d="M1 12S5 4 12 4S23 12 23 12S19 20 12 20S1 12 1 12Z" 
      stroke={color} 
      strokeWidth="1.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    <Path 
      d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" 
      stroke={color} 
      strokeWidth="1.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </SvgIcon>
);

export const LocationIcon = ({ width = 24, height = 24, color = '#000000' }) => (
  <SvgIcon width={width} height={height} color={color}>
    <Path 
      d="M21 10C21 17 12 23 12 23S3 17 3 10C3 7.61305 3.94821 5.32387 5.63604 3.63604C7.32387 1.94821 9.61305 1 12 1C14.3869 1 16.6761 1.94821 18.364 3.63604C20.0518 5.32387 21 7.61305 21 10Z" 
      stroke={color} 
      strokeWidth="1.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    <Path 
      d="M12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13Z" 
      stroke={color} 
      strokeWidth="1.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </SvgIcon>
);

export const ChevronDownIcon = ({ width = 24, height = 24, color = '#000000' }) => (
  <SvgIcon width={width} height={height} color={color}>
    <Path 
      d="M6 9L12 15L18 9" 
      stroke={color} 
      strokeWidth="1.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </SvgIcon>
);

export const PhoneIcon = ({ width = 24, height = 24, color = '#000000' }) => (
  <SvgIcon width={width} height={height} color={color}>
    <Path 
      d="M22 16.92V19.92C22.0011 20.1985 21.9441 20.4742 21.8325 20.7294C21.7209 20.9846 21.5573 21.2136 21.3521 21.4019C21.1469 21.5902 20.9046 21.7335 20.6407 21.8227C20.3769 21.9119 20.0975 21.9452 19.82 21.92C16.7428 21.5856 13.787 20.5341 11.19 18.85C8.77382 17.3146 6.72533 15.2661 5.18999 12.85C3.49997 10.2412 2.44824 7.27099 2.11999 4.18C2.09477 3.90347 2.12787 3.62476 2.21649 3.36162C2.30512 3.09849 2.44756 2.85669 2.63476 2.65189C2.82196 2.44708 3.04971 2.28367 3.30351 2.17192C3.55731 2.06017 3.83159 2.00269 4.10999 2.003H7.10999C7.59522 1.99522 8.06574 2.16708 8.43376 2.48353C8.80178 2.79999 9.042 3.23945 9.10999 3.72C9.23662 4.68007 9.47144 5.62273 9.80999 6.53C9.94454 6.88792 9.97348 7.27675 9.89382 7.65307C9.81416 8.02939 9.62877 8.37471 9.35999 8.65L8.08999 9.92C9.51355 12.4135 11.5865 14.4865 14.08 15.91L15.35 14.64C15.6253 14.3712 15.9706 14.1858 16.3469 14.1062C16.7233 14.0265 17.1121 14.0555 17.47 14.19C18.3773 14.5286 19.3199 14.7634 20.28 14.89C20.7658 14.9585 21.2094 15.2032 21.5265 15.5775C21.8437 15.9518 22.0122 16.4296 22 16.92Z" 
      stroke={color} 
      strokeWidth="1.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </SvgIcon>
);
