import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useRouter, useSegments } from 'expo-router'; // Hooks de navigation

const Breadcrumbs = () => {
	const router = useRouter();
	const segments = useSegments(); // Récupérer les segments de la route

	// Fonction pour générer les liens vers les pages précédentes
	const goToSegment = (index: number) => {
		const path = '/' + segments.slice(0, index + 1).join('/');
		router.push(path); // Navigue vers le segment cliqué
	};

	return (
		<View style={styles.breadcrumbContainer}>
			{segments.map((segment, index) => (
				<Pressable key={index} onPress={() => goToSegment(index)}>
					<Text style={styles.breadcrumbText}>
						{segment}
						{index < segments.length - 1 ? ' > ' : ''} {/* Séparateur */}
					</Text>
				</Pressable>
			))}
		</View>
	);
};

const styles = StyleSheet.create({
	breadcrumbContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		padding: 10,
		backgroundColor: '#1e1e2d',
	},
	breadcrumbText: {
		color: '#8A2BE2',
		fontSize: 16,
		fontWeight: 'bold',
		marginRight: 5,
	},
});

export default Breadcrumbs;
