import React, { useState,useRef,useEffect } from "react";

import { View, Text, TouchableOpacity, Image, StyleSheet,Animated,Dimensions,TouchableWithoutFeedback } from 'react-native';

import { useNavigation } from "@react-navigation/native";
import Sidebar from "./sidebar";
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';
import Svg, { Path } from 'react-native-svg';

const Ticket = () => {
  const navigation = useNavigation();

  const [activeTab, setActiveTab] = useState(0); 
   const dimAnim = useRef(new Animated.Value(0)).current; 
   const [mission,setMission] = useState({})

  const handleTabPress = (index) => {
    setActiveTab(index);
  };

  const openLobby = () => {
    navigation.navigate('Home');
  };

  const openRefer = ()=>{
    navigation.navigate('Refer')
   }

  const openMission = () => {
    navigation.navigate('Home');
  };

  const FetchMission = async () => {
    const playerID = await SecureStore.getItemAsync('playerId');
    const token = await SecureStore.getItemAsync('token');

    try {

      if (!playerID) {
        console.error('Player ID is not available');
        return;
      }

      // Make the API request using axios
      const response = await axios.get(`http://localhost:7070/api/mission/get-mission/${playerID}`,{
        headers:{
          'Authorization':`Bearer ${token}`
        }
      });

      // Check if the response is successful
      if (response.status === 200) {
        const data = response.data; // The response data should be in the `data` property
        setMission(data);
        console.log('Profile data:', data); // You can log the profile data here
      } else {
        console.error('Failed to fetch profile', response.status);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  useEffect(() => {
    FetchMission(); // Call the function when the component mounts
  }, []);

  const openRewards = () => {
    navigation.navigate('Rewards');
  };
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
   const [dimVisible, setDimVisible] = useState(false);
   const [sidebarVisible, setSidebarVisible] = useState(false);
   const sidebarAnim = useRef(new Animated.Value(Dimensions.get('window').width)).current;
  return (
    <View style={{position:'relative',backgroundColor:'#fff'}}>
      <View style={styles.show}>
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
  <Sidebar />
</Animated.View>
      <View style={styles.banner}>
      </View>
      <View style={{ height: '83%' }}>
        <View style={styles.tabContainer}>
          <View style={{flexDirection:'row',backgroundColor:'#fff',borderRadius:8,backgroundColor:'#526E48'}}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 0 && styles.activeTab]}
            onPress={() => handleTabPress(0)}
          >
            <Text style={[styles.tabText, activeTab === 0 && styles.activeTabText]}>
              Tickets Store
            </Text>
          </TouchableOpacity>

          {/* Tab 2 */}
          <TouchableOpacity
            style={[styles.tab, activeTab === 1 && styles.activeTab]}
            onPress={() => handleTabPress(1)}
          >
            <Text style={[styles.tabText, activeTab === 1 && styles.activeTabText]}>
              Tickets Owned
            </Text>
          </TouchableOpacity>
          </View>
          {/* Tab 1 */}


          {/* Tab 3 */}
        </View>

{activeTab === 0 && 
<View style={{flexDirection:'column',alignItems:'center'}}>

    <View style={{ alignItems: 'center', width: '80%', height: 250, position: 'relative',overflow:'hidden' }}>
      {/* Ticket Shape */}
      <Svg width="100%" height="250" viewBox="0 0 300 100">
        <Path
          d="M20,0 h260 a20,20 0 0 1 20,20 v20 a20,20 0 1 0 0,40 v20 a20,20 0 0 1 -20,20 h-260 a20,20 0 0 1 -20,-20 v-20 a20,20 0 1 0 0,-40 v-20 a20,20 0 0 1 20,-20 z"
          fill="#FFB600"
        />
      </Svg>

      {/* Ticket Content */}
      <View style={{ position: 'absolute', width: '100%', height: '100%', justifyContent: 'center',paddingHorizontal:40,marginTop:10 }}>
      <View style={{position:'absolute',top:80,right:35,borderRadius:100,padding:5,backgroundColor:'#fff',overflow:'hidden',width:35,height:35,flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
  <View style={{flexDirection:'column',alignItems:'center'}}>
  <Text style={{fontSize:8,color:"#526E48",fontWeight:800}}>₹5 Only</Text>
    </View>

  </View>
        <Text style={{ fontSize: 11, fontWeight: 'bold', color: '#000' }}>Valentines Loot 5K Guarenteed</Text>
        <View style={{flexDirection:'row',gap:5,alignItems:'center'}}>
<Text style={{fontSize:10}}>5K Prize</Text>
<Image source={require('./assets/trophyT.png')} style={{width:15,height:15}} />
</View>
<View style={{marginTop:10}}>
<Text style={{ fontSize:10, color: '#555' }}>Ticket Expires on</Text>
<Text  style={styles.smallFont}>Febraury 20,2025</Text>
  </View>

        <View style={{height:10,position:"relative",backgroundColor:'transparent'}}>
        <TouchableOpacity style={{flexDirection:'row',position:'absolute',alignItems:"center",justifyContent:'center',backgroundColor:'#499C1D',padding:5,paddingHorizontal:14,bottom:10,right:-5,borderRadius:5}}>
  <Text style={{color:'#fff',fontSize:10}}>Buy Ticket</Text>  
  </TouchableOpacity>
          </View>

      </View>
    </View>
</View>}
{activeTab === 1 &&
<View style={{flexDirection:'column',alignItems:'center',justifyContent:"center",gap:16,marginTop:50}}>
  <View style={{flexDirection:'column',alignItems:'center',gap:10}}>
<Image source={require('./assets/ticketcounter.png')} style={{width:50,height:50}} />
<Text style={{fontSize:14,fontWeight:800}}>You dont have any Active Ticket</Text>
</View>

<View style={{flexDirection:'column',alignItems:'center'}}>
<Text style={{fontSize:14,width:250,textAlign:'center'}}>Join in tournaments to get free entry to upcoming tournaments and other thrilling rewards. </Text>
</View>
<TouchableOpacity style={{flexDirection:'row',alignItems:'center',justifyContent:'center',paddingVertical:10,paddingHorizontal:14,backgroundColor:'#499C1D',borderRadius:5}}>
<Text style={{color:'#fff',fontWeight:800,}}>
Join Tournament
  </Text>
</TouchableOpacity>
  </View> 
}

      </View>

      {/* <View style={styles.bottomNavbar}>
      <TouchableOpacity onPress={openLobby} style={styles.chips}>
          <Image source={require('./assets/lobby.png')} style={{ width: 36, height: 36 }} />
          <Text style={styles.bottomMenu}>Lobby</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={openRewards} style={styles.chips}>
          <Image source={require('./assets/reward.png')} style={{ width: 36, height: 36 }} />
          <Text style={styles.bottomMenu}>Rewards</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={openMission} style={styles.chips}>
          <Image source={require('./assets/activemission.png')} style={{ width: 36, height: 36 }} />
          <Text style={[styles.bottomMenu, { color: '#526E48' }]}>Mission</Text>
        </TouchableOpacity>
                <TouchableOpacity onPress={openRefer} style={styles.chips}>
                <Image source={require('./assets/refer.png')} style={{width:36,height:36}} />
                  <Text style={{fontSize:12,fontWeight:800}}>Refer & Earn</Text>
                </TouchableOpacity>
        <TouchableOpacity onPress={toggleSidebar} style={styles.chips}>
          <Image source={require('./assets/iconmenu.png')} style={{ width: 36, height: 36 }} />
          <Text style={styles.bottomMenu}>Menu</Text>
        </TouchableOpacity>
      </View> */}
    </View>
  );
};

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
    zIndex: 999, // Ensure it appears above other components
  }, 
  smallFont:{
    fontSize:10,
  },
  dimBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Dark overlay with 50% opacity
    zIndex: 998, // Ensure it's behind the sidebar but above other content
  },
  tabContainer: {
    flexDirection: 'row',
    padding: 10,
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
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    // borderRadius:8
  },
  // Active tab style (changes background color)
  activeTab: {
    backgroundColor: '#526E48',
    borderRadius:20
     // Green for active tab
  },
  // Text style for each tab
  tabText: {
    fontWeight: 'bold',
    color: '#000',
    fontSize: 14 // Default text color
  },
  // Active text style (changes color when active)
  activeTabText: {
    color: '#fff',
    fontWeight: 800
  },

  banner: {
    height: 100,
    backgroundColor: '#526E48'
  },
  bottomNavbar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
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
    backgroundColor: '#526E48',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff', // blue-500
    fontWeight: 'bold',
  },
});

export default Ticket;
