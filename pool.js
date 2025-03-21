import React, { useState,useEffect} from 'react';
import { View, Text,Image, TouchableOpacity, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';
import { useNavigation } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';

const Pool = () => {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState(2);
  const [poolTab, setPoolTab] = useState(80);
  const [sliderValue, setSliderValue] = useState(0);
  const formattedMoney = `${sliderValue.toFixed(2)}`;
  const [profile,setProfile] = useState();
  const [points,setPoints] = useState();


  const pointValue = async (id) => {
    const playerID = await SecureStore.getItemAsync('playerId');
    const token = await SecureStore.getItemAsync('token');

    try {

      if (!playerID) {
        console.error('Player ID is not available');
        return;
      }

      const response = await axios.get(`http://localhost:7070/api/cards/get-points?playerCount=${activeTab}&type=Pool&defaultValue=${id? id :80}`,{
        headers:{
          'Authorization':`Bearer ${token}`
        }
      });

      if (response.status === 200) {
        const data = response.data; // The response data should be in the `data` property
        setPoints(data);
        console.log(points.pointValue.map((pv)=>pv.money))
      } else {
        console.error('Failed to fetch profile', response.status);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  useEffect(() => {
    pointValue(); // Call the function when the component mounts
  }, []);

  const customSteps = points?.pointValue ? points.pointValue.map((pv) => pv.money) : [];

  const pointValues = points?.pointValue ? points.pointValue.map((pv) => pv.pointValue) : [];

  // Handle slider change
  const handleSliderChange = (value) => {
    setSliderValue(value);
  };

  const handleTabPress = (index) => {
    setActiveTab(index);
  };

  const FetchProfile = async () => {
    const playerID = await SecureStore.getItemAsync('playerId');
    const token = await SecureStore.getItemAsync('token');

    try {
      // Fetch the player ID from SecureStore
 // Ensure the player ID is being retrieved properly

      if (!playerID) {
        console.error('Player ID is not available');
        return;
      }

      // Make the API request using axios
      const response = await axios.get(` http://localhost:7070/api/user/get-user/${playerID}`,{
        headers:{
          'Authorization':`Bearer ${token}`
        }
      });

      // Check if the response is successful
      if (response.status === 200) {
        const data = response.data; // The response data should be in the `data` property
        setProfile(data);
        console.log('Profile data:', data); // You can log the profile data here
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

  const handleSelectPool = (index) => {
    setPoolTab(index);
  };

    const openGame = (roomId) => {
      navigation.navigate('Game', { roomId });
    }
  
    const shuffleCards = async(roomId)=>{
      const token = await SecureStore.getItemAsync('token');
  
      try {
        const response = await fetch(`http://localhost:7070/api/room/shuffle-start/${roomId}`,{
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
  
        console.log('Response status:', queryParams);
        console.log('Response headers:', response.headers);
        if (response.ok) {
  
         } else {
          console.log('Invalid credentials. Please try again.');
          }
        }
       catch (error) {
        console.log('Error submitting form:', error);
      }
  }
  
    const InitializeCards = async(roomId)=>{
      const token = await SecureStore.getItemAsync('token');

        try {
          const activeTabValue = (activeTab === 2 || activeTab === 6) ? 6 : 9;
          const response = await fetch(`http://localhost:7070/api/cards/initialize-${activeTabValue}/${roomId}`,{
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization':`Bearer ${token}`
            }
          });
    
          console.log('Response status:', queryParams);
          console.log('Response headers:', response.headers);
          if (response.ok) {
  
           } else {
            console.log('Invalid credentials. Please try again.');
            }
          }
         catch (error) {
          console.log('Error submitting form:', error);
        }
    }
  
  
  
      const createRoom = async()=>{
       const token = await SecureStore.getItemAsync('token');
        const playerId = await SecureStore.getItemAsync('playerId');
        
        const roomDetails = {
          roomSize: activeTab,
          roomType: 'Pool',
          gameMode: 'Cash',
          gameStatus: 'Waiting',
          pointValue: getCurrentPointValue(),
          playerId: playerId,
          issuedPoint: poolTab,
          totalRounds: 1, 
          entryType: 'Money',
          entryPrice: getCurrentStepValue(),
          visibility: 'Public',
        };
    
        const queryParams = new URLSearchParams(roomDetails).toString();
        try {
          const response = await fetch(`http://localhost:7070/api/room/join-or-create-room?${queryParams}`,{
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          });
    
          console.log('Response status:', queryParams);
          console.log('Response headers:', response.headers);
          if (response.ok) {
            const Data = await response.json();
            const roomId = Data.roomId
            const gameStatus =Data.gameStatus
            if(gameStatus==='Waiting'){
              InitializeCards(roomId)
              shuffleCards(roomId)
            }
            openGame(roomId);
           } else {
            console.log('Invalid credentials. Please try again.');
            }
          }
         catch (error) {
          console.log('Error submitting form:', error);
        }
      }
      const incrementValue = () => {
        // Only allow increment if customSteps has values and the sliderValue is within the range
        if (customSteps.length > 0 && sliderValue < customSteps.length - 1) {
          setSliderValue(sliderValue + 1);
        }
      };
      
      const decrementValue = () => {
        // Only allow decrement if customSteps has values and the sliderValue is within the range
        if (customSteps.length > 0 && sliderValue > 0) {
          setSliderValue(sliderValue - 1);
        }
      };
      
      const getCurrentStepValue = () => customSteps[sliderValue];

      const getCurrentPointValue = () => pointValues[sliderValue];
      
      const changeTab = (id)=>{
        setPoolTab(id);
        pointValue(id);
        setSliderValue(0)
      }
  return (
    <View style={{flexDirection:'column',height:'80%',justifyContent:'center'}}>
      {/* Tabs Container */}
      <Text style={{textAlign:'center',marginBottom:10,marginTop:60}}>Select Players</Text>
      <View style={{display:'flex',flexDirection:'column',gap:20}}>
        <View style={{flexDirection:'row',justifyContent:'center'}}>
        <View style={styles.tabContainer}>
        {/* Tab 1 */}
        <TouchableOpacity
          style={[styles.tab, activeTab === 2 && styles.activeTab]}
          onPress={() =>{ handleTabPress(2);pointValue(); setSliderValue(0)}}
        >
          <Text style={[styles.tabText, activeTab === 2 && styles.activeTabText]}>
           2
          </Text>
        </TouchableOpacity>
      
        <TouchableOpacity
          style={[styles.tab, activeTab === 6 && styles.activeTab]}
          onPress={() =>{ handleTabPress(6);pointValue(); setSliderValue(0)}}
        >
          <Text style={[styles.tabText, activeTab === 6 && styles.activeTabText]}>
            6
          </Text>
        </TouchableOpacity>
      
        <TouchableOpacity
          style={[styles.tab, activeTab === 9 && styles.activeTab]}
          onPress={() => {handleTabPress(9);pointValue(); setSliderValue(0)}}
        >
          <Text style={[styles.tabText, activeTab === 9 && styles.activeTabText]}>
            9
          </Text>
        </TouchableOpacity>
      </View>
        </View>

      <View>
      <Text style={{textAlign:'center',marginBottom:10}}>Select Pool Game</Text>
      <View style={{flexDirection:'row',justifyContent:'center'}}>
      <View style={styles.tabContainer}>
        {/* Tab 1 */}
        <TouchableOpacity
          style={[styles.tab, poolTab === 80 && styles.activeTab]}
          onPress={() => {changeTab(80)}}
        >
          <Text style={[styles.tabText, poolTab === 80 && styles.activeTabText]}>
           80
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, poolTab === 160 && styles.activeTab]}
          onPress={() => {changeTab(160)}}
        >
          <Text style={[styles.tabText, poolTab === 160 && styles.activeTabText]}>
            160
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, poolTab === 240 && styles.activeTab]}
          onPress={() => {changeTab(240)}}
        >
          <Text style={[styles.tabText, poolTab === 240 && styles.activeTabText]}>
            240
          </Text>
        </TouchableOpacity>
      </View>
      </View>

      </View>
      </View>

      <View style={{flexDirection:'row',justifyContent:'center',padding:10}}>
      <View style={{display:'flex',flexDirection:'row',gap:4}}>
    <Text>Entry Fee <Text style={{fontSize:20,fontWeight:700}}>₹{getCurrentStepValue()}</Text></Text>
</View>
      </View>
      <View style={{paddingVertical:0}}>
      <View style={{flexDirection:'row',justifyContent:'space-between',paddingHorizontal:55}}><Text>₹{customSteps[0]}</Text><Text>₹{customSteps[customSteps.length-1]}</Text></View>
      <View style={{ alignItems: 'center', flexDirection: 'row', justifyContent: 'center',paddingVertical:10 }}>

      <TouchableOpacity onPress={decrementValue} style={{
    flexDirection: 'row',
    gap: 4,
    backgroundColor: '#526E48',
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 8,
  }}>
        <Text style={styles.buttonText}><Image style={{height:20,width:20}} source={require('./assets/sub.png')}/></Text>
      </TouchableOpacity>

      {/* Slider */}
      <View style={{width:'70%',flexDirection:'column'}}>
      <Slider
        style={styles.slider}
        minimumValue={0}
        maximumValue={customSteps.length - 1} // 0 to 8 for 9 custom steps
        value={sliderValue}

        onValueChange={handleSliderChange}
        step={1} // Step is 1 to only allow whole numbers (no intermediate values)
        minimumTrackTintColor="#526E48" // Color of the active part of the slider
        maximumTrackTintColor="#D3D3D3"
        thumbTintColor="#526E48" // Color of the inactive part of the slider
      />
      </View>
      

      <TouchableOpacity onPress={incrementValue} style={{
    flexDirection: 'row',
    gap: 4,
    backgroundColor: '#526E48',
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 8,
  }}>
        <Text style={styles.buttonText}><Image style={{height:20,width:20}} source={require('./assets/add.png')}/></Text>
      </TouchableOpacity>
    </View>
      </View>
      {/* Content for active tab */}
<View style={{flexDirection:'row',justifyContent:'center',padding:10,width:350}}>
{
profile?.inGameWallet ===0 ?
 <TouchableOpacity  style={styles.button}>
      <Text style={styles.buttonText}>ADD CASH</Text>

    </TouchableOpacity> :
    <TouchableOpacity style={styles.button} onPress={createRoom}>
      <Text style={styles.buttonText}>PLAY NOW</Text>

    </TouchableOpacity>}
</View>
    </View>
  );
};

const styles = StyleSheet.create({
  // Container for tabs
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    borderRadius: 8,
    backgroundColor:'#fff'
  },
  tab: {
        backgroundColor:'#fff',
height:55,
    paddingHorizontal: 20,
    borderRadius: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: '#526E48', // Green for active tab
  },
  tabText: {
    fontWeight: 'black',
    color: '#000',
    fontSize: 14, // Default text color
  },
  activeTabText: {
    color: '#fff',
    fontWeight: 900, // White text for active tab
  },
  // Content area for active tab
  contentContainer: {
    padding: 16,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  markersContainer: {
    position: 'absolute',
    top: -8, // Adjust the position of markers above the slider
    width: '100%',
    height: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  marker: {
    width: 6,
    height: 6,
    backgroundColor: '#526E48', // Color of the marker
    borderRadius: 3,
    position: 'absolute',
    top: 15, // Positioning markers at a reasonable place above the slider
  },
  button: {
    flexDirection:'row',
    gap:4,
    backgroundColor:'#526E48',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff', // blue-500
    fontWeight: 'bold',

  },
});

export default Pool;
