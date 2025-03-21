import React,{useState,useRef,useEffect} from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet, ScrollView, Modal, Animated,Dimensions } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import { TextInput, Button } from 'react-native-paper';

const Kyc = () => {
    const navigation = useNavigation()
    const [activeTab, setActiveTab] = useState(0); 
       const dimAnim = useRef(new Animated.Value(0)).current; 
       const [dimVisible, setDimVisible] = useState(false);
       const [sidebarVisible, setSidebarVisible] = useState(false);
       const sidebarAnim = useRef(new Animated.Value(Dimensions.get('window').width)).current;
       const [aadharNumber, setAadharNumber] = useState(Array(12).fill(''));
    const handleTabPress = (index) => {
     setActiveTab(index);
   };
 
   return (
     <View style={{position:'relative',backgroundColor:'#fff'}}>
     <View style={styles.show}>
 
     </View>

     <View style={styles.container}>
       {/* Profile Image */}
       <TouchableOpacity  onPress={() => navigation.goBack()} >
       <Image source={require('./assets/back.png')} style={styles.profileImage} />
       </TouchableOpacity>

    <Text style={{color:'#fff',fontSize:16,fontWeight:800}}>KYC Verification</Text>

     </View>
     <View style={{height:'85%',flexDirection:'column',gap:20}}>
      <View style={{height:100}}>

      </View>
       <View style={{flexDirection:'column',alignItems:'center',width:'100%'}} >
       <View style={{width:'60%',flexDirection:'column',gap:5}}>
      <Text style={{fontSize:20,fontWeight:800}}>Verify KYC to Continue</Text>
      <Text style={{fontSize:12,fontWeight:800,color:'#8D8A8A'}}>As per policy it is mandatory to verify KYC to add cash or play cash games</Text>
      </View>
     </View>
     <View style={{paddingHorizontal:20,flexDirection:'column',gap:10}}>
        <Text style={{fontSize:16,fontWeight:600}}>Enter Aadhar Number</Text>
        <View style={styles.inputContainer}>
        <TextInput
            label="Aadhar Number"
            mode="outlined"
            keyboardType="numeric"
            maxLength={12}
            // placeholder="xxxx xxxx xxxx"
            value={aadharNumber.join('')}
            onChangeText={(text) => {
              const updatedAadhar = text.split('');
              if (updatedAadhar.length <= 12) setAadharNumber(updatedAadhar);
            }}
            style={styles.inputField}
            theme={{
              colors: {
                primary: '#000', // Border color when active (focus)
                underlineColor: 'transparent', // Disable underline
                background: '#fff', // Background color
              },
            }}
          />

        </View>
        <Text style={{fontSize:15,fontWeight:700}}>Upload AadharCard Image</Text>
        <View style={{flexDirection:'row',justifyContent:'space-between'}}>
          <View style={{flexDirection:'column',alignItems:'center',justifyContent:'center'}}>
          <View style={{width:100,height:100,backgroundColor:'#EDEDED',borderRadius:5,flexDirection:'row',alignItems:'center',justifyContent:'center'}}>
        <Image source={require('./assets/addd.png')} style={{width:50,height:50}} />
        </View>
        <Text>Front side</Text>
          </View>
<View style={{flexDirection:'column',alignItems:'center',justifyContent:'center'}}>
<View style={{width:100,height:100,backgroundColor:'#EDEDED',borderRadius:5,flexDirection:'row',alignItems:'center',justifyContent:'center'}}>
        <Image source={require('./assets/addd.png')} style={{width:50,height:50}} />
        </View>
        <Text>Back side</Text>
</View>

        </View>


      </View>
      <TouchableOpacity
        style={{padding:5,borderRadius:'100%',backgroundColor:'#526E48',width:60,height:60,flexDirection:'row',justifyContent:'center',alignItems:'center',position:'absolute',bottom:20,right:20}}
      >
        <Text style={{ color: '#fff', fontWeight: '800' }}><Image source={require('./assets/nextt.png')} style={{width:25,height:25}} /></Text>
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
   inputContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 10,
  },
  inputField:{
  width:'100%',
  borderColor:'#000'
  },
  buttonActive: {
    backgroundColor: '#526E48', // Blue color for active state
  },
  buttonInactive: {
    backgroundColor: '#D3D3D3', // Grey color for inactive state
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
   input: {
    width: 20,
    height: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    margin: 5,
    fontSize: 20,
    textAlign: 'center',
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
     couponContainer: {   // Green background color
         borderWidth: 2,                // Border thickness
         borderColor: '#C0B6B6',           // Border color (white in this case)
         borderStyle: 'dashed',         // Dashed border
         padding: 5,                   // Padding inside the container
         margin: 10,                    // Margin around the container
         borderRadius: 5,               // Optional: rounded corners
         alignItems: 'center',          // Center the text horizontally
         justifyContent: 'center',      // Center the text vertically
       },
   container: {
     flexDirection: 'row',
     alignItems: 'center',
     height: 70,
     paddingHorizontal:20,
     backgroundColor: '#526E48', // blue-500
   },
   tabContainer: {
     flexDirection: 'row',
     padding:10,
   },
   // Basic style for each tab
   tab: {
    height:72,
     flex:1,
     borderRadius: 8,
     alignItems: 'center',
     justifyContent: 'center',
     backgroundColor:'#fff'
   },
   // Active tab style (changes background color)
   activeTab: {
     backgroundColor: '#FFD4BA',
     borderBottomWidth:2,
     borderBottomColor:'#526E48' // Green for active tab
   },
   // Text style for each tab
   tabText: {
     fontWeight: 'bold',
     color: '#000',
     fontSize:14 // Default text color
   },
   // Active text style (changes color when active)
   activeTabText: {
     color: '#000',
     fontWeight:800 // White text for active tab
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
     width: 30,
     height: 20,
     borderRadius: 24, // rounded-full
   },
   button: {
     flexDirection:'row',
     justifyContent:'center',
     gap:4,
     backgroundColor:'#8D8A8A',
     paddingVertical: 12,
     paddingHorizontal: 12,
     borderRadius: 5,
   },
   buttonText: {
     color: '#fff', // blue-500
     fontWeight: 'bold',
 
   },
 });
 
 export default Kyc;