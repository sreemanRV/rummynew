import React, { useState,useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions,TouchableOpacity,Image } from 'react-native';
import { PanGestureHandler, GestureHandlerRootView, State } from 'react-native-gesture-handler';
import Animated,{ useAnimatedStyle, withSpring, Easing, useSharedValue, withTiming } from 'react-native-reanimated';
import * as SecureStore from 'expo-secure-store';

// Get screen dimensions
const { width, height } = Dimensions.get('window');

const Card = ({ id, position, onMove }) => {
  const translationX = useSharedValue(position.x);
  const translationY = useSharedValue(position.y);

  // Animated style to move the card
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: withSpring(translationX.value, { damping: 20 }) },
        { translateY: withSpring(translationY.value, { damping: 20 }) },
      ],
    };
  });

  const onGestureEvent = (event) => {
    if (event.nativeEvent.state === State.ACTIVE) {
      translationX.value = event.nativeEvent.translationX + position.x;
      translationY.value = event.nativeEvent.translationY + position.y;
    } else if (event.nativeEvent.state === State.END) {
      onMove(id, translationX.value, translationY.value);
    }
  };

  return (
    <GestureHandlerRootView>
      <PanGestureHandler onGestureEvent={onGestureEvent} onHandlerStateChange={onGestureEvent}>
        <Animated.View style={[styles.card, animatedStyle]}>
          <Text style={styles.cardText}>Card {id}</Text>
        </Animated.View>
      </PanGestureHandler>
    </GestureHandlerRootView>
  );
};

const playerCards = {
  "67bee7e05ec84e42266ba920": {
      "Heart": [
          {
              "uuid": "0eb824a5-5a7e-482e-ae28-d9b98bba9c2a",
              "card": "5 of Heart"
          },
          {
              "uuid": "cdce82e1-ebb6-448a-951f-029ce522eacb",
              "card": "6 of Heart"
          }
      ],
      "Spade": [
          {
              "uuid": "be01dfb4-422a-4777-bbfd-7384f766038f",
              "card": "A of Spade"
          },
          {
              "uuid": "462dbfb2-b555-44c2-83ad-de93f4a01798",
              "card": "9 of Spade"
          },
          {
              "uuid": "3c3e4b72-905f-4116-bdd0-cb903eaebf6e",
              "card": "A of Spade"
          },
          {
              "uuid": "a8464a61-8ead-4f60-b008-c89af69e8bcd",
              "card": "Q of Spade"
          }
      ],
      "Unknown": [
          {
              "uuid": "55da5217-3dec-4a09-bef0-be412ec0ce78",
              "card": "7 of Heart of Joker"
          }
      ],
      "Club": [
          {
              "uuid": "075a5499-cd85-4ef2-b7e6-cc59513be7a7",
              "card": "2 of Club"
          }
      ],
      "Diamond": [
          {
              "uuid": "53d3fcda-eb74-4d6d-b657-681477c316a2",
              "card": "5 of Diamond"
          },
          {
              "uuid": "9f3b120e-afbf-4331-a66e-abaa0c1f597f",
              "card": "A of Diamond"
          },
          {
              "uuid": "d4cb87f9-e7da-469c-897a-28f3a46b898b",
              "card": "6 of Diamond"
          },
          {
              "uuid": "80e46638-38da-4462-89c5-cc01d822cfc2",
              "card": "3 of Diamond"
          },
          {
              "uuid": "95d1c9ef-6c97-46f8-9311-40eb56cef734",
              "card": "9 of Diamond"
          }
      ]
  },
  "67c0397434b09c79df452231": {
      "Heart": [
          {
              "uuid": "cc31d3bc-1be9-4804-922f-42b6da80ecfa",
              "card": "Q of Heart"
          },
          {
              "uuid": "65496afb-512a-46a7-9aee-843f494e4f27",
              "card": "6 of Heart"
          }
      ],
      "Spade": [
          {
              "uuid": "633dc31c-e099-42b3-9b97-c8aea3cdfa4e",
              "card": "Q of Spade"
          },
          {
              "uuid": "9f2fe1fd-1630-457f-b722-f69f8babec95",
              "card": "J of Spade"
          }
      ],
      "Unknown": [
          {
              "uuid": "795e87ed-a12c-4c50-8b6e-7f78577220c4",
              "card": "Joker"
          },
          {
              "uuid": "1a81cd5a-1389-4abf-86c3-4ac61298ec5c",
              "card": "7 of Spade of Joker"
          },
          {
              "uuid": "cd44364e-2202-4c44-a9d9-642d9dbad18b",
              "card": "7 of Heart of Joker"
          }
      ],
      "Club": [
          {
              "uuid": "7da89ebd-5ed6-4275-ab88-158cc3f967d4",
              "card": "4 of Club"
          },
          {
              "uuid": "5fcf9d20-c574-495e-8e5b-85ac06fe5a7e",
              "card": "3 of Club"
          },
          {
              "uuid": "c65f1232-8be8-490f-ad31-1a5f5cfca398",
              "card": "5 of Club"
          },
          {
              "uuid": "b03b7042-2f32-4a6e-ba99-90a8941cac85",
              "card": "2 of Club"
          },
          {
              "uuid": "8949d204-0ea0-4876-87ae-ef2cc8f491e4",
              "card": "10 of Club"
          }
      ],
      "Diamond": [
          {
              "uuid": "90bd6566-27ec-4c7c-b17c-4f2c896b2631",
              "card": "10 of Diamond"
          }
      ]
  }
}


const Drag = () => {
  const playerId = SecureStore.getItemAsync('playerId');
  const [playerCard,setplayerCard] = useState();


  const suitImages = {
    Heart: require('./assets/heart.jpg'),
    Spade: require('./assets/spade.jpg'),
    Diamond: require('./assets/diamond.jpg'),
    Club: require('./assets/club.jpg'),
    Unknown: require('./assets/club.jpg'),
  };

  useEffect(() => {
    const fetchPlayerId = async () => {
      const playerId = await SecureStore.getItemAsync('playerId');
      if (playerCards[playerId]) {
        setplayerCard(playerCards[playerId]);
      }
    };

    fetchPlayerId();
  }, []);

  useEffect(() => {
    if (playerCard) {
      setPlayerCardPositions(
        Object.keys(playerCard).reduce((acc, suit) => {
          acc[suit] = playerCard[suit].map((_, index) => ({
            x: index * 60,
            y: 0,
          }));
          return acc;
        }, {})
      );
    }
  }, [playerCard]);
  

  useEffect(() => {
    if (playerCard) {
      console.log(playerCard);
    }
  }, [playerCard]);

  const [cards, setCards] = useState([
    { id: 1, x: 0, y: 0 },
    { id: 2, x: 1, y: 1 },
    { id: 3, x:2, y: 2 },
    { id: 4, x: 3, y: 3 },
  ]);

  const onMove = (id, newX, newY) => {
    setCards((prevCards) =>
      prevCards.map((card) =>
        card.id === id
          ? { ...card, x: newX, y: newY }
          : card
      )
    );
  };

  const parseCard = (card) => {
    const [rank, suit] = card.split(" of ");
    return { rank, suit };
  };
  const [playerCardPositions, setPlayerCardPositions] = useState(
    Object.keys(playerCard || {}).reduce((acc, suit) => {
      acc[suit] = playerCard[suit].map((_, index) => ({
        x: index * 60, // Initial offset for player cards
        y: 0,
      }));
      return acc;
    }, {})
  );

  const onPlayerCardMove = (suit, index, newX, newY) => {
    setPlayerCardPositions((prevPositions) => {
      const newPositions = { ...prevPositions };
      newPositions[suit][index] = { x: newX, y: newY };
      return newPositions;
    });
  };


  const Card = ({ id, position, onMove }) => {
    const translationX = useSharedValue(position.x);
    const translationY = useSharedValue(position.y);

    const animatedStyle = useAnimatedStyle(() => {
      return {
        transform: [
          { translateX: withSpring(translationX.value, { damping: 20 }) },
          { translateY: withSpring(translationY.value, { damping: 20 }) },
        ],
      };
    });

    const onGestureEvent = (event) => {
      if (event.nativeEvent.state === State.ACTIVE) {
        translationX.value = event.nativeEvent.translationX + position.x;
        translationY.value = event.nativeEvent.translationY + position.y;
      } else if (event.nativeEvent.state === State.END) {
        onMove(id, translationX.value, translationY.value);
      }
    };

    return (
      <GestureHandlerRootView>
        <PanGestureHandler onGestureEvent={onGestureEvent} onHandlerStateChange={onGestureEvent}>
          <Animated.View style={[styles.card, animatedStyle]}>
            <Text style={styles.cardText}>Card {id}</Text>
          </Animated.View>
        </PanGestureHandler>
      </GestureHandlerRootView>
    );
  };

  const PlayerCard = ({ suit, index, cardObject, position, onMove }) => {
    const { card: cardText } = cardObject;
    const { rank, suit: cardSuit } = parseCard(cardText) || {};
    const uuid = cardObject?.uuid;

    const translationX = useSharedValue(position.x);
    const translationY = useSharedValue(position.y);

    const animatedStyle = useAnimatedStyle(() => {
      return {
        transform: [
          { translateX: withSpring(translationX.value, { damping: 20 }) },
          { translateY: withSpring(translationY.value, { damping: 20 }) },
        ],
      };
    });

    const onGestureEvent = (event) => {
      if (event.nativeEvent.state === State.ACTIVE) {
        translationX.value = event.nativeEvent.translationX + position.x;
        translationY.value = event.nativeEvent.translationY + position.y;
      } else if (event.nativeEvent.state === State.END) {
        onMove(suit, index, translationX.value, translationY.value);
      }
    };

    return (
      <GestureHandlerRootView>
        <PanGestureHandler onGestureEvent={onGestureEvent} onHandlerStateChange={onGestureEvent}>
          <Animated.View style={[styles.card, animatedStyle]}>
            <Text style={styles.cardText}>{rank}</Text>
            <Image source={suitImages[cardSuit] || suitImages['Joker'] || suitImages['Unknown']} style={styles.cardImage} />
          </Animated.View>
        </PanGestureHandler>
      </GestureHandlerRootView>
    );
  };


  return (
    <View style={styles.container}>
      {cards.map((card) => (
        <Card key={card.id} id={card.id} position={card} onMove={onMove} />
      ))}
      <View>
                {playerCard && (
          <View style={styles.body}>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', gap: 30, width: '100%', height: 80 }}>
              {Object.keys(playerCard).map((suit) => {
                return (
                  <View key={suit} style={{ position: 'relative' }}>
        {playerCard[suit] && playerCard[suit].map((cardObject, index) => {
          const { card: cardText } = cardObject;
          const { rank, suit: cardSuit } = parseCard(cardText) || {};
          const uuid = cardObject?.uuid;
          // Ensure cardOffsets[cardText] exists
          
          
          return (
            <View key={uuid} style={{ position: 'relative' }}>
            <PlayerCard
              key={uuid}
              suit={suit}
              index={index}
              cardObject={cardObject}
              position={playerCardPositions[suit][index]}
              onMove={onPlayerCardMove}
            />
          </View>
          );
        })}
        
                  </View>
                );
              })}
            </View>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
   flexDirection:'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },

  card: {
    width: 50,
    height: 80,
    backgroundColor: '#fff',
    marginHorizontal: 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    borderWidth:1,
    borderColor:'#000',
    elevation: 2, // Add shadow for a card effect
    position: 'absolute', // This makes sure the cards are placed on top of each other
  },
  cardText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  cardImage: {
    width: 26,
    height: 26,
  },
});

export default Drag;
