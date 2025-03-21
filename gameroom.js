import React, { useEffect, useState,useRef } from 'react';
import { View, Image, ImageBackground,PanResponder,BackHandler ,ScrollView,Dimensions,TouchableWithoutFeedback ,Modal, StyleSheet, TouchableOpacity,Clipboard, Text,Linking,Animated } from 'react-native';
import * as ScreenOrientation from 'expo-screen-orientation';
import { useRoute } from '@react-navigation/native';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { useNavigation } from '@react-navigation/native';
import { Table, Row } from 'react-native-table-component';
import CheckBox from 'react-native-checkbox';  
import { Bar as ProgressBar } from 'react-native-progress';
import  { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { PanGestureHandler, GestureHandlerRootView, State } from 'react-native-gesture-handler';

const Gameroom = () => {
  const loadingTime = 3000; // Set loading time here (5 seconds)
  const [progress, setProgress] = useState(0);
  const [loaded,setLoaded] = useState(false)
  const playerID = SecureStore.getItemAsync('playerId');
  const openWhatsApp = () => {
    const message = `Hey! Join my Rummy Table, Here's my RoomID: ${roomId}`; // Replace with dynamic ID if necessary
    const url = `whatsapp://send?text=${encodeURIComponent(message)}`;
    
    Linking.openURL(url)
      .then(() => console.log("WhatsApp opened"))
      .catch((err) => console.error("Error opening WhatsApp", err));
  };

  const token ="eyJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJzYWRldGVjaC1ydW1teSIsInJvbGVzIjpbIlVTRVIiXSwicGxheWVySWQiOiI2N2RhYjFiMDgyZmQyNzNjYmQ3OWNkZTAiLCJpYXQiOjE3NDIzODYwNzcsImV4cCI6MTc0MjQ3MjQ3N30.032S7S7EOCCny_iQmXof_f_McMflVq_xNJY1QA88DK"
  useEffect(() => {
    // Update the progress bar every interval
    let interval;
    if (progress < 1) {
      interval = setInterval(() => {
        setProgress((prevProgress) => Math.min(prevProgress + 0.01, 1)); // Increment progress
      }, loadingTime / 1000); // Calculate interval based on loading time
    } else {
      FetchOrderedCards();
      setLoaded(true)
    }

    return () => clearInterval(interval); // Cleanup the interval on component unmount
  }, [progress, loadingTime]);

  const [cardOrder, setCardOrder] = useState([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]); // Track card order
  const [cardPositions, setCardPositions] = useState({});
  const [cardOffsets, setCardOffsets] = useState({});
  const [profile,setProfile] = useState()
  const [playerCards, setPlayerCards] = useState({}); 
  const [draggingCard, setDraggingCard] = useState(null);
  const [selectedCards, setSelectedCards] = useState(new Set());
  const [isExitModalVisible, setExitModalVisible] = useState(false); 
  const [lastGame,setLastGame] = useState(false)
  const [lastGamePopup,setLastGamePopup] = useState(false)
  const [finishPopup,setFinishPopup] = useState(false)
  const [disconnectionPopup,setdisconnectionPopup] = useState(false)
  const [room,setRoom] = useState();
  const [stacks, setStacks] = useState({});
  const [cards,setCards] = useState();
  const route = useRoute();
  const roomId = "6782008a9c5b8e691db5fd54"
  const navigation = useNavigation()
      const dimAnim = useRef(new Animated.Value(0)).current; 
      const [dimVisible, setDimVisible] = useState(false);
      const [sidebarVisible, setSidebarVisible] = useState(false);
      const sidebarAnim = useRef(new Animated.Value(Dimensions.get('window').width)).current;
      const toggleSidebar = () => {
       if (sidebarVisible) {
         // Close the sidebar
         Animated.timing(sidebarAnim, {
           toValue: Dimensions.get('window').width, // Move sidebar off-screen
           duration: 300,
           useNativeDriver: true,
         }).start();
         // Fade out the dim background
         Animated.timing(dimAnim, {
           toValue: 0, // Fade out the dim background
           duration: 300,
           useNativeDriver: true,
         }).start();
         setDimVisible(false);
       } else {
         // Open the sidebar
         Animated.timing(sidebarAnim, {
           toValue: 0, // Slide sidebar in
           duration: 300,
           useNativeDriver: true,
         }).start();
         // Fade in the dim background
         Animated.timing(dimAnim, {
           toValue: 0.5, // Dim the background to 50% opacity
           duration: 300,
           useNativeDriver: true,
         }).start();
         setDimVisible(true);
       }
   
       setSidebarVisible(!sidebarVisible); // Toggle the state
     };

     const openFinish = ()=>{
      setFinishPopup(true)
     }

     const [checked, setChecked] = useState([true, false, true]);  // Example state for checkboxes

     const tableHead = ['Game Variants', '13 Card Points', '13 Card Pool', '13 Card Deal'];
     
     const tableData = [
      ['Drop me on 1 turn(s)* miss', <CheckBox checked={checked[0]} onChange={() => toggleCheck(0)} /> , <CheckBox checked={checked[1]} onChange={() => toggleCheck(1)} /> , <CheckBox checked={checked[2]} onChange={() => toggleCheck(2)} />],
      ['Drop me on 2 turn(s)* miss', <CheckBox checked={checked[4]} onChange={() => toggleCheck(4)} /> , <CheckBox checked={checked[5]} onChange={() => toggleCheck(5)} /> , <CheckBox checked={checked[6]} onChange={() => toggleCheck(6)} />],
      ['Drop me on 3 turn(s)* miss', <CheckBox checked={checked[7]} onChange={() => toggleCheck(7)} /> , <CheckBox checked={checked[8]} onChange={() => toggleCheck(8)} /> , <CheckBox checked={checked[9]} onChange={() => toggleCheck(9)} />],
    ];
   
     // Function to toggle checkbox state
     const toggleCheck = (index) => {
       const newChecked = [...checked];
       newChecked[index] = !newChecked[index];
       setChecked(newChecked);
     };
   
  const handleExit = () => {
    setExitModalVisible(true);  // Show the exit confirmation modal
  };

  const handleLastGame = ()=>{
    setLastGamePopup(true)
  }
  
  const handleDisconnection = ()=>{
    setdisconnectionPopup(true)
    
  }
  const closeDisconnection = ()=>{
    setdisconnectionPopup(false)
    
  }

  const confirmExit = () => {

    setExitModalVisible(false); // Close the modal after confirming exit
    exit();
    // Add your exit action here, for example:
    // navigation.goBack(); or close the sidebar
  };

  const cancelExit = () => {
    setExitModalVisible(false); // Close the modal if the user cancels
  };

  const parseCard = (card) => {
    const [rank, suit] = card.split(" of ");
    return { rank, suit };
  };


  // useEffect(() => {
  //   const backAction = () => {
  //     // Prevent back navigation for this screen
  //     return true;
  //   };

  //   // Add back handler event listener
  //   const backHandler = BackHandler.addEventListener(
  //     'hardwareBackPress',
  //     backAction
  //   );

  //   // Cleanup function to remove the listener when the component is unmounted or navigation changes
  //   return () => {
  //     backHandler.remove();
  //   };
  // }, []);

  const exit = ()=>{
    navigation.navigate('Home');
  }

  const confirmLastGame = ()=>{
    setLastGame(true)
    CloseLastGamePopup()
  }

  const CloseLastGamePopup = ()=>{
    setLastGamePopup(false)
  }

  const FetchProfile = async () => {
    const playerID = await SecureStore.getItemAsync('playerId');
    // const token = await SecureStore.getItemAsync('token');
    try {
      // Fetch the player ID from SecureStore
 // Ensure the player ID is being retrieved properly

      if (!playerID) {
        console.error('Player ID is not available');
        return;
      }

      const response = await axios.get(`http://localhost:7070/api/user/get-user/${playerID}`,{
        headers:{
          'Authorization':`Bearer ${token}`
        }
      });

      if (response.status === 200) {
        const data = response.data; 
        setProfile(data);
        console.log();
      } else {
        console.error('Failed to fetch profile', response.status);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  useEffect(() => {
    FetchProfile(); // Call the function when the component mounts
  }, []);

const FetchRoom = async () => {
  const playerID = await SecureStore.getItemAsync('playerId');
  // const token = await SecureStore.getItemAsync('token');
  try {
    if (!playerID) {
      console.error('Player ID is not available');
      return;
    }

    // Make the API request using axios
    const response = await axios.get(`http://localhost:7070/api/room/get-detail/${roomId}`,{
      headers:{
        'Authorization':`Bearer ${token}`
      }
    });

    // Check if the response is successful
    if (response.status === 200) {
      const data = response.data; // The response data should be in the `data` property
      setRoom(data);
      console.log('Profile data:', data); // You can log the profile data here
    } else {
      console.error('Failed to fetch profile', response.status);
    }
  } catch (error) {
    console.error('Error fetching profile:', error);
  }
};

useEffect(() => {
  FetchRoom(); // Call the function when the component mounts
}, []);


const FetchCards = async () => {
  const token = "eyJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJzYWRldGVjaC1ydW1teSIsInJvbGVzIjpbIlVTRVIiXSwicGxheWVySWQiOiI2N2RhYjFiMDgyZmQyNzNjYmQ3OWNkZTAiLCJpYXQiOjE3NDIzODYwNzcsImV4cCI6MTc0MjQ3MjQ3N30.032S7S7EOCCny_iQmXof_f_McMflVq_xNJY1QA88DKk"
  try {
    // Make the API request using axios
    const response = await axios.get(`http://localhost:7070/api/cards/${roomId}/distribute`,{
      headers:{
        'Authorization':`Bearer ${token}`
      }
    });
    // Check if the response is successful
    if (response.status === 200) {
      // Retrieve the playerId from SecureStore
      const playerId = await SecureStore.getItem('playerId');  // Await the Promise here
        // Extract the response data
      const data = response.data;
     
    } else {
      console.log("Failed to fetch cards, response status:", response.status);
    }
  } catch (error) {
    console.error('Error fetching cards:', error);
  }
};

const FetchOrderedCards = async () => {
  // const token = await SecureStore.getItemAsync('token');
  try {
    // Make the API request using axios
    const response = await axios.get(`http://localhost:7070/api/cards/group-by-suit/${roomId}`,{
      headers:{
        'Authorization':`Bearer ${token}`
      }
    });

    // Check if the response is successful
    if (response.status === 200) {
      // Retrieve the playerId from SecureStore
      const playerId = await SecureStore.getItem('playerId');  // Await the Promise here

      // Extract the response data
      const data = response.data;  // The response data should be in the `data` property
      setCards(data);  // Set the entire cards data in the state
      console.log('Response status:', response.status);  // Log the actual response status
      console.log('Response data:', response.data);  // Log the actual response data

      const playerCards = data;  // Access playerCards from the response

      // Check if the playerId exists in the playerCards object
      if (playerCards && playerCards[playerId]) {
        console.log(`Found cards for player ID: ${playerId}`);  // Debug log
        console.log(`result :${cards?.playerCards}`)
        setPlayerCards(playerCards[playerId]);  // Set the cards for the player in the state
        console.log(playerCards[playerId]);  // Log the specific player's cards
      } else {
        console.error("Player ID not found in the data:", playerId);
      console(playerCards) // Set an empty array if the playerId is not found
      }

    } else {
      console.log("Failed to fetch cards, response status:", response.status);
    }
  } catch (error) {
    console.error('Error fetching cards:', error);
  }
};

  useEffect(() => {
    FetchCards();
  }, []);

  const moveToStack = () => {
    const newStackName = `stack${Object.keys(stacks).length + 1}`;
    const selectedArray = Array.from(selectedCards);
    setStacks(prevStacks => {
      const newStacks = { ...prevStacks };
      if (!newStacks[newStackName]) {
        newStacks[newStackName] = [];
      }
  
      // Add selected cards to the new stack (do not overwrite previous stacks)
      newStacks[newStackName] = [...newStacks[newStackName], ...selectedArray];
      return newStacks;
    });
  
    // Remove the selected cards from the current order
    setCardOrder(prevOrder => prevOrder.filter(id => !selectedCards.has(id)));
    setSelectedCards(new Set()); // Clear selected cards
  };
  
  useEffect(() => {
    // Lock orientation to landscape
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);

    return () => {
      ScreenOrientation.unlockAsync();
    };
  }, []);

  useEffect(() => {
    const initialPositions = cardOrder.reduce((acc, cardId) => {
      acc[cardId] = new Animated.ValueXY({ x: 0, y: 0 });
      return acc;
    }, {});
    setCardPositions(initialPositions);
  }, [cardOrder]);

  // const onCardPress = (id) => {
  //   const newPositions = { ...cardPositions };
  //   newPositions[id].setValue({ x: 0, y: -6 }); // Lift the card by 6px
  //   setCardPositions(newPositions);
  // };

  const PlayerCard = ({ suit, index, cardObject, position, onMove }) => {
    const { card: cardText } = cardObject;
    const { rank, suit: cardSuit } = parseCard(cardText) || {};
    const uuid = cardObject?.uuid;

    const translationX = useSharedValue(position.x); // Default to 0 if position is undefined
    const translationY = useSharedValue(position.y); // Default to 0 if position is undefined

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
        // Update translation based on user's movement
        translationX.value = event.nativeEvent.translationX + position.x; 
        translationY.value = event.nativeEvent.translationY + position.y;
      } else if (event.nativeEvent.state === State.END) {
        // On gesture end, update the new position in the parent state
        onMove(suit, index, translationX.value, translationY.value);
      }
    };
  
    return (
      <GestureHandlerRootView>
        <PanGestureHandler onGestureEvent={onGestureEvent} onHandlerStateChange={onGestureEvent}>
          <Animated.View style={[styles.card, animatedStyle]}>
            <Text style={styles.cardText}>{rank}</Text>
            <Image source={suitImages[cardSuit] || suitImages['Joker']} style={styles.cardImage} />
          </Animated.View>
        </PanGestureHandler>
      </GestureHandlerRootView>
    );
  };
  const [playerCardPositions, setPlayerCardPositions] = useState({});

  useEffect(() => {
    if (playerCards && Object.keys(playerCards).length > 0) {
      const initialPositions = Object.keys(playerCards).reduce((acc, suit) => {
        acc[suit] = playerCards[suit].map((_, index) => ({
          x: index * 60,
          y: 0,
        }));
        return acc;
      }, {});
  
      // Only update state if positions have changed
      if (JSON.stringify(initialPositions) !== JSON.stringify(playerCardPositions)) {
        setPlayerCardPositions(initialPositions);
      }
    }
  }, [playerCards, playerCardPositions]); // Add playerCardPositions to avoid unnecessary updates
  
  
  
  const onPlayerCardMove = (suit, index, newX, newY) => {
    setPlayerCardPositions((prevPositions) => {
      const newPositions = { ...prevPositions };
      newPositions[suit][index] = { x: newX, y: newY };
      return newPositions;
    });
  };
  
  

  const copyToClipboard = () => {
    Clipboard.setString(roomId); // Copies the roomId to the clipboard
    console.log(roomId)
  };

  const [walletsection,showWalletSection] = useState(false)
  const [rewardsection,showRewardSection] = useState(false)
  const [helpsection,showHelpSection] = useState(false)

const toggleWalletSection = ()=>{
    showWalletSection(!walletsection)
   }
   const toggleRewardSection = ()=>{
    showRewardSection(!rewardsection)
   }
   const toggleHelpSection = ()=>{
    showHelpSection(!helpsection)
   }

  const suitImages = {
    Heart: require('./assets/heart.jpg'),
    Spade: require('./assets/spade.jpg'),
    Diamond: require('./assets/diamond.jpg'),
    Club: require('./assets/club.jpg'),
  };
  // Animated card component for dragging
  const DraggableCard = ({ cardObject, index, suit, isSelected }) => {
    const { card: cardText, uuid } = cardObject;
    const cardOffset = cardOffsets[uuid] || { x: 0, y: 0 };

    const translationX = useSharedValue(cardOffset.x);
    const translationY = useSharedValue(cardOffset.y);

    const animatedStyle = useAnimatedStyle(() => {
      return {
        transform: [
          { translateX: withSpring(translationX.value, { damping: 20 }) },
          { translateY: withSpring(translationY.value, { damping: 20 }) },
          {
            translateX: index === playerCards[suit].length - 1
              ? 0
              : -25 * (playerCards[suit].length - index - 1),
          },
        ],
      };
    });
  }


  

  return (
    <ImageBackground source={require('./assets/table.jpg')} style={styles.backgroundImage}>
      <View style={styles.container}>
        {/* Add a semi-transparent header for contrast */}
        <View style={{flexDirection:'row',justifyContent:'space-between',width:'100%',alignItems:'center',backgroundColor:'#',paddingHorizontal:10,marginTop:10}}>
          <TouchableOpacity style={{marginTop:10}} onPress={handleExit}>
          <Image source={require('./assets/exit.png')} style={{width:25,height:25}} />
          </TouchableOpacity>
      
        <View style={styles.header}>
          <View>
          <Text onPress={copyToClipboard} style={{fontSize:10,color:'#fff'}}>#{roomId}</Text>
          </View>
          <View style={{flexDirection:'row'}}>
          <Text style={{fontSize:10,color:'#fff'}}>Points Rummy</Text>
          <Text style={{fontSize:10,color:'#fff'}}>800</Text>
        </View>
        <View>
          <Text style={{fontSize:10,color:'#fff'}}>1300</Text>
          </View>
{
profile?.inGameWallet ===0 ?
 <TouchableOpacity  style={styles.button}>
      <Text style={styles.buttonText}>ADD CASH</Text>

    </TouchableOpacity> :
    <TouchableOpacity style={{flexDirection:'row',gap:1,alignItems:'center'}}>
             <Image source={require('./assets/wallet.png')} style={{width:15,height:15}} />
             <Text style={{color:'#fff'}}>
             {profile?.winningWallet}
             </Text>

    </TouchableOpacity>}
        </View>
        <TouchableOpacity style={{marginTop:10,flexDirection:'row',justifyContent:'center'}} onPress={toggleSidebar}>
        <Image source={require('./assets/info.png')} style={{width:30,height:30}} />
        <Image source={require('./assets/menu.png')} style={{width:35,height:35}} />
        </TouchableOpacity>

        </View>



{dimVisible && (
        <TouchableWithoutFeedback onPress={toggleSidebar}>
          <Animated.View
            style={[styles.dimBackground, { opacity: dimAnim }]} // Apply the animated opacity
          />
        </TouchableWithoutFeedback>
      )}
<Animated.View
  style={[
    styles.sidebar,
    {
      transform: [{ translateX: sidebarAnim }], // Apply sliding animation
    },
  ]}
>
<Animated.View style={{flex:1}}>
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>


  <View style={styles.sidebarContent}>

      <View style={{width:'100%'}}>
        <TouchableOpacity onPress={toggleWalletSection} style={{flexDirection:'row', justifyContent:'space-between', padding:15, alignItems:'center', borderBottomColor:'#E4DFDF', borderBottomWidth:1}}>
          <View>
            <Text style={{color:'#fff',fontWeight:800, fontSize:12}}>RNG Certified</Text>
            {/* <Text style={{color:'#fff', fontSize:12}}>Manage Transactions</Text> */}
          </View>
          <Image style={{width:20, height:20}} source={require('./assets/downn.png')}  />
        </TouchableOpacity>

        {walletsection &&     
          <View>
            {/* Wallet Section Details */}
            <TouchableOpacity style={{flexDirection:'row', justifyContent:'space-between', padding:15, alignItems:'center', borderBottomColor:'#E4DFDF', borderBottomWidth:1}}>
              <View style={{flexDirection:'row'}}>
                <Text style={{color:'#fff', fontSize:12}}>Manage Transactions</Text>
              </View>
              <Image style={{width:10, height:10}} source={require('./assets/next.png')}  />
            </TouchableOpacity>
            <TouchableOpacity style={{flexDirection:'row', justifyContent:'space-between', padding:15, alignItems:'center', borderBottomColor:'#E4DFDF', borderBottomWidth:1}}>
              <View style={{flexDirection:'row'}}>
                <Text style={{color:'#fff', fontSize:12}}>KYC</Text>
              </View>
              <Image style={{width:10, height:10}} source={require('./assets/next.png')}  />
            </TouchableOpacity>
            <TouchableOpacity style={{flexDirection:'row', justifyContent:'space-between', padding:15, alignItems:'center', borderBottomColor:'#E4DFDF', borderBottomWidth:1}}>
              <View style={{flexDirection:'row'}}>
                <Text style={{color:'#fff', fontSize:12}}>Wallets</Text>
              </View>
              <Image style={{width:10, height:10}} source={require('./assets/next.png')}  />
            </TouchableOpacity>
            {/* Repeat wallet items as needed */}
          </View>
        }

        {/* Other buttons */}
        <TouchableOpacity onPress={toggleRewardSection}  style={{flexDirection:'row', justifyContent:'space-between', padding:15, alignItems:'center', borderBottomColor:'#E4DFDF', borderBottomWidth:1}}>
          <View>
            <Text style={{color:'#fff',fontWeight:800, fontSize:12}}>No Bot Certified</Text>
            {/* <Text style={{color:'#fff', fontSize:12}}>Manage Transactions</Text> */}
          </View>
          <Image style={{width:20, height:20}} source={require('./assets/downn.png')}  />
        </TouchableOpacity>
        {rewardsection &&     
          <View>
            {/* Wallet Section Details */}
            <TouchableOpacity style={{flexDirection:'row', justifyContent:'space-between', padding:15, alignItems:'center', borderBottomColor:'#E4DFDF', borderBottomWidth:1}}>
              <View style={{flexDirection:'row'}}>
                <Text style={{color:'#fff', fontSize:12}}>Reward Store</Text>
              </View>
              <Image style={{width:10, height:10}} source={require('./assets/next.png')}  />
            </TouchableOpacity>
            <TouchableOpacity style={{flexDirection:'row', justifyContent:'space-between', padding:15, alignItems:'center', borderBottomColor:'#E4DFDF', borderBottomWidth:1}}>
              <View style={{flexDirection:'row'}}>
                <Text style={{color:'#fff', fontSize:12}}>Tickets</Text>
              </View>
              <Image style={{width:10, height:10}} source={require('./assets/next.png')}  />
            </TouchableOpacity>
            <TouchableOpacity style={{flexDirection:'row', justifyContent:'space-between', padding:15, alignItems:'center', borderBottomColor:'#E4DFDF', borderBottomWidth:1}}>
              <View style={{flexDirection:'row'}}>
                <Text style={{color:'#fff', fontSize:12}}>Honour Points </Text>
              </View>
              <Image style={{width:10, height:10}} source={require('./assets/next.png')}  />
            </TouchableOpacity>
            {/* Repeat wallet items as needed */}
          </View>
        }
        <TouchableOpacity onPress={toggleHelpSection}  style={{flexDirection:'row', justifyContent:'space-between', padding:15, alignItems:'center', borderBottomColor:'#E4DFDF', borderBottomWidth:1}}>
          <View>
            <Text style={{color:'#fff',fontWeight:800, fontSize:12}}>Game Settings</Text>
            {/* <Text style={{color:'#fff', fontSize:12}}>Manage Transactions</Text> */}
          </View>
          <Image style={{width:20, height:20}} source={require('./assets/downn.png')}  />
        </TouchableOpacity>
        {helpsection &&     
          <View>
            {/* Wallet Section Details */}
            <TouchableOpacity style={{flexDirection:'row', justifyContent:'space-between', padding:15, alignItems:'center', borderBottomColor:'#E4DFDF', borderBottomWidth:1}}>
              <View style={{flexDirection:'row'}}>
                <Text style={{color:'#fff', fontSize:12}}>Chat with Us</Text>
              </View>
              <Image style={{width:10, height:10}} source={require('./assets/next.png')}  />
            </TouchableOpacity>
            <TouchableOpacity style={{flexDirection:'row', justifyContent:'space-between', padding:15, alignItems:'center', borderBottomColor:'#E4DFDF', borderBottomWidth:1}}>
              <View style={{flexDirection:'row'}}>
                <Text style={{color:'#fff', fontSize:12}}>Contact Us</Text>
              </View>
              <Image style={{width:10, height:10}} source={require('./assets/next.png')}  />
            </TouchableOpacity>

            {/* Repeat wallet items as needed */}
          </View>
        }
                <TouchableOpacity  onPress={openWhatsApp}  style={{flexDirection:'row', justifyContent:'space-between', padding:15, alignItems:'center', borderBottomColor:'#E4DFDF', borderBottomWidth:1}}>
          <View>
            <Text style={{color:'#fff',fontWeight:800, fontSize:12}}>Report a Problem</Text>
            {/* <Text style={{color:'#fff', fontSize:12}}>Manage Transactions</Text> */}
          </View>
          <Image style={{width:20, height:20}} source={require('./assets/down.png')}  />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleDisconnection} style={{flexDirection:'row', justifyContent:'space-between', padding:15, alignItems:'center', borderBottomWidth:1}}>
         <View>
            <Text style={{color:'#fff',fontWeight:800, fontSize:12}}>Disconnection Settings</Text>
          </View>
        </TouchableOpacity> 
        <TouchableOpacity  onPress={openWhatsApp} style={{flexDirection:'row', justifyContent:'space-between', padding:15, alignItems:'center', borderBottomWidth:1}}>
         <View>
            <Text style={{color:'#fff',fontWeight:800, fontSize:12}}>Share Link</Text>
          </View>
        </TouchableOpacity> 
        {(room?.roomType === "Point" && room?.gameMode === "Cash") && (
  <TouchableOpacity onPress={handleLastGame}
    style={{
      flexDirection: 'row', 
      justifyContent: 'space-between', 
      padding: 15, 
      alignItems: 'center', 
      borderBottomColor: '#E4DFDF', 
      borderBottomWidth: 1, 
    }}
  >

      <Text style={{color: '#fff', fontWeight: 800, fontSize: 12}}>Last Game</Text>
{lastGame ?   <Image style={{width:20, height:20}} source={require('./assets/checked.png')}  /> :   <Image style={{width:20, height:20}} source={require('./assets/check.png')} />
}    
  </TouchableOpacity>
)}

      </View>
  </View>
  </ScrollView>
</Animated.View>
</Animated.View>

  
        {/* The rest of the layout */}
        <View style={styles.body}>
       <View>
       {
  room?.playerDetails
    .filter(player => player.playerId !== playerID)  // Filter out the current player
    .map((player, index) =>
      
      (  // Map through the filtered players and render JSX
      <View key={index}>  {/* Add a key to each View for performance */}
        <Text>Player ID: {player.playerID}</Text>  {/* Render playerId */}
        <Text>Issued Points: {player.issuedPoint}</Text>  {/* Render issuedPoint */}
      </View>
    ))
}
       </View>
       <View style={{flexDirection:'row',width:'100%',justifyContent:'center',alignItems:'center',height:60,gap:150}}>
<View style={{width:'100%',height:150,flexDirection:'row',alignItems:'flex-end',justifyContent:'flex-end'}}>
{loaded &&<View style={styles.finishcard}>
            <Text style={{color:'#000',textAlign:'center'}}>Finish</Text>
            <Text style={{color:'#000',textAlign:'center'}}>Card</Text>
          </View>}

</View>
        
<View style={{ flexDirection: 'row' }}>
{Object.keys(playerCards).map((suit) => (
        <View key={suit} style={{ position: 'relative' }}>
          {playerCards[suit] &&
            playerCards[suit].map((cardObject, index) => {
              const { card: cardText, suit: cardSuit } = cardObject;
              const isSelected = false; // Handle selected cards based on your logic
              const uuid = cardObject?.uuid;
              return (
                <DraggableCard
                  key={uuid}
                  cardObject={cardObject}
                  index={index}
                  suit={suit}
                  isSelected={isSelected}
                />
              );
            })}
        </View>
      ))}
</View>
        </View>
        </View>

      <View style={{position:'relative'}}>
      {selectedCards.size >= 2 && (
        <View style={{position:'absolute',right:8,bottom:4}}>
          <TouchableOpacity onPress={moveToStack} style={styles.button}>
            <Text style={{color:'#fff',fontWeight:700,fontSize:14}}>Group</Text>
          </TouchableOpacity>
        </View>
      )}
      </View>
      <View style={styles.loadingcontainer}>
      
            <Text style={styles.text}>
              {progress === 1 ? null :       <ProgressBar  loadingTime={5000}
              progress={progress}
              width={300} // Customize the width of the bar
              height={10} // Customize the height of the bar
              color="#FF5733" // Customize the color of the progress bar
            />}
            </Text>
          </View>
          {playerCards && Object.keys(playerCards).length > 0 && playerCardPositions && (
  <View style={styles.body}>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', gap: 30, width: '100%', height: 80 }}>
      {Object.keys(playerCards).map((suit) => {
        return (
          <View key={suit} style={{ position: 'relative' }}>
            {playerCards[suit] && playerCards[suit].map((cardObject, index) => {
              const { card: cardText } = cardObject;
              // Safe check for position existence
              console.log(playerCardPositions[suit]?.[index]);
              const { rank, suit: cardSuit } = parseCard(cardText) || {};
              const uuid = cardObject?.uuid;
              
              return (
                <View key={uuid} style={{ position: 'relative' }}>
                  <PlayerCard
                    key={uuid}
                    suit={suit}
                    index={index}
                    cardObject={cardObject}
                    position={playerCardPositions[suit]?.[index] || { x: 0, y: 0 }} // Ensure default values
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
        <View style={styles.bottomNavbar}>
          <View style={{width:'20%'}}></View>
  <View style={{ width: '20%', backgroundColor: '#526E48',borderColor:'#fff',borderWidth:1,height: 40, flexDirection: 'row',borderBottomLeftRadius:1000,borderTopLeftRadius:300,borderTopRightRadius:200,borderBottomRightRadius:200 }}>
    {/* Circle view positioned above the bottom navbar */}
    <View style={{
      backgroundColor: '#fff',
      width: 60,
      height: 60,
      borderRadius: 100,
      position: 'absolute',
      bottom: 0,
      left:0 // This moves the circle above the navbar
      
    }}>    <Image source={require('./assets/profile.png')} style={{width:60,height:60,resizeMode:'cover'}} /></View>
    <View style={{position:'absolute',right:20}}>
    <Text style={{ color: '#fff',fontSize:10,fontWeight:700 }}>Total Score</Text>
    <View style={{flexDirection:'row',alignItems:'center',gap:5}}>
    <Text style={{ color: '#526E48',fontSize:20,fontWeight:700}}>80</Text>
    <Text style={{ color: '#fff',fontSize:12,textDecorationLine: 'line-through'}}>80</Text>
    </View>
    </View>

  </View>
  <View style={{width:'20%'}}>

  </View>

</View>
<Modal
        animationType="slide"
        transparent={true}
        visible={isExitModalVisible}
        onRequestClose={cancelExit}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Are you sure you want to exit?</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity onPress={confirmExit} style={styles.modalButton}>
                <Text style={styles.modalButtonText}>Yes</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={cancelExit} style={styles.modalButton}>
                <Text style={styles.modalButtonText}>No</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={finishPopup}
        onRequestClose={CloseLastGamePopup}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Are you sure you want to Leave this Table after this round?</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity onPress={confirmLastGame} style={styles.modalButton}>
                <Text style={styles.modalButtonText}>Yes</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={CloseLastGamePopup} style={styles.modalButton}>
                <Text style={styles.modalButtonText}>No</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={disconnectionPopup}
        onRequestClose={CloseLastGamePopup}
      >        <View style={styles.modalBackground}>
      <View style={styles.InstructionContent}>
        <View style={{flexDirection:'column',alignItems:'center',gap:4}}>
        <Text style={styles.modalText}>DISCONNECTION SETTINGS</Text>
        <Text style={{width:250,textAlign:'center',backgroundColor:'#fff'}}>What should we do in case you get disconnected for a along duration?</Text>
        </View>
        <TouchableOpacity style={{position:'absolute', top:4,right:4}} onPress={closeDisconnection}> 
        <Image source={require('./assets/close.png')} style={{width:25,height:25}} />
        </TouchableOpacity>
        <View style={{flexDirection:'column',paddingHorizontal:20,backgroundColor:'#',width:'100%'}}>
          <Table borderStyle={{ borderWidth: 1, borderColor: '#ddd',backgroundColor:'#fff' }}>
          <Row data={tableHead} style={styles.head} textStyle={styles.text} />
          {tableData.map((rowData, index) => (
            <Row key={index} data={rowData} style={styles.row} textStyle={styles.text} />
          ))}
        </Table>
        </View>
      </View>
    </View>
        <View style={{backgroundColor:'#fff'}}>

        </View>

      </Modal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={finishPopup}
        onRequestClose={CloseLastGamePopup}
      >        <View style={styles.modalBackground}>
      <View style={{backgroundColor:'#526E48',width:'100%',height:75,paddingHorizontal:20,flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>

        <View style={{flexDirection:'column',backgroundColor:'#'}}>

        </View>
        <View style={{flexDirection:'row',justifyContent:'space-between',gap:10,width:200}}>
        <TouchableOpacity onPress={CloseLastGamePopup} style={{    backgroundColor: '#FF5733',  // Button color
        height:35,
    borderRadius: 5,
    flexDirection:'row',
    justifyContent:'center',
    alignItems:'center',
    width: '55%',
    alignItems: 'center',}}>
                <Text style={styles.modalButtonText}>Back to Lobby</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={CloseLastGamePopup} style={{    backgroundColor: '#FF5733',  // Button color
    borderRadius: 5,
    flexDirection:'row',
    justifyContent:'center',
    alignItems:'center',
    height:35,
    width: '45%',
    alignItems: 'center',}}>
                <Text style={styles.modalButtonText}>Play again</Text>
              </TouchableOpacity>
</View>
      </View>
      {}
      <View style={{flexDirection:'row',paddingHorizontal:10,backgroundColor:'#A0C878',paddingVertical:10}}>
      <View style={{width:'8%',}}>
        <Text>Rank</Text>
      </View>
      <View style={{width:'18%',}}>
        <Text>UserName</Text>
      </View>
      <View style={{width:'46%',}}>
        <Text>Cards</Text>
      </View>
      <View style={{width:'13%',}}>
        <Text>DealScore</Text>
      </View>
      
      <View style={{width:'13%',}}>
        <Text>TotalScore</Text>
      </View>
      </View>

    </View>
        <View style={{backgroundColor:'#fff'}}>

        </View>

      </Modal>
      </View>
    </ImageBackground>
  );
  
};
const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    resizeMode: 'cover',
  },
  playercon:{
  flexDirection:'row',
  justifyContent:'center'
  },
  buttonText:{
   fontSize:10
  },
  modalBackground: {
    flex: 1,
    position:'relative',
    backgroundColor: '#fff',  // Dark overlay background
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    flexDirection:'column',
    gap:16,
    borderRadius: 10,
    width: '50%',
    alignItems: 'center',
  },
  InstructionContent: {
    backgroundColor: 'white',
    padding: 10,
    flexDirection:'column',
    gap:16,
    borderRadius: 10,
    width: '70%',
    height:'90%',
    alignItems: 'center',
  },
  loadingcontainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  modalButton: {
    backgroundColor: '#FF5733',  // Button color
    padding: 10,
    borderRadius: 5,
    width: '25%',
    alignItems: 'center',
  },
  modalButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  bottomNavbar:{
    backgroundColor:'#A0C878',
    flexDirection:'row',
    position:'relative',
    justifyContent:'space-between',
    height:42
  },
    container: {
    flex: 1,
    width: '100%',
  },
  stackCards: {
    flexDirection: 'row',
    flexWrap: 'wrap', // This allows the cards to wrap into multiple rows if necessary
    justifyContent: 'center',
    gap: 10, // Space between cards
  },
  sidebar: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: Dimensions.get('window').width * 0.70, // Sidebar takes up 75% of the screen width
    height: '100%',
    marginTop:30, // Dark background for the sidebar
    flexDirection:'row',
    backgroundColor:'#000',
    justifyContent: 'flex-end', // Align content from the top
    zIndex: 999, // Ensure it appears above other components
  },
  sidebarContent: {
    flex: 1,
    alignItems: 'flex-start',
  }, dimBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Dark overlay with 50% opacity
    zIndex: 998, // Ensure it's behind the sidebar but above other content
  },
  button:{
    backgroundColor:'#526E48',
    flexDirection:'row',
    justifyContent:'center',
    alignItems:'center',
    height:30,
    width:60,
    borderRadius:5
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
  finishcard: {
    width: 50,
    height: 80,
    backgroundColor: '#91BC7D',
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
  header: {
    backgroundColor: '#000', // Semi-transparent background for contrast
    width: '60%',
    paddingHorizontal: 30,
    paddingVertical:5,
flexDirection:'row',
justifyContent:'space-between',
borderBottomLeftRadius:50,
borderBottomRightRadius:50,
    marginTop:20,
    alignItems: 'center',
    zIndex: 1, // Ensure it appears above the background
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000', // Ensure text contrasts with the background
  },
  body: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});


export default Gameroom;