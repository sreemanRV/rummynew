import React, { useState,useRef,useEffect } from "react"; // Add useState here
import { View, Text, TouchableOpacity, Image, StyleSheet,Animated,Dimensions,TouchableWithoutFeedback,Linking } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import Sidebar from "./sidebar";
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';

const Refer = () => {
  const navigation = useNavigation();

  // Add activeTab state using useState
  const [activeTab, setActiveTab] = useState(1); // Default active tab is 0
   const dimAnim = useRef(new Animated.Value(0)).current; 
   const [link,setLink] = useState({})
  // Function to handle tab clicks and update activeTab state
  const handleTabPress = (index) => {
    setActiveTab(index);
  };

    const openWhatsApp = () => {
      const message = JSON.stringify(link);
      const url = `whatsapp://send?text=${encodeURIComponent(message)}`;
      
      Linking.openURL(url)
        .then(() => console.log("WhatsApp opened"))
        .catch((err) => console.error("Error opening WhatsApp", err));
    };
  

  const openLobby = () => {
    navigation.navigate('Home');
  };

  const openMission = () => {
    navigation.navigate('Home');
  };

  const openRefer = ()=>{
    navigation.navigate('Refer')
   }

  const FetchLink = async () => {
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
      const response = await axios.get(`http://localhost:7070/api/user/generate-whatsapp-link?playerId=${playerID}`,{
        headers:{
          'Authorization':`Bearer ${token}`
        }
      });

      // Check if the response is successful
      if (response.status === 200) {
        const data = response.data; // The response data should be in the `data` property
        setLink(data);
        console.log('Profile data:', data); // You can log the profile data here
      } else {
        console.error('Failed to fetch profile', response.status);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  useEffect(() => {
    FetchLink(); // Call the function when the component mounts
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
    <View style={{position:'relative',}}>
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
      <View style={{ height: '72%',flexDirection:'row',alignItems:'center',justifyContent:'center' }}>

 <TouchableOpacity onPress={openWhatsApp} style={{height:40,backgroundColor:'#526E48',borderRadius:5,width:200,gap:10,flexDirection:'row',justifyContent:'center',alignItems:'center'}}><Image source={require('./assets/whatsapp.png')} style={{ width: 20, height: 20 }} /><Text style={{color:'#fff'}}>Invite via Whatsapp</Text></TouchableOpacity>

      </View>

      <View style={styles.bottomNavbar}>
      <TouchableOpacity onPress={openLobby} style={styles.chips}>
          <Image source={require('./assets/lobby.png')} style={{ width: 36, height: 36 }} />
          <Text style={styles.bottomMenu}>Lobby</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={openRewards} style={styles.chips}>
          <Image source={require('./assets/reward.png')} style={{ width: 36, height: 36 }} />
          <Text style={styles.bottomMenu}>Rewards</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={openMission} style={styles.chips}>
          <Image source={require('./assets/mission.png')} style={{ width: 36, height: 36 }} />
          <Text style={[styles.bottomMenu, { color: '#526E48' }]}>Mission</Text>
        </TouchableOpacity>
                <TouchableOpacity onPress={openRefer} style={styles.chips}>
                <Image source={require('./assets/referactive.png')} style={{width:36,height:36}} />
                  <Text style={{fontSize:12,fontWeight:800}}>Refer & Earn</Text>
                </TouchableOpacity>
        <TouchableOpacity onPress={toggleSidebar} style={styles.chips}>
          <Image source={require('./assets/iconmenu.png')} style={{ width: 36, height: 36 }} />
          <Text style={styles.bottomMenu}>Menu</Text>
        </TouchableOpacity>
      </View>
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
    height: 180,
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

export default Refer;
