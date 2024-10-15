import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const game_styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#E6F3FF',
    },
    backButton: {
      position: 'absolute',
      top: 40,
      left: 20,
      padding: 10,
      flexDirection: 'row',
      alignItems: 'center',
    },
    backButtonText: {
      marginLeft: 5,
      fontSize: 16,
      color: 'black',
    },
    livesContainer: {
      position: 'absolute',
      top: 40,
      right: 20,
      flexDirection: 'row',
    },
    heartContainer: {
      marginHorizontal: 2,
    },
    infoContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '80%',
      marginBottom: 30,
    },
    scoreContainer: {
      backgroundColor: 'rgba(255, 255, 255, 0.8)',
      padding: 10,
      borderRadius: 10,
    },
    timerContainer: {
      backgroundColor: 'rgba(255, 255, 255, 0.8)',
      padding: 10,
      borderRadius: 10,
    },
    infoText: {
      fontSize: 25,
      fontWeight: 'bold',
    },
    word: {
      fontSize: 50,
      fontWeight: 'bold',
      textAlign: 'center',
      marginTop: -height * 0.2,
    },
    optionsContainer: {
      position: 'absolute',
      bottom: 20, // Ekranın en altından biraz yukarıda
      width: width,
      height: height * 0.35, // Ekran yüksekliğinin %40'ı kadar
      paddingHorizontal: 10,
    },
    optionsRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 10, // Satırlar arası boşluk
      height: '45%', // Her satır, container'ın yaklaşık yarısı kadar
    },
    optionButton: {
      backgroundColor: 'purple',
      borderRadius: 10,
      width: '49%', // Her buton, satırın yaklaşık yarısı kadar
      justifyContent: 'center',
      alignItems: 'center',
    },
    optionText: {
      fontSize: 18,
      fontWeight: 'bold',
      color: 'white',
      textAlign: 'center',
    },
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
      backgroundColor: 'white',
      padding: 20,
      borderRadius: 10,
      alignItems: 'center',
    },
    modalTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 10,
    },
    modalScore: {
      fontSize: 18,
      marginBottom: 20,
    },
    heart: {
      marginHorizontal: 2,
      borderWidth: 1,
      borderColor: 'black',
      borderRadius: 12
    },
    highScoreContainer: {
      position: 'absolute',
      top: 80,
      alignSelf: 'center',
      backgroundColor: 'rgba(255, 255, 255, 0.8)',
      padding: 10,
      borderRadius: 10,
    },
    highScoreText: {
      fontSize: 16,
      fontWeight: 'bold',
    },
    modalButton: {
      backgroundColor: 'green',
      padding: 10,
      borderRadius: 5,
      marginTop: 10,  // Add some space between buttons
      width: '100%',  // Make buttons full width
      alignItems: 'center',
    },
    modalButtonText: {
      fontSize: 16,
      fontWeight: 'bold',
      color: 'white'
    },
    copyrightContainer: {
      position: 'absolute',
      bottom: 10,
      width: '100%',
      alignItems: 'center',
      zIndex: 1000,
    },
    copyrightText: {
      fontSize: 12,
      color: 'gray',
    },
    topInfoContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        paddingHorizontal: 20,
        position: 'absolute',
        top: 140,
      },
      progressBarContainer: {
        width: '45%',
        height: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        overflow: 'hidden',
      },
      progressBar: {
        height: '100%',
        backgroundColor: 'green', // Bu rengi ileride değiştirebilirsiniz
        width: '0%', // Şimdilik 0%, ileride dinamik olarak ayarlanacak
      },
      multiplierContainer: {
        position: 'absolute',
        top: height * 0.25, // Progress bar'ın altına yerleştirmek için üstten mesafe ayarlandı
        alignSelf: 'center',
        backgroundColor: 'red',
        borderRadius: 25,
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
      },
      multiplierText: {
        color: 'white',
        fontSize: 24,
        fontWeight: 'bold',
      }
  });