import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Pressable } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

const DeliveriesScreen = () => {
	const router = useRouter();
	const [deliveries, setDeliveries] = useState([]);
	const [loading, setLoading] = useState(true);
	const [errorMessage, setErrorMessage] = useState('');
	const [isSiteManager, setIsSiteManager] = useState(false); // Pour stocker le rôle de l'utilisateur

	useEffect(() => {
		const fetchData = async () => {
			try {
				const token = await AsyncStorage.getItem('token');
				if (!token) {
					router.replace('/'); // Si pas de token, redirection vers la page de connexion
					return;
				}

				// Récupérer les livraisons de l'utilisateur
				const deliveriesResponse = await fetch(
					'http://troglodytes.test/api/getUserDeliveries',
					{
						method: 'GET',
						headers: {
							Accept: 'application/json',
							Authorization: `Bearer ${token}`, // Ajoute le token Bearer pour authentifier l'utilisateur
						},
					}
				);

				if (!deliveriesResponse.ok) {
					throw new Error('Erreur lors de la récupération des livraisons');
				}

				const deliveriesData = await deliveriesResponse.json();
				setDeliveries(deliveriesData.deliveries || []); // Assigner les livraisons ou un tableau vide

				// Appeler /api/me pour récupérer les informations utilisateur, y compris son rôle
				const userResponse = await fetch('http://troglodytes.test/api/me', {
					method: 'POST',
					headers: {
						Accept: 'application/json',
						Authorization: `Bearer ${token}`,
					},
				});

				if (!userResponse.ok) {
					throw new Error('Erreur lors de la récupération des informations utilisateur');
				}

				const userData = await userResponse.json();
				console.log(userData);

				// Vérifier si l'utilisateur est "gérant de site"
				if (userData.role_id === 1) {
					setIsSiteManager(true); // Met à jour l'état si l'utilisateur a le rôle
				}
			} catch (error) {
				setErrorMessage(error.message);
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, []);

	if (loading) {
		return (
			<View style={styles.container}>
				<Text style={styles.text}>Chargement...</Text>
			</View>
		);
	}

	if (errorMessage) {
		return (
			<View style={styles.container}>
				<Text style={styles.errorText}>{errorMessage}</Text>
			</View>
		);
	}

	// Si l'utilisateur n'a pas encore créé de livraison
	if (deliveries.length === 0) {
		return (
			<View style={styles.container}>
				<Text style={styles.text}>Commencez par créer quelque chose !</Text>
				<Pressable style={styles.createButton} onPress={() => router.push('/create-delivery')}>
					<Text style={styles.buttonText}>Créer une livraison</Text>
				</Pressable>

				{/* Si l'utilisateur est "gérant de site", ajouter le bouton pour créer un produit */}
				{isSiteManager && (
					<Pressable
						style={styles.createProductButton}
						onPress={() => router.push('/create-product')}
					>
						<Text style={styles.buttonText}>Ajouter un produit</Text>
					</Pressable>
				)}
			</View>
		);
	}

	return (
		<View style={styles.container}>
			<FlatList
				data={deliveries}
				keyExtractor={(item) => item.id.toString()}
				renderItem={({ item }) => (
					<View style={styles.deliveryItem}>
						<Text style={styles.deliveryText}>Livraison #{item.id}</Text>
						<Text style={styles.deliveryText}>Statut : {item.status}</Text>
					</View>
				)}
			/>

			{/* Si l'utilisateur est "gérant de site", ajouter le bouton pour créer un produit */}
			{isSiteManager && (
				<Pressable
					style={styles.createProductButton}
					onPress={() => router.push('/create-product')}
				>
					<Text style={styles.buttonText}>Ajouter un produit</Text>
				</Pressable>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		padding: 20,
		backgroundColor: '#1e1e2d',
	},
	text: {
		color: '#FFF',
		fontSize: 18,
		marginBottom: 20,
	},
	errorText: {
		color: 'red',
	},
	deliveryItem: {
		backgroundColor: '#2c2c3a',
		padding: 15,
		borderRadius: 8,
		marginBottom: 10,
		width: '100%',
	},
	deliveryText: {
		color: '#FFF',
	},
	createButton: {
		backgroundColor: '#8A2BE2',
		padding: 15,
		borderRadius: 8,
		alignItems: 'center',
		marginTop: 20,
	},
	createProductButton: {
		backgroundColor: '#8A2BE2', // Même thème violet
		padding: 15,
		borderRadius: 8,
		alignItems: 'center',
		marginTop: 10,
	},
	buttonText: {
		color: '#FFF',
		fontSize: 16,
		fontWeight: 'bold',
	},
});

export default DeliveriesScreen;
