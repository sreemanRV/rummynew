import React,{useEffect,useState, useRef} from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet,Animated,Dimensions,TouchableWithoutFeedback } from 'react-native';
import Section from './section';
import { useNavigation } from '@react-navigation/native';
import * as ScreenOrientation from 'expo-screen-orientation';  
import Sidebar from './sidebar';
import Header from './header';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const Home = () => {
   const navigation = useNavigation()
   const dimAnim = useRef(new Animated.Value(0)).current; 
   const [rooms,setRooms] = useState();
   const [dimVisible, setDimVisible] = useState(false);
   const [sidebarVisible, setSidebarVisible] = useState(false);
   const sidebarAnim = useRef(new Animated.Value(Dimensions.get('window').width)).current;

   const FetchProfile = async () => {
    const playerID = await SecureStore.getItemAsync('playerId');
   const token = await SecureStore.getItemAsync('token');

    try {

      if (!playerID) {
        console.error('Player ID is not available');
        return;
      }
      
      // Make the API request using axios
      const response = await axios.get(`http://localhost:7070/api/room/get-room/${playerID}/status/Ongoing`,{
        headers:{
          'Authorization':`Bearer ${token}`
        }
      });

      if (response.status === 200) {
        const data = response.data; // The response data should be in the `data` property
        setRooms(data);
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
           toValue: 0,
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
   const openMission = ()=>{
    navigation.navigate('Mission');
   }
   const openRefer = ()=>{
    navigation.navigate('Refer')
   }
   const openLobby = ()=>{
    navigation.navigate('Home');
   }

   const openRewards = ()=>{
    navigation.navigate('Rewards');
   }
   useEffect(() => {
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
  }, []);

  return (
    <View style={{position:'relative',backgroundColor:'#fffff0'}}>
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
  <Sidebar setSidebarVisible={setSidebarVisible} />
</Animated.View>

<Header />

    <View style={{height:'87%'}}> 
    <Section />
    
    </View>
<View style={{position:'absolute',bottom:75,width:'100%',height:70,flexDirection:'row',gap:6,paddingHorizontal:20,alignItems:'center'}}>
{rooms?.map((room)=>(
<TouchableOpacity  onPress={() => navigation.navigate('Game', { roomId: room.roomId })} style={{backgroundColor:'#526E48',height:50,width:100,borderRadius:50,flexDirection:'row',justifyContent:'center',alignItems:'center',borderColor:'#650703',borderWidth:6,position:'relative'}}>
<Text style={{color:'#fff'}}>{room.roomType}</Text>
<View style={{width:20,height:20,backgroundColor:'#000',position:'absolute',bottom:-12,borderRadius:50,flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
<Text style={{color:'#fff'}}>{room.roomSize}</Text>
</View>
</TouchableOpacity>))}
</View>
    <View style={styles.bottomNavbar}>
    <TouchableOpacity onPress={openLobby} style={styles.chips}>
        <Image source={require('./assets/activelobby.png')} style={{width:36,height:36}} />
          <Text style={[styles.bottomMenu,{color:'#526E48'}]}>Lobby</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={openRewards} style={styles.chips}>
        <Image source={require('./assets/reward.png')} style={{width:36,height:36}} />
        <Text style={styles.bottomMenu}>Rewards</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={openMission} style={styles.chips}>
        <Image source={require('./assets/mission.png')} style={{width:36,height:36}} />
          <Text style={styles.bottomMenu}>Mission</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={openRefer} style={styles.chips}>
        <Image source={require('./assets/refer.png')} style={{width:36,height:36}} />
          <Text style={{fontSize:12,fontWeight:800}}>Refer & Earn</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={toggleSidebar} style={styles.chips}>
        <Image source={require('./assets/iconmenu.png')} style={{width:36,height:36}} />
          <Text style={styles.bottomMenu}>Menu</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headingtext:{
    fontSize:12,
    color:'#EEEBEB'
  },  
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
  sidebarContent: {
    flex: 1,
    alignItems: 'flex-start',
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#526E48', // blue-500
  },
  bottomNavbar: {
    position: 'absolute',  // Position at the bottom
    bottom: 0,             // Stick to the bottom
    left: 0,               // Align to the left
    right: 0,              // Align to the right
    backgroundColor: '#fff', // Background color for the navbar
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth:1,
    borderTopColor:'#9D9895',
    paddingHorizontal: 16,
    paddingVertical:10
  },  dimBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Dark overlay with 50% opacity
    zIndex: 998, // Ensure it's behind the sidebar but above other content
  },
  bottomMenu:{
   fontSize:14,
   fontWeight:800
  },
  chips:{
    flexDirection:'column',
    alignItems:'center',
  },
  show:{
    width: '100%',
    height: 32,
    backgroundColor:'#fff'
  },
  profileImage: {
    width: 48,
    height: 48,
    borderRadius: 24, // rounded-full
  },
  button: {
    flexDirection:'row',
    gap:4,
    backgroundColor:'#fff',
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 5,
  },
  buttonText: {
    color: '#526E48', // blue-500
    fontWeight: 'bold',
  },
});

export default Home;
