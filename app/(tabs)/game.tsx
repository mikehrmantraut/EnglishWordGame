import React, { useState, useEffect, useCallback, useRef} from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Modal} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import Svg, { Path } from 'react-native-svg';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { game_styles } from '../../styles/gameStyles';
import { pre_a1_starters_word_map, a1_movers_word_map, gameSettings } from '../../data/languageData';
const QUESTION_TIME = gameSettings.defaultQuestionTime; // 5 seconds for each question


interface Option {
    word: string;
    isCorrect: boolean;
  }

const GamePage: React.FC = () => {
    const router = useRouter();
    const [timeLeft, setTimeLeft] = useState(QUESTION_TIME);
    const [currentWord, setCurrentWord] = useState('');
    const [options, setOptions] = useState<Option[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [score, setScore] = useState(0);
    const [lives, setLives] = useState(3);
    const [isGameOver, setIsGameOver] = useState(false);
    const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);
    const [highScore, setHighScore] = useState(0);
    const [progressWidth, setProgressWidth] = useState(0);
    const [progressColor, setProgressColor] = useState('green');
    const [multiplier, setMultiplier] = useState(1);
    const [showMultiplier, setShowMultiplier] = useState(false);
    const [questionCount, setQuestionCount] = useState(0);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const [scoreIncrement, setScoreIncrement] = useState<number | null>(null);
    const [isPaused, setIsPaused] = useState(false);
    const [showBravoMessage, setShowBravoMessage] = useState(false);
    const [isBravoShown, setIsBravoShown] = useState(false);

    const handleGoBack = () => {
      router.back();
    };

    const handlePauseGame = () => {
      setIsPaused(true);
      if (timerRef.current) clearInterval(timerRef.current);
  };
    const handleContinueGame = () => {
    setIsPaused(false);
    startTimer(); // Restart the timer
  };
  const handleContinueAfterBravo = () => {
    setShowBravoMessage(false); // Mesajı kapat
    startTimer(); // Timer'ı yeniden başlat
    setTimeLeft(QUESTION_TIME);
  };
  const handleGoToMainMenu = () => {
    setIsGameOver(false);
    setIsPaused(false);
    if (timerRef.current) clearInterval(timerRef.current);
    router.replace('/'); // Navigate to the main menu
  };
    const resetProgressAndMultiplier = () => {
      setMultiplier(1);
      setShowMultiplier(false);
      setProgressWidth(0);
      setProgressColor('green');
      setQuestionCount(0);
    };
    const getHighScore = async () => {
      try {
        const value = await AsyncStorage.getItem('highScore');
        if (value !== null) {
          setHighScore(parseInt(value));
        }
      } catch (error) {
        console.error('Error reading high score:', error);
      }
    };
    const updateHighScore = async (newScore: number) => {
      if (newScore > highScore) {
        setHighScore(newScore);
        try {
          await AsyncStorage.setItem('highScore', newScore.toString());
        } catch (error) {
          console.error('Error saving high score:', error);
        }
      }
    };

    const HeartIcon: React.FC<{ filled: boolean }> = ({ filled }) => (
      <Svg height="24" width="24" viewBox="0 0 24 24">
        <Path
          d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
          fill={filled ? "red" : "white"}
          stroke="black"
          strokeWidth="1"
        />
      </Svg>
    );
  
    const getRandomWord = () => {
      const currentMap = score >= 5000 ? a1_movers_word_map : pre_a1_starters_word_map;
      const words = Object.keys(currentMap);
      return words[Math.floor(Math.random() * words.length)];
    };
  
    const generateOptions = async (correctWord: string) => {
      const currentMap = score >= 5000 ? a1_movers_word_map : pre_a1_starters_word_map;
      const correctTranslation = currentMap[correctWord];
      const otherWords = Object.values(currentMap).filter(word => word !== correctTranslation);
      const randomWords = [];
      for (let i = 0; i < 3; i++) {
        const randomIndex = Math.floor(Math.random() * otherWords.length);
        randomWords.push(otherWords.splice(randomIndex, 1)[0]);
      }
      
      const allOptions = [
        { word: correctTranslation, isCorrect: true },
        ...randomWords.map((word: string) => ({ word, isCorrect: false }))
      ];
    
      return allOptions.sort(() => Math.random() - 0.5);
    };
    const endGame = () => {
      setIsGameOver(true);
      if (timer) clearInterval(timer);
      updateHighScore(score);
    };
    const startTimer = useCallback(() => {
      if (timerRef.current) clearInterval(timerRef.current); // Önceki timer'ı temizle
      timerRef.current = setInterval(() => {
          setTimeLeft((prevTime) => {
              if (prevTime <= 1) {
                  if (timerRef.current) clearInterval(timerRef.current);
                  handleTimerExpired();
                  return 0;
              }
              return prevTime - 1;
          });
      }, 1000);
  }, []);
  const fetchNextQuestion = useCallback(async () => {
    const newWord = getRandomWord();
    setCurrentWord(newWord);
    const newOptions = await generateOptions(newWord);
    setOptions(newOptions);
    if (progressWidth >= 100) {
        setProgressWidth(0); // Yeni soru geldiğinde barı sıfırla
    }
    if (!isPaused) { // Sadece oyun duraklatılmadıysa timer'ı başlat
        startTimer();
    }
}, [startTimer, progressWidth, isPaused]);const handleTimerExpired = useCallback(() => {
  if (timerRef.current) clearInterval(timerRef.current);
  setLives(prevLives => {
    const newLives = prevLives - 1;
    if (newLives <= 0) {
      endGame();
      return 0;
    } else {
      resetProgressAndMultiplier();
      setTimeLeft(QUESTION_TIME);
      fetchNextQuestion(); // Yeni soruyu getir
      return newLives;
    }
  });
}, [fetchNextQuestion, endGame]);
    useEffect(() => {
      if (timeLeft > 0 && !isPaused) { // Süre duraklatılmadıysa timer'ı başlat
          timerRef.current = setInterval(() => {
              setTimeLeft((prevTime) => {
                  if (prevTime <= 1) {
                      if (timerRef.current) clearInterval(timerRef.current);
                      handleTimerExpired();
                      return 0;
                  }
                  return prevTime - 1;
              });
          }, 1000);
      }
  
      return () => {
          if (timerRef.current) clearInterval(timerRef.current);
      };
  }, [timeLeft, handleTimerExpired, isPaused]);

    const updateProgress = () => {
      setProgressWidth(prevWidth => {
        const newWidth = prevWidth + 20;
        if (newWidth <= 20) setProgressColor('#9FE2BF');
        else if (newWidth <= 40) setProgressColor('#FFD700');
        else if (newWidth <= 60) setProgressColor('orange');
        else if (newWidth <= 80) setProgressColor('red');
        else setProgressColor('#C71585');
  
        if (newWidth >= 100 && questionCount >= 5) {
          setMultiplier(prevMultiplier => prevMultiplier + 1);
          setShowMultiplier(true);
        return 0;
      }
        return newWidth;
      });
    };


    const handleOptionSelect = useCallback(async (selectedOption: Option) => {
      if (timerRef.current) clearInterval(timerRef.current); // Timer'ı durdur
      if (selectedOption.isCorrect) {
        const points = gameSettings.pointsPerCorrectAnswer * multiplier;
        const newScore = score + points; // Skoru hesapla
    
        setScore(newScore); 
        setScoreIncrement(points); 
        setQuestionCount((prevCount) => prevCount + 1);
        updateProgress();
    
        if (newScore >= 200 && !isBravoShown) {
          setShowBravoMessage(true); // Bravo mesajını göster
          setIsBravoShown(true);
          if (timerRef.current) clearInterval(timerRef.current);
          return; // Yeni soru getirmeden çık
        }
        setTimeLeft(QUESTION_TIME); 
        await fetchNextQuestion();
    
        setTimeout(() => {
          setScoreIncrement(null);
        }, 1000);
      } else {
        setLives((prevLives) => {
          const newLives = prevLives - 1;
          if (newLives <= 0) {
            endGame();
            return 0;
          } else {
            fetchNextQuestion();
            resetProgressAndMultiplier(); 
            return newLives;
          }
        });
      }
    }, [fetchNextQuestion, multiplier, score, showBravoMessage]);
    
    useEffect(() => {
      return () => {
        if (timer) clearInterval(timer);
      };
    }, [timer]);

    const initializeGame = useCallback(() => {
      setLives(3);
      setScore(0);
      setIsGameOver(false);
      setIsBravoShown(false);
      setTimeLeft(QUESTION_TIME);
      resetProgressAndMultiplier(); // Use the new function here
      if (timer) clearInterval(timer);
      fetchNextQuestion();
    }, []);;

    const resetGame = () => {
      setIsGameOver(false);
      initializeGame();
    };
    
    useEffect(() => {
      getHighScore();
      initializeGame();
      return () => {
        if (timer) clearInterval(timer);
      };
    }, [initializeGame]);

    useEffect(() => {
      if (lives === 0) {
        endGame();
      }
    }, [lives]);

    useFocusEffect(
      useCallback(() => {
        initializeGame();
      }, [initializeGame])
    );
    if (isLoading) {
      return (
        <View style={game_styles.container}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text>Kelimeler yükleniyor...</Text>
        </View>
      );
    }
  
    return (
      <View style={game_styles.container}>
        <TouchableOpacity style={game_styles.pauseButton} onPress={handlePauseGame}>
          <MaterialIcons name="pause" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity style={game_styles.backButton} onPress={handleGoBack}>
          <Ionicons name="arrow-back" size={24} color="black" />
          <Text style={game_styles.backButtonText}>Menüye Dön</Text>
        </TouchableOpacity>
        <View style={game_styles.highScoreContainer}>
          <Text style={game_styles.highScoreText}>En Yüksek Skor: {highScore}</Text>
        </View>
        <View style={game_styles.topInfoContainer}>
          <Text style={game_styles.infoText}>Skor: {score}</Text>
          {scoreIncrement !== null && (<Text style={game_styles.scoreIncrementText}>+{scoreIncrement}</Text>)}
          <View style={game_styles.progressBarContainer}>
            <View style={[
              game_styles.progressBar, 
              { width: `${progressWidth}%`, backgroundColor: progressColor }
            ]} />
          </View>
          <Text style={game_styles.infoText}>Süre: {timeLeft}</Text>
        </View>
        <View style={game_styles.livesContainer}>
          {[...Array(3)].map((_, index) => (
            <View key={index} style={game_styles.heartContainer}>
              <HeartIcon filled={index < lives} />
            </View>
          ))}
        </View>
        <Text style={game_styles.word}>{currentWord}</Text>
        <View style={game_styles.optionsContainer}>
          <View style={game_styles.optionsRow}>
            <TouchableOpacity style={game_styles.optionButton} onPress={() => handleOptionSelect(options[0])}>
              <Text style={game_styles.optionText}>{options[0]?.word || 'Seçenek 1'}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={game_styles.optionButton} onPress={() => handleOptionSelect(options[1])}>
              <Text style={game_styles.optionText}>{options[1]?.word || 'Seçenek 2'}</Text>
            </TouchableOpacity>
          </View>
          <View style={game_styles.optionsRow}>
            <TouchableOpacity style={game_styles.optionButton} onPress={() => handleOptionSelect(options[2])}>
              <Text style={game_styles.optionText}>{options[2]?.word || 'Seçenek 3'}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={game_styles.optionButton} onPress={() => handleOptionSelect(options[3])}>
              <Text style={game_styles.optionText}>{options[3]?.word || 'Seçenek 4'}</Text>
            </TouchableOpacity>
          </View>
        </View>
        <Modal
          visible={isGameOver}
          transparent={true}
          animationType="fade"
        >
          <View style={game_styles.modalContainer}>
            <View style={game_styles.modalContent}>
              <Text style={game_styles.modalTitle}>Oyun Bitti!</Text>
              <Text style={game_styles.modalScore}>Skorunuz: {score}</Text>
              <TouchableOpacity style={game_styles.modalButton} onPress={resetGame}>
                <Text style={game_styles.modalButtonText}>Yeniden Başla</Text>
              </TouchableOpacity>
              <TouchableOpacity style={game_styles.modalButton} onPress={handleGoToMainMenu}>
                <Text style={game_styles.modalButtonText}>Ana Menüye Dön</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        <Modal visible={showBravoMessage} transparent={true} animationType="fade">
          <View style={game_styles.modalContainer}>
            <View style={game_styles.modalContent}>
              <Text style={game_styles.modalTitle}>BRAVO!</Text>
              <Text style={game_styles.modalText}>
                Kolay geldi galiba :) Yeni kelimelere hazırlan!
              </Text>
              <TouchableOpacity style={game_styles.modalButton} onPress={handleContinueAfterBravo}>
                <Text style={game_styles.modalButtonText}>Devam Et</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        <Modal visible={isPaused} transparent={true} animationType="fade">
          <View style={game_styles.modalContainer}>
            <View style={game_styles.modalContent}>
              <Text style={game_styles.modalTitle}>Oyun Duraklatıldı!</Text>
              <TouchableOpacity style={game_styles.modalButton} onPress={handleContinueGame}>
                <Text style={game_styles.modalButtonText}>Devam Et</Text>
              </TouchableOpacity>
              <TouchableOpacity style={game_styles.modalButton} onPress={handleGoToMainMenu}>
                <Text style={game_styles.modalButtonText}>Ana Menüye Dön</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        {showMultiplier && (
          <View style={game_styles.multiplierContainer}>
            <Text style={game_styles.multiplierText}>{multiplier}x</Text>
          </View>
        )}
      </View>
    );
  };

export default GamePage;
