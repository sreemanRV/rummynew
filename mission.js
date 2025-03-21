import React, { useState,useRef,useEffect } from "react"; // Add useState here
import Navbar from "./navbar";
import { View, Text, TouchableOpacity, Image, StyleSheet,Animated,Dimensions,TouchableWithoutFeedback,ScrollView } from 'react-native';
import Section from "./section";
import { useNavigation } from "@react-navigation/native";
import Sidebar from "./sidebar";
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';

const Mission = () => {
  const navigation = useNavigation();

  // Add activeTab state using useState
  const [activeTab, setActiveTab] = useState(1); // Default active tab is 0
   const dimAnim = useRef(new Animated.Value(0)).current; 
   const [mission,setMission] = useState({})
  // Function to handle tab clicks and update activeTab state
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
        const data = response.data;
        setMission(data);
        console.log('Profile data:', data);
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
      <View style={{ height: '72%' }}>
        <View style={styles.tabContainer}>
          <View style={{flexDirection:'row',backgroundColor:'#fff',borderRadius:10,backgroundColor:'#fff'}}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 0 && styles.activeTab]}
            onPress={() => handleTabPress(0)}
          >
            <Text style={[styles.tabText, activeTab === 0 && styles.activeTabText]}>
              Daily Challenges
            </Text>
          </TouchableOpacity>

          {/* Tab 2 */}
          <TouchableOpacity
            style={[styles.tab, activeTab === 1 && styles.activeTab]}
            onPress={() => handleTabPress(1)}
          >
            <Text style={[styles.tabText, activeTab === 1 && styles.activeTabText]}>
              Missions
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 2 && styles.activeTab]}
            onPress={() => handleTabPress(2)}
          >
            <Text style={[styles.tabText, activeTab === 2 && styles.activeTabText]}>
              Cash
            </Text>
          </TouchableOpacity>
          </View>
          {/* Tab 1 */}


          {/* Tab 3 */}
        </View>
<ScrollView>
<View style={{paddingBottom:80,backgroundColor:"#D5D3D7"}}>
      
  <View style={styles.contentContainer}>
    {activeTab === 1 && (
      <View style={{ padding: 10,paddingHorizontal:30,flexDirection:"column",gap:10 }}>
        {/* <Text style={{ fontWeight: 800 }}>Not started</Text> */}
        <View
          style={{
            borderColor: "#D0CFCC",
            backgroundColor: "#fff",
            flexDirection: "column",
            gap:14,
            padding: 10,
            paddingHorizontal:10,
            borderRadius: 10,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <View>
              <View>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
                  <Text style={{ fontWeight: 800, fontSize: 20 }}>Win ₹5</Text>

                </View>
                <Text>Instant cash</Text>
              </View>
            </View>
<View>
<View style={{ backgroundColor: "#53AF67", padding: 5, borderRadius: 5 }}>
                    <Text style={{ fontSize: 10, color: "#fff", fontWeight: 800 }}>Only for you</Text>
                  </View>
  </View>
          </View>
          <View style={{ borderWidth: 1, borderColor: "#C1C8CE", borderRadius: 5 }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", padding: 5 }}>
              <Text style={{ fontWeight: 800,fontSize:12 }}>Win 3 Game on 9 player table with entry fee : 2</Text>
            </View>
            <View style={{ flexDirection: "row", justifyContent: "space-between", padding: 5 }}>
              <Text style={{ fontSize: 10 }}>Pro Tip: Complete mission to unlock next mission</Text>
            </View>
          </View>
          <View style={{ backgroundColor: "#526E48", padding: 8, borderRadius: 50,flexDirection:'row' ,justifyContent:'center'}}>
              <Text style={{ fontWeight: 800, color: "#fff" }}>Entry ₹2</Text>
            </View>
        </View>
        <View
          style={{
            borderColor: "#D0CFCC",
            backgroundColor: "#fff",
            flexDirection: "column",
            gap:14,
            padding: 10,
            paddingHorizontal:10,
            borderRadius: 10,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <View>
              <View>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
                  <Text style={{ fontWeight: 800, fontSize: 20 }}>Win ₹5</Text>

                </View>
                <Text>Instant cash</Text>
              </View>
            </View>
<View>
<View style={{ backgroundColor: "#53AF67", padding: 5, borderRadius: 5 }}>
                    <Text style={{ fontSize: 10, color: "#fff", fontWeight: 800 }}>Only for you</Text>
                  </View>
  </View>
          </View>
          <View style={{ borderWidth: 1, borderColor: "#C1C8CE", borderRadius: 5 }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", padding: 5 }}>
              <Text style={{ fontWeight: 800,fontSize:12 }}>Win 3 Game on 9 player table with entry fee : 2</Text>
            </View>
            <View style={{ flexDirection: "row", justifyContent: "space-between", padding: 5 }}>
              <Text style={{ fontSize: 10 }}>Pro Tip: Complete mission to unlock next mission</Text>
            </View>
          </View>
          <View style={{ backgroundColor: "#526E48", padding: 8, borderRadius: 50,flexDirection:'row' ,justifyContent:'center'}}>
              <Text style={{ fontWeight: 800, color: "#fff" }}>Entry ₹2</Text>
            </View>
        </View>
      </View>
      
    )}
  </View>
  </View>
  </ScrollView>
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
    justifyContent: 'center',
    backgroundColor:"#D5D3D7"
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
    borderRadius:20
  },
  // Active tab style (changes background color)
  activeTab: {
    backgroundColor: '#526E48',
    borderRadius:10
  },
  // Text style for each tab
  tabText: {
    fontWeight: 'bold',
    color: '#000',
    fontSize: 14
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

export default Mission;
