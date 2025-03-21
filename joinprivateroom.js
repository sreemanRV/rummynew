import React,{useState}from "react";
import { View, Text, TouchableOpacity, TextInput, StyleSheet,Animated,Dimensions,TouchableWithoutFeedback } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { useNavigation } from "@react-navigation/native";

const JoinPrivateRoom = ()=>{
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState(1); // Default active tab is 0
  const [poolTab, setPoolTab] = useState(101);
  const [roomId,SetRoomId] = useState('')
  const handleSelectPool = (index) => {
    setPoolTab(index);
  };

      const [amount, setAmount] = useState("0"); // Default value is "0"
  
         // Update the value while keeping the "$" sign fixed
         const handleAmountChange = (text) => {
          // Remove the "$" symbol, and only keep numbers
          let numericValue = text.replace(/[^0-9]/g, ''); 
          
          // If there's no numeric value, set it back to "0"
          if (numericValue === "") {
            numericValue = "0";
          }
          
          // If the value starts with "0", remove the leading zero
          if (numericValue.startsWith("0") && numericValue.length > 1) {
            numericValue = numericValue.substring(1); // Remove leading 0
          }
          
          setAmount(numericValue); // Update the state with the new value
        };
  
const handleTabPress = (index) => {
  setActiveTab(index);
};
const openGame = (roomId) => {
    navigation.navigate('Game', { roomId });
  }

    const handleSubmit = async (e) => {
      const playerId = await SecureStore.getItemAsync('playerId');
    const payload = {
      "roomSize" : 2,
      "roomType" : "Point",
      "gameMode" : "Practice",
      "gameStatus" : "Waiting",
      "issuedPoint" : 80,
      "totalRounds": 1,
      "entryType" : "Cash",
      "entryPrice" : amount,
      "playerId1": playerId,
      "visibility": "Private",
      "pointValue" : 0.0
  }
      try {
        // const token = process.env.REACT_APP_GITHUB_TOKEN;
        const response = await fetch('http://localhost:7070/api/user/login',{
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body:JSON.stringify(payload),
        });
  
        console.log('Response status:', response.status);
        console.log('Response headers:', response.headers);
        if (response.ok) {
          const data = await response.json();
          console.log('room created');
          // Navigate to the home screen
          navigation.navigate('Home');
      } else {
          setError('Invalid credentials. Please try again.');
          }
        }
       catch (error) {
        console.error('Error submitting form:', error);
      }
    };

            const joinRoom = async()=>{
            const playerId = await SecureStore.getItemAsync('playerId');
            const roomID = roomId
            //   const queryParams = new URLSearchParams(roomDetails).toString();
              try {
                const response = await fetch(`http://localhost:7070/api/room/update-9/${roomID}?playerId=${playerId}`,{
                  method: 'PUT',
                  headers: {
                    'Content-Type': 'application/json',
                  }
                });
          
                // console.log('Response status:', queryParams);
                // console.log('Response headers:', response.headers);
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
                  console.log(playerId);
                  console.log(roomID);
                  }
                }
               catch (error) {
                console.log('Error submitting form:', error);
              }
            }
  

    return(
        <View>
            <View style={{height:40}}>

            </View>
                        <View style={{backgroundColor:'#526E48',height:'60',flexDirection:'row',alignItems:'center'}}>
                            <Text style={{color:'#fff',fontSize:16,fontWeight:700,paddingHorizontal:20}}>Join Room</Text>
                        </View>
                  {/* <View style={styles.tabContainer}>
                    <View style={{flexDirection:'row',backgroundColor:'#fff',borderRadius:8,backgroundColor:'#526E48'}}>
                    <TouchableOpacity
                      style={[styles.tab, activeTab === 0 && styles.activeTab]}
                      onPress={() => handleTabPress(0)}
                    >
                      <Text style={[styles.tabText, activeTab === 0 && styles.activeTabText]}>
                        Free
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[styles.tab, activeTab === 1 && styles.activeTab]}
                      onPress={() => handleTabPress(1)}
                    >
                      <Text style={[styles.tabText, activeTab === 1 && styles.activeTabText]}>
                        Cash
                      </Text>
                    </TouchableOpacity>
                    </View>
                    <View></View>
            
                  </View> */}
                  <View style={{flexDirection:'row',alignItems:'center',justifyContent:'center'}}>
                  <View style={{flexDirection:'column',gap:20,paddingVertical:20,marginTop:200,backgroundColor:'#fff',width:'85%',borderRadius:10}}>
                    <View style={{flexDirection:'column',alignItems:'center'}}>
                    <Text style={{textAlign:'center'}}>Enter Room ID</Text>
                      </View>
                  <View style={{flexDirection:'column',gap:10,alignItems:'center'}}>
                  <TextInput
            label="roomId"
            mode="outlined"
            keyboardType="numeric"
            placeholder="Room ID"
            maxLength={24}
            value={roomId}
            onChangeText={SetRoomId}
            style={styles.inputField}
            theme={{
              colors: {
                primary: '#000', // Border color when active (focus)
                underlineColor: 'transparent', // Disable underline
                background: '#fff', // Background color
              },
            }}/>
                  </View>
                  <View style={{flexDirection:'row',justifyContent:'center'}} >
                  <TouchableOpacity onPress={joinRoom} style={styles.button}><Text style={{color:'#fff'}}>Join Room</Text></TouchableOpacity>
                  </View>
                  </View>
                  </View>

        </View>
    )
}

const styles = StyleSheet.create({
  sidebar: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor:'#fff',
    width: Dimensions.get('window').width * 0.70, // Sidebar takes up 75% of the screen width
    height: '100%',
    marginTop:30, // Dark background for the sidebar
    flexDirection:'row',
    justifyContent: 'flex-end', // Align content from the top
    zIndex: 999, 
  }, 
  tabs: {
    paddingVertical:18,
    paddingHorizontal:24,
    borderRadius:8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:'#fff',

  },
  inputField:{
    width:'90%',
    borderWidth:2,
    borderColor:'#A1A1A1',
    borderRadius:5
    },
  dimBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Dark overlay with 50% opacity
    zIndex: 998,
  },
  tabContainer: {
    flexDirection: 'row',
    padding: 10,
    width:'100%',
    justifyContent: 'center'
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#526E48', // blue-500
  },
  tab: {
    paddingHorizontal:20,
    paddingVertical:10,
    width:'50%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius:8
  },
  activeTab: {
    backgroundColor: '#526E48',
     // Green for active tab
  },
  tabText: {
    fontWeight: 'bold',
    color: '#000',
    fontSize: 14 // Default text color
  },
 
  activeTabText: {
    color: '#fff',
    fontWeight: 800 // White text for active tab
  },
  banner: {
    height: 180,
    backgroundColor: '#526E48'
  },
  bottomNavbar: {
    position: 'absolute', 
    bottom: 0,             // Stick to the bottom
    left: 0,     
    right: 0,              // Align to the right

    backgroundColor: '#fff', // Background color for the navbar
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#9D9895',
    paddingHorizontal: 16,
    paddingVertical: 10
  },
  bottomMenu: {
    fontSize: 14,
    fontWeight: 800
  },
  chips: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  show: {
    width: '100%',
    height: 32,
    backgroundColor: '#fff'
  },
  profileImage: {
    width: 48,
    height: 48,
    borderRadius: 24, // rounded-full
  },
  button: {
    flexDirection: 'row',
    gap: 4,
    justifyContent:'center',
    width:120,
    backgroundColor: '#526E48',
    paddingVertical: 12,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff', // blue-500
    fontWeight: 'bold',
  },
});

export default JoinPrivateRoom;