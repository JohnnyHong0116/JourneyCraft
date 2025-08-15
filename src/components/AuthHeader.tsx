import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Spacing, Typography } from '../theme/designSystem';

interface AuthHeaderProps {
	title?: string;
	subtitle?: string;
}

const AuthHeader: React.FC<AuthHeaderProps> = ({
	title = 'Get Started now',
	subtitle = 'Create an account or log in to explore about our app',
}) => {
	return (
		<View style={styles.container}>
			<Text style={styles.logo}>JourneyCraft</Text>
			<Text style={styles.title}>{title}</Text>
			<Text style={styles.subtitle}>{subtitle}</Text>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		alignItems: 'center',
		marginTop: Spacing.xxxl,
		marginBottom: Spacing.xl,
	},
	logo: {
		fontSize: Typography.fontSize.xl,
		fontWeight: 'bold',
		color: Colors.black,
		marginBottom: Spacing.md,
	},
	title: {
		fontSize: Typography.fontSize.xxl,
		fontWeight: 'bold',
		color: Colors.black,
		textAlign: 'center',
		letterSpacing: Typography.letterSpacing.tight,
		lineHeight: Typography.fontSize.xxl * Typography.lineHeight.normal,
	},
	subtitle: {
		fontSize: Typography.fontSize.xs,
		color: Colors.black,
		textAlign: 'center',
		lineHeight: Typography.fontSize.xs * Typography.lineHeight.relaxed,
		letterSpacing: Typography.letterSpacing.widest,
		maxWidth: 222,
	},
});

export default AuthHeader;
