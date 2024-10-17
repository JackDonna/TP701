import React, { useState, useEffect } from 'react';
import { View, TextInput, Text, Pressable, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router'; // Utilisation de la navigation
import Axios from 'axios';

const LoginScreen = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [loading, setLoading] = useState(false);
	const [feedbackMessage, setFeedbackMessage] = useState('');
	const [checkingAuth, setCheckingAuth] = useState(true); // État pour vérifier l'authentification
	const router = useRouter();
	const api = Axios.create({
		baseURL: 'http://troglodytes.test/api',
		withCredentials: true,
		headers: {
			Accept: 'application/json',
		},
	});

	useEffect(() => {
		const checkAuth = async () => {
			try {
				const token = await AsyncStorage.getItem('token');
				if (token) {
					const token = await AsyncStorage.getItem('token'); // Récupérer le token

					if (!token) {
						throw new Error('Token non disponible');
					}
					console.log(token);

					api
						.get('/loginToken', {
							headers: {
								Accept: 'application/json',
								Authorization: `Bearer ${token}`, // Envoyer le token dans les en-têtes
							},
						})
						.then((response) => {
							if (response.status === 200) {
								router.push('/users');
							}
						});
				}
			} catch (error) {
				console.error('Erreur lors de la vérification du token', error);
			} finally {
				setCheckingAuth(false);
			}
		};
		checkAuth();
	}, []);

	// if (checkingAuth) {
	// 	return null; // Ou un indicateur de chargement si tu préfères
	// }

	// const logout = async () => {
	// 	try {
	// 		await AsyncStorage.removeItem('token'); // Supprime le token
	// 		console.log('Token supprimé');
	// 	} catch (error) {
	// 		console.error('Erreur lors de la suppression du token', error);
	// 	}
	// };

	const handleLogin = async () => {
		if (!email || !password) {
			setFeedbackMessage('Veuillez entrer un email et un mot de passe');
			return;
		}

		setLoading(true);
		setFeedbackMessage('');
		// await logout();
		try {
			const loginResponse = await api.post('/login', {
				email,
				password,
			});

			if (loginResponse.status === 401) {
				setFeedbackMessage('Email ou mot de passe incorrect');
			} else {
				const tokenData = loginResponse.data;
				const token = tokenData.token;
				await AsyncStorage.setItem('token', token); // Stocke le token
			}

			// Rediriger vers la page des utilisateurs après la connexion
			// router.push('/users'); // Redirection vers la page des utilisateurs
		} catch (error) {
			setFeedbackMessage('Une erreur est survenue');
		} finally {
			setLoading(false);
		}
	};

	return (
		<View style={styles.container}>
			<Text style={styles.title}>Connexion</Text>

			<TextInput
				value={email}
				onChangeText={setEmail}
				placeholder="Entrez votre email"
				placeholderTextColor="#AAA"
				inputMode="email"
				autoCapitalize="none"
				style={styles.input}
			/>

			<TextInput
				value={password}
				onChangeText={setPassword}
				placeholder="Entrez votre mot de passe"
				placeholderTextColor="#AAA"
				secureTextEntry
				style={styles.input}
			/>

			{feedbackMessage ? (
				<Text
					style={[
						styles.feedbackMessage,
						feedbackMessage.includes('Erreur') ? styles.errorText : styles.errorText,
					]}
				>
					{feedbackMessage}
				</Text>
			) : null}

			<Pressable
				onPress={handleLogin}
				disabled={loading}
				style={({ pressed }) => [
					styles.button,
					pressed ? styles.buttonPressed : styles.buttonNormal,
					loading ? styles.buttonDisabled : null,
				]}
			>
				<Text style={styles.buttonText}>{loading ? 'Connexion...' : 'Se connecter'}</Text>
			</Pressable>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#1e1e2d',
		justifyContent: 'center',
		padding: 20,
	},
	title: {
		color: '#FFF',
		fontSize: 24,
		fontWeight: 'bold',
		marginBottom: 20,
		textAlign: 'center',
	},
	input: {
		backgroundColor: '#2c2c3a',
		color: '#FFF',
		borderRadius: 8,
		padding: 12,
		marginBottom: 15,
		borderColor: '#5e5e6d',
		borderWidth: 1,
	},
	button: {
		padding: 12,
		borderRadius: 8,
		alignItems: 'center',
	},
	buttonNormal: {
		backgroundColor: '#8A2BE2',
	},
	buttonPressed: {
		backgroundColor: '#7320c1',
	},
	buttonDisabled: {
		backgroundColor: '#555',
	},
	buttonText: {
		color: '#FFF',
		fontSize: 16,
		fontWeight: 'bold',
	},
	feedbackMessage: {
		textAlign: 'center',
		marginBottom: 15,
	},
	errorText: {
		color: 'red',
	},
	successText: {
		color: 'green',
	},
});

export default LoginScreen;
