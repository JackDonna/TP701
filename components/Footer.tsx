import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Footer = () => {
  const router = useRouter();
  const [isSiteManager, setIsSiteManager] = useState(false);  // Pour vérifier si l'utilisateur est "gérant de site"

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) return;

        // Appel à /api/me pour récupérer le rôle de l'utilisateur
        const response = await fetch('http://troglodytes.test/api/me', {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        const userData = await response.json();
        if (userData.role === 'gérant de site') {
          setIsSiteManager(true);  // Si l'utilisateur est "gérant de site", mettre à jour l'état
        }
      } catch (error) {
        console.error('Erreur lors de la récupération du rôle', error);
      }
    };

    fetchUserRole();
  }, []);

  return (
    <View style={styles.footerContainer}>
      <Pressable style={styles.footerButton} onPress={() => router.push('/create-delivery')}>
        <Text style={styles.buttonText}>Ajouter une livraison</Text>
      </Pressable>

      {isSiteManager && (
        <Pressable style={styles.footerButton} onPress={() => router.push('/create-product')}>
          <Text style={styles.buttonText}>Ajouter un produit</Text>
        </Pressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: '#2c2c3a',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    width: '100%',
  },
  footerButton: {
    backgroundColor: '#8A2BE2',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Footer;
