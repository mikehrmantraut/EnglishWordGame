import React, { useState, useEffect} from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Path } from 'react-native-svg';

const QUESTION_TIME = 5; // 5 seconds for each question
const pre_a1_starters_word_map: { [key: string]: string } = {
  'a': 'bir',
  'about': 'hakkında',
  'add': 'eklemek',
  'afternoon': 'öğleden sonra',
  'again': 'tekrar',
  'alien': 'uzaylı',
  'alphabet': 'alfabe',
  'an': 'bir (ünlü harften önce)',
  'and': 've',
  'angry': 'kızgın',
  'animal': 'hayvan',
  'answer': 'cevap',
  'apartment': 'daire',
  'apple': 'elma',
  'arm': 'kol',
  'armchair': 'koltuk',
  'ask': 'sormak',
  'at': 'de, da',
  'baby': 'bebek',
  'badminton': 'badminton',
  'bag': 'çanta',
  'ball': 'top',
  'balloon': 'balon',
  'banana': 'muz',
  'baseball': 'beyzbol',
  'baseball cap': 'beyzbol şapkası',
  'basketball': 'basketbol',
  'bat': 'yarasa',
  'bath': 'banyo',
  'bathroom': 'banyo',
  'be': 'olmak',
  'beach': 'plaj',
  'bean': 'fasulye',
  'bear': 'ayı',
  'beautiful': 'güzel',
  'bed': 'yatak',
  'bedroom': 'yatak odası',
  'bee': 'arı',
  'behind': 'arkasında',
  'between': 'arasında',
  'big': 'büyük',
  'bike': 'bisiklet',
  'bird': 'kuş',
  'birthday': 'doğum günü',
  'black': 'siyah',
  'blue': 'mavi',
  'board': 'tahta',
  'board game': 'masa oyunu',
  'boat': 'gemi',
  'body': 'vücut',
  'book': 'kitap',
  'bookcase': 'kitaplık',
  'bookshop': 'kitapçı',
  'boots': 'botlar',
  'bounce': 'sekmek',
  'box': 'kutu',
  'boy': 'erkek çocuk',
  'bread': 'ekmek',
  'breakfast': 'kahvaltı',
  'brother': 'erkek kardeş',
  'brown': 'kahverengi',
  'burger': 'hamburger',
  'bus': 'otobüs',
  'but': 'ama',
  'bye': 'hoşça kal',
  'cake': 'pasta',
  'camera': 'kamera',
  'can': 'yapabilmek',
  'candy': 'şeker',
  'car': 'araba',
  'carrot': 'havuç',
  'cat': 'kedi',
  'catch': 'yakalamak',
  'chair': 'sandalye',
  'chicken': 'tavuk',
  'child': 'çocuk',
  'children': 'çocuklar',
  'chips': 'patates kızartması',
  'chocolate': 'çikolata',
  'choose': 'seçmek',
  'clap': 'alkışlamak',
  'class': 'sınıf',
  'classmate': 'sınıf arkadaşı',
  'classroom': 'derslik',
  'clean': 'temiz',
  'clock': 'saat',
  'close': 'kapamak',
  'closed': 'kapalı',
  'clothes': 'kıyafetler',
  'coconut': 'hindistancevizi',
  'colour': 'renk',
  'come': 'gelmek',
  'complete': 'tamamlamak',
  'computer': 'bilgisayar',
  'cool': 'serin',
  'correct': 'doğru',
  'count': 'saymak',
  'cousin': 'kuzen',
  'cow': 'inek',
  'crayon': 'boya kalemi',
  'crocodile': 'timsah',
  'cross': 'çapraz',
  'cupboard': 'dolap',
  'dad': 'baba',
  'day': 'gün',
  'desk': 'masa',
  'dining room': 'yemek odası',
  'dinner': 'akşam yemeği',
  'dirty': 'kirli',
  'do': 'yapmak',
  'dog': 'köpek',
  'doll': 'bebek',
  'donkey': 'eşek',
  'don\'t worry': 'endişelenme',
  'door': 'kapı',
  'double': 'çift',
  'draw': 'çizmek',
  'drawing': 'çizim',
  'dress': 'elbise',
  'drink': 'içmek',
  'drive': 'sürmek',
  'duck': 'ördek',
  'ear': 'kulak',
  'eat': 'yemek',
  'egg': 'yumurta',
  'elephant': 'fil',
  'end': 'son',
  'enjoy': 'keyif almak',
  'eraser': 'silgi',
  'evening': 'akşam',
  'example': 'örnek',
  'eye': 'göz',
  'face': 'yüz',
  'family': 'aile',
  'fantastic': 'harika',
  'father': 'baba',
  'favourite': 'favori',
  'find': 'bulmak',
  'fish': 'balık',
  'fishing': 'balık tutma',
  'flat': 'düz',
  'floor': 'zemin',
  'flower': 'çiçek',
  'fly': 'uçmak',
  'food': 'yemek',
  'foot': 'ayak',
  'feet': 'ayaklar',
  'football': 'futbol',
  'for': 'için',
  'friend': 'arkadaş',
  'fries': 'patates kızartması',
  'frog': 'kurbağa',
  'from': '-den, -dan',
  'fruit': 'meyve',
  'fun': 'eğlence',
  'funny': 'komik',
  'game': 'oyun',
  'garden': 'bahçe',
  'get': 'almak',
  'giraffe': 'zürafa',
  'girl': 'kız',
  'give': 'vermek',
  'glasses': 'gözlük',
  'go': 'gitmek',
  'go to bed': 'yatağa gitmek',
  'go to sleep': 'uyumak',
  'goat': 'keçi',
  'good': 'iyi',
  'goodbye': 'hoşça kal',
  'grandfather': 'dede',
  'grandma': 'büyükanne',
  'grandmother': 'büyükanne',
  'grandpa': 'büyükbaba',
  'grape': 'üzüm',
  'gray': 'gri',
  'great': 'harika',
  'green': 'yeşil',
  'grey': 'gri',
  'guitar': 'gitar',
  'hair': 'saç',
  'hall': 'koridor',
  'hand': 'el',
  'handbag': 'çanta',
  'happy': 'mutlu',
  'hat': 'şapka',
  'have': 'sahip olmak',
  'have got': 'var',
  'he': 'o (erkek)',
  'head': 'baş',
  'helicopter': 'helikopter',
  'hello': 'merhaba',
  'her': 'onun (kadın)',
  'here': 'burada',
  'hers': 'onunki (kadın)',
  'hi': 'selam',
  'him': 'onu (erkek)',
  'hippo': 'su aygırı',
  'his': 'onun (erkek)',
  'hit': 'vurmak',
  'hobby': 'hobi',
  'hockey': 'hokey',
  'hold': 'tutmak',
  'home': 'ev',
  'hooray': 'yaşasın',
  'horse': 'at',
  'house': 'ev',
  'how': 'nasıl',
  'how many': 'kaç tane',
  'how old': 'kaç yaşında',
  'I': 'ben',
  'ice cream': 'dondurma',
  'in': 'içinde',
  'in front of': 'önünde',
  'it': 'o (cansız)',
  'its': 'onun (cansız)',
  'jacket': 'ceket',
  'jeans': 'kot pantolon',
  'jellyfish': 'denizanası',
  'juice': 'meyve suyu',
  'jump': 'zıplamak',
  'keyboard': 'klavye',
  'kick': 'tekme atmak',
  'kid': 'çocuk',
  'kitchen': 'mutfak',
  'kite': 'uçurtma',
  'kiwi': 'kivi',
  'know': 'bilmek',
  'lamp': 'lamba',
  'learn': 'öğrenmek',
  'leg': 'bacak',
  'lemon': 'limon',
  'lemonade': 'limonata',
  'lesson': 'ders',
  'let\'s': 'hadi',
  'letter': 'harf',
  'like': 'sevmek',
  'lime': 'yeşil limon',
  'line': 'çizgi',
  'listen': 'dinlemek',
  'live': 'yaşamak',
  'living room': 'oturma odası',
  'lizard': 'kertenkele',
  'long': 'uzun',
  'look': 'bakmak',
  'look at': 'bakmak',
  'lorry': 'kamyon',
  'a lot': 'çok',
  'lots': 'birçok',
  'lots of': 'birçok',
  'love': 'sevmek',
  'lunch': 'öğle yemeği',
  'make': 'yapmak',
  'man': 'adam',
  'men': 'erkekler',
  'mango': 'mango',
  'many': 'birçok',
  'Mark': 'Mark (isim)',
  'mat': 'paspas',
  'May': 'Mayıs',
  'me': 'beni, bana',
  'me too': 'ben de',
  'meat': 'et',
  'meatballs': 'köfte',
  'milk': 'süt',
  'mine': 'benimki',
  'mirror': 'ayna',
  'Miss': 'Bayan',
  'monkey': 'maymun',
  'monster': 'canavar',
  'morning': 'sabah',
  'mother': 'anne',
  'motorbike': 'motosiklet',
  'mouse': 'fare',
  'mice': 'fareler',
  'mouth': 'ağız',
  'Mr': 'Bay',
  'Mrs': 'Bayan',
  'mum': 'anne',
  'music': 'müzik',
  'my': 'benim',
  'name': 'isim',
  'new': 'yeni',
  'next to': 'yanında',
  'nice': 'güzel',
  'night': 'gece',
  'no': 'hayır',
  'nose': 'burun',
  'not': 'değil',
  'now': 'şimdi',
  'number': 'numara',
  'oh dear': 'vah vah',
  'OK': 'tamam',
  'old': 'eski',
  'on': 'üzerinde',
  'one': 'bir',
  'onion': 'soğan',
  'open': 'açık',
  'or': 'veya',
  'orange': 'portakal',
  'our': 'bizim',
  'ours': 'bizimki',
  'page': 'sayfa',
  'paint': 'boya',
  'painting': 'resim',
  'pardon': 'affedersiniz',
  'park': 'park',
  'part': 'parça',
  'Pat': 'Pat (isim)',
  'pea': 'bezelye',
  'pear': 'armut',
  'pen': 'kalem',
  'pencil': 'kurşun kalem',
  'person': 'kişi',
  'people': 'insanlar',
  'pet': 'evcil hayvan',
  'phone': 'telefon',
  'photo': 'fotoğraf',
  'piano': 'piyano',
  'pick up': 'almak',
  'picture': 'resim',
  'pie': 'turta',
  'pineapple': 'ananas',
  'pink': 'pembe',
  'plane': 'uçak',
  'playground': 'oyun alanı',
  'please': 'lütfen',
  'point': 'işaret etmek',
  'polar bear': 'kutup ayısı',
  'poster': 'afiş',
  'potato': 'patates',
  'purple': 'mor',
  'put': 'koymak',
  'question': 'soru',
  'radio': 'radyo',
  'read': 'okumak',
  'really': 'gerçekten',
  'red': 'kırmızı',
  'rice': 'pirinç',
  'ride': 'binmek',
  'right': 'sağ',
  'robot': 'robot',
  'room': 'oda',
  'rubber': 'silgi',
  'rug': 'halı',
  'ruler': 'cetvel',
  'sad': 'üzgün',
  'Sam': 'Sam (isim)',
  'sand': 'kum',
  'sausage': 'sosis',
  'say': 'söylemek',
  'scary': 'korkutucu',
  'school': 'okul',
  'sea': 'deniz',
  'see': 'görmek',
  'see you': 'görüşürüz',
  'sentence': 'cümle',
  'she': 'o (kadın)',
  'sheep': 'koyun',
  'shell': 'kabuk',
  'ship': 'gemi',
  'shirt': 'gömlek',
  'shoe': 'ayakkabı',
  'shop': 'dükkan',
  'short': 'kısa',
  'shorts': 'şort',
  'show': 'göstermek',
  'silly': 'aptalca',
  'sing': 'şarkı söylemek',
  'sister': 'kız kardeş',
  'sit': 'oturmak',
  'skateboard': 'kaykay',
  'skateboarding': 'kaykay yapma',
  'skirt': 'etek',
  'sleep': 'uyumak',
  'small': 'küçük',
  'smile': 'gülümsemek',
  'snake': 'yılan',
  'so': 'bu yüzden',
  'soccer': 'futbol',
  'sock': 'çorap',
  'sofa': 'kanepe',
  'some': 'bazı',
  'song': 'şarkı',
  'sorry': 'üzgün',
  'spell': 'hecelemek',
  'spider': 'örümcek',
  'sport': 'spor',
  'stand': 'durmak',
  'start': 'başlamak',
  'stop': 'durmak',
  'store': 'dükkan',
  'story': 'hikaye',
  'street': 'sokak',
  'sun': 'güneş',
  'sweet': 'şeker',
  'swim': 'yüzmek',
  'table': 'masa',
  'table tennis': 'masa tenisi',
  'tablet': 'tablet',
  'tail': 'kuyruk',
  'take a photo': 'fotoğraf çekmek',
  'take a picture': 'resim çekmek',
  'talk': 'konuşmak',
  'teacher': 'öğretmen',
  'teddy bear': 'oyuncak ayı',
  'television': 'televizyon',
  'TV': 'TV',
  'tell': 'söylemek',
  'tennis': 'tenis',
  'tennis racket': 'tenis raketi',
  'thank you': 'teşekkür ederim',
  'thanks': 'teşekkürler',
  'that': 'şu',
  'the': 'belirli tanımlık',
  'their': 'onların',
  'theirs': 'onlarınki',
  'them': 'onlara',
  'then': 'sonra',
  'there': 'orada',
  'these': 'bunlar',
  'they': 'onlar',
  'thing': 'şey',
  'this': 'bu',
  'those': 'şunlar',
  'throw': 'atmak',
  'tick': 'işaretlemek',
  'tiger': 'kaplan',
  'to': '-e, -a',
  'today': 'bugün',
  'tomato': 'domates',
  'too': 'çok',
  'toy': 'oyuncak',
  'train': 'tren',
  'tree': 'ağaç',
  'trousers': 'pantolon',
  'truck': 'kamyon',
  'try': 'denemek',
  'T-shirt': 'tişört',
  'ugly': 'çirkin',
  'under': 'altında',
  'understand': 'anlamak',
  'us': 'bize',
  'very': 'çok',
  'walk': 'yürümek',
  'wall': 'duvar',
  'want': 'istemek',
  'watch': 'izlemek',
  'water': 'su',
  'watermelon': 'karpuz',
  'wave': 'dalga, el sallamak',
  'we': 'biz',
  'wear': 'giymek',
  'well': 'iyi',
  'well done': 'aferin',
  'what': 'ne',
  'where': 'nerede',
  'which': 'hangi',
  'white': 'beyaz',
  'who': 'kim',
  'whose': 'kimin',
  'window': 'pencere',
  'with': 'ile',
  'woman': 'kadın',
  'women': 'kadınlar',
  'word': 'kelime',
  'would like': 'istemek',
  'wow': 'vay',
  'write': 'yazmak',
  'year': 'yıl',
  'yellow': 'sarı',
  'yes': 'evet',
  'you': 'sen, siz',
  'young': 'genç',
  'your': 'senin, sizin',
  'yours': 'seninki, sizinki',
  'zebra': 'zebra',
  'zoo': 'hayvanat bahçesi'
};

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
  
    const handleGoBack = () => {
      router.back();
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
  
    const startTimer = () => {
      if (timer) clearInterval(timer);
      setTimeLeft(QUESTION_TIME);
      const newTimer = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(newTimer);
            handleTimerExpired();
            return QUESTION_TIME;
          }
          return prevTime - 1;
        });
      }, 1000);
      setTimer(newTimer);
    };
  
    const handleTimerExpired = () => {
      setLives(prevLives => {
        const newLives = prevLives - 1;
        if (newLives === 0) {
          setIsGameOver(true);
        } else {
          fetchNextQuestion();
        }
        return newLives;
      });
    };
  
    const fetchNextQuestion = async () => {
      const newWord = getRandomWord();
      setCurrentWord(newWord);
      const newOptions = await generateOptions(newWord);
      setOptions(newOptions);
      startTimer();
    };
  
    const handleOptionSelect = async (selectedOption: Option) => {
      if (timer) clearInterval(timer);
      if (selectedOption.isCorrect) {
        setScore(prevScore => prevScore + 10);
        await fetchNextQuestion();
      } else {
        setLives(prevLives => {
          const newLives = prevLives - 1;
          if (newLives === 0) {
            setIsGameOver(true);
          } else {
            fetchNextQuestion();
          }
          return newLives;
        });
      }
    };
  
    const resetGame = () => {
      setLives(3);
      setScore(0);
      setIsGameOver(false);
      fetchNextQuestion();
    };
  
    useEffect(() => {
      fetchNextQuestion();
      return () => {
        if (timer) clearInterval(timer);
      };
    }, []);
  
    useEffect(() => {
      if (lives === 0) {
        setIsGameOver(true);
        if (timer) clearInterval(timer);
      }
    }, [lives]);
  
    if (isLoading) {
      return (
        <View style={styles.container}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text>Kelimeler yükleniyor...</Text>
        </View>
      );
    }
  
    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
          <Ionicons name="arrow-back" size={24} color="black" />
          <Text style={styles.backButtonText}>Menüye Dön</Text>
        </TouchableOpacity>
        <View style={styles.livesContainer}>
          {[...Array(3)].map((_, index) => (
            <View key={index} style={styles.heartContainer}>
              <HeartIcon filled={index < lives} />
            </View>
          ))}
        </View>
        <View style={styles.infoContainer}>
          <View style={styles.scoreContainer}>
            <Text style={styles.infoText}>Skor: {score}</Text>
          </View>
          <View style={styles.timerContainer}>
            <Text style={styles.infoText}>Süre: {timeLeft}</Text>
          </View>
        </View>
        <Text style={styles.word}>{currentWord}</Text>
        <View style={styles.optionsContainer}>
          <View style={styles.optionsRow}>
            <TouchableOpacity style={styles.optionButton} onPress={() => handleOptionSelect(options[0])}>
              <Text style={styles.optionText}>{options[0]?.word || 'Seçenek 1'}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.optionButton} onPress={() => handleOptionSelect(options[1])}>
              <Text style={styles.optionText}>{options[1]?.word || 'Seçenek 2'}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.optionsRow}>
            <TouchableOpacity style={styles.optionButton} onPress={() => handleOptionSelect(options[2])}>
              <Text style={styles.optionText}>{options[2]?.word || 'Seçenek 3'}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.optionButton} onPress={() => handleOptionSelect(options[3])}>
              <Text style={styles.optionText}>{options[3]?.word || 'Seçenek 4'}</Text>
            </TouchableOpacity>
          </View>
        </View>
        <Modal
          visible={isGameOver}
          transparent={true}
          animationType="fade"
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Oyun Bitti!</Text>
              <Text style={styles.modalScore}>Skorunuz: {score}</Text>
              <TouchableOpacity style={styles.modalButton} onPress={resetGame}>
                <Text style={styles.modalButtonText}>Yeniden Başla</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    );
  };

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'white',
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
      fontSize: 18,
      fontWeight: 'bold',
    },
    word: {
      fontSize: 36,
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: 50,
    },
    optionsContainer: {
      width: '100%',
      paddingHorizontal: 20,
    },
    optionsRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 10,
    },
    optionButton: {
      backgroundColor: 'yellow',
      padding: 15,
      borderRadius: 10,
      width: '48%',
      alignItems: 'center',
    },
    optionText: {
      fontSize: 18,
      fontWeight: 'bold',
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
    modalButton: {
      backgroundColor: 'yellow',
      padding: 10,
      borderRadius: 5,
    },
    modalButtonText: {
      fontSize: 16,
      fontWeight: 'bold',
    },
    heart: {
      marginHorizontal: 2,
      borderWidth: 1,
      borderColor: 'black',
      borderRadius: 12
    }
  });

export default GamePage;