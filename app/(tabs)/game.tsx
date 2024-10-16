import React, { useState, useEffect, useCallback, useRef} from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Modal} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Path } from 'react-native-svg';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { game_styles } from '../../styles/gameStyles';
import { pre_a1_starters_word_map, gameSettings } from '../../data/languageData';
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
    const handleGoBack = () => {
      router.back();
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
    const handleGoToMainMenu = () => {
      setIsGameOver(false); // Modal'ı kapat
      if (timer) clearInterval(timer);
      router.replace('/');  // Ana menü sayfasının yolunu buraya yazın
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
      const words = Object.keys(pre_a1_starters_word_map);
      return words[Math.floor(Math.random() * words.length)];
    };
  
    const generateOptions = async (correctWord: string) => {
      const correctTranslation = pre_a1_starters_word_map[correctWord];
      const otherWords = Object.values(pre_a1_starters_word_map).filter(word => word !== correctTranslation);
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
      if (timerRef.current) clearInterval(timerRef.current);
      setTimeLeft(QUESTION_TIME);
    }, []);
    const fetchNextQuestion = useCallback(async () => {
      if (timer) clearInterval(timer);
      const newWord = getRandomWord();
      setCurrentWord(newWord);
      const newOptions = await generateOptions(newWord);
      setOptions(newOptions);
      if (progressWidth >= 100) {
        setProgressWidth(0); // Yeni soru geldiğinde barı sıfırla
      }
      startTimer();
    }, [timer, startTimer, progressWidth]);
    const handleTimerExpired = useCallback(() => {
      if (timerRef.current) clearInterval(timerRef.current);
      setLives(prevLives => {
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
    }, [fetchNextQuestion, endGame]);
    useEffect(() => {
      if (timeLeft > 0) {
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
    }, [timeLeft, handleTimerExpired]);

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
      if (timer) clearInterval(timer);
      if (selectedOption.isCorrect) {
        const points = gameSettings.pointsPerCorrectAnswer * multiplier;
        setScore(prevScore => prevScore + points);
        setScoreIncrement(points); // Set the score increment to display
        setQuestionCount(prevCount => prevCount + 1);
        updateProgress();
        await fetchNextQuestion();
        setTimeout(() => {
          setScoreIncrement(null);
        }, 1000);
      } else {
        setLives(prevLives => {
          const newLives = prevLives - 1;
          if (newLives <= 0) {
            endGame();
            return 0;
          } else {
            fetchNextQuestion();
            resetProgressAndMultiplier(); // Reset progress and multiplier on wrong answer
            return newLives;
          }
        });
      }
    }, [timer, fetchNextQuestion, multiplier]);
    
    useEffect(() => {
      return () => {
        if (timer) clearInterval(timer);
      };
    }, [timer]);

    const initializeGame = useCallback(() => {
      setLives(3);
      setScore(0);
      setIsGameOver(false);
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
        <View style={game_styles.copyrightContainer}>
          <Text style={game_styles.copyrightText}>
            © {new Date().getFullYear()} Tüm hakları MBM'ye aittir.
          </Text>
        </View>
        <TouchableOpacity style={game_styles.backButton} onPress={handleGoBack}>
          <Ionicons name="arrow-back" size={24} color="black" />
          <Text style={game_styles.backButtonText}>Menüye Dön</Text>
        </TouchableOpacity>
        <View style={game_styles.highScoreContainer}>
          <Text style={game_styles.highScoreText}>En Yüksek Skor: {highScore}</Text>
        </View>
        <View style={game_styles.topInfoContainer}>
          <Text style={game_styles.infoText}>Skor: {score}</Text>
          {scoreIncrement !== null && (<Text style = {game_styles.scoreIncrementText}>+{scoreIncrement}</Text>)}
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
        {showMultiplier && (
          <View style={game_styles.multiplierContainer}>
            <Text style={game_styles.multiplierText}>{multiplier}x</Text>
          </View>
        )}
      </View>
    );
  };

export default GamePage;