# JourneyCraft Mobile App

A React Native mobile application with a beautiful login screen designed in Figma and implemented with exact design specifications.

## Features

- **Exact Figma Design Implementation**: Pixel-perfect recreation of the Figma design
- **Custom SVG Icons**: All icons from the Figma design implemented as React Native SVG components
- **Design System**: Consistent colors, typography, spacing, and shadows based on Figma variables
- **Interactive Elements**: 
  - Password visibility toggle
  - Remember me checkbox
  - Segmented control for Login/Sign Up
  - Social login buttons
- **Responsive Design**: Adapts to different screen sizes
- **TypeScript**: Full TypeScript support for better development experience

## Design Specifications

The app uses the exact design system from your Figma file:

### Colors
- Primary: `#000000` (Black)
- Background: `#ffffff` (White)
- Input Background: `#e3e3e5` (Light Gray)
- Button: `#b7d58c` (Green)
- Border: `#757575` (Gray)

### Typography
- Font Sizes: 12px, 14px, 16px, 18px, 20px, 32px
- Font Weights: Regular, Medium, Semibold, Bold
- Letter Spacing: Optimized for readability

### Spacing & Layout
- Consistent spacing system: 4px, 8px, 12px, 16px, 20px, 24px, 32px
- Border Radius: 4px, 8px, 10px, 15px, 20px, 100px
- Shadows: Subtle elevation effects

## Project Structure

```
src/
├── components/
│   ├── SvgIcon.tsx          # Reusable SVG icon components
│   └── SocialIcons.tsx      # Social media login icons
├── constants/
│   └── designSystem.ts      # Design system constants
├── screens/
│   └── LoginScreen.tsx      # Main login screen
└── assets/
    └── icons.ts             # Icon definitions

App.tsx                      # Main app component
package.json                 # Dependencies
app.json                     # Expo configuration
```

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator (for iOS) or Android Emulator (for Android)

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd journeycraft-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start the development server**
   ```bash
   npm start
   # or
   yarn start
   ```

4. **Run on device/simulator**
   - Press `i` for iOS Simulator
   - Press `a` for Android Emulator
   - Scan QR code with Expo Go app on your phone

## Development

### Key Components

#### LoginScreen
The main login screen component that includes:
- Header with logo and title
- Segmented control for Login/Sign Up
- Form fields with icons
- Remember me checkbox
- Social login buttons

#### SvgIcon Components
Custom SVG icons matching the Figma design:
- UserIcon
- LockIcon
- EyeIcon
- LocationIcon
- ChevronDownIcon
- PhoneIcon

#### Social Icons
Social media login icons:
- WeChatIcon
- AppleIcon
- GoogleIcon

### Design System

All design tokens are centralized in `src/constants/designSystem.ts`:
- Colors
- Typography
- Spacing
- Border Radius
- Shadows

## Customization

### Adding New Icons
1. Create the SVG path in `src/components/SvgIcon.tsx`
2. Export the new icon component
3. Use it in your components

### Modifying Colors
Update the `Colors` object in `src/constants/designSystem.ts`

### Changing Typography
Modify the `Typography` object in the design system constants

## Dependencies

- **expo**: React Native framework
- **react-native-svg**: SVG support for React Native
- **react-native-safe-area-context**: Safe area handling
- **@expo/vector-icons**: Additional icon support

## Building for Production

### iOS
```bash
expo build:ios
```

### Android
```bash
expo build:android
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support or questions, please open an issue in the repository.
