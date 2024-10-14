import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';
import { useRouter } from 'expo-router';

const HomePage: React.FC = () => {
  const router = useRouter();

  const handleStartGame = () => {
    router.push('./game');
  };

  return (
    <ImageBackground 
      source={require('../../assets/images/ana-ekran.jpg')}
      style={styles.container}
      resizeMode="cover"
    >
      <View style={styles.titleContainer}>
        <Text style={styles.title}>English Word Game</Text>
      </View>
      <TouchableOpacity style={styles.button} onPress={handleStartGame}>
        <Text style={styles.buttonText}>Oyuna Başla</Text>
      </TouchableOpacity>
    </ImageBackground>
  );
};


export default HomePage;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  titleContainer: {
    backgroundColor: '#fff', // Başlık arka plan rengi
    borderRadius: 10, // Yuvarlatılmış köşeler
    paddingVertical: 20, // Başlık çevresinde boşluk
    paddingHorizontal: 30, // Başlık çevresinde yatay boşluk
    marginBottom: 20, // Başlık ile buton arasında boşluk
  },
  title: {
    fontSize: 30, // Başlık boyutu artırıldı
    fontWeight: 'bold',
    textAlign: 'center', // Başlık metni ortalanmış
  },
  button: {
    backgroundColor: '#007bff', // Buton arka plan rengi
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    elevation: 3, // Android için gölge
    shadowColor: '#000', // iOS için gölge
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  buttonText: {
    color: '#fff', // Buton metni rengi
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});