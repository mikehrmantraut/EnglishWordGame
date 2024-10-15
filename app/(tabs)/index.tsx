import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';
import { useRouter } from 'expo-router';
import { home_styles } from '../../styles/homeStyles';

const HomePage: React.FC = () => {
  const router = useRouter();

  const handleStartGame = () => {
    router.push('./game');
  };

  return (
    <ImageBackground 
      source={require('../../assets/images/ana-ekran.jpg')}
      style={home_styles.container}
      resizeMode="cover"
    >
      <View style={home_styles.titleContainer}>
        <Text style={home_styles.title}>English Word Game</Text>
      </View>
      <TouchableOpacity style={home_styles.button} onPress={handleStartGame}>
        <Text style={home_styles.buttonText}>Oyuna Başla</Text>
      </TouchableOpacity>
    </ImageBackground>
  );
};


export default HomePage;


