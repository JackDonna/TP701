import { Stack } from 'expo-router';
import Breadcrumbs from '../components/Breadcumbs'; // Importe ton composant Breadcrumbs
import Footer from '../components/Footer'; 
import { View, StyleSheet } from 'react-native';  // Ajoute cet import

export default function RootLayout() {
	return (
		<View style={styles.container}>
			<Stack
				screenOptions={{
					headerStyle: {
						backgroundColor: '#1e1e2d', // Couleur de fond de l'en-tête
					},
					headerTintColor: '#8A2BE2',
					headerTitle: () => <Breadcrumbs />, // Utilise Breadcrumbs comme titre
					headerTitleStyle: {
						fontWeight: 'bold',
					},
				}}
			>
				<Stack.Screen name="index" />
				<Stack.Screen name="users" />
				{/* Ajoute d'autres pages ici */}
				<Footer />
			</Stack>

		</View>
	);
}

const styles = StyleSheet.create({
	container: {
	  flex: 1,  // S'assurer que le container prend toute la hauteur de l'écran
	},
  });
