import React, { useState,useEffect} from 'react';
import { View, Text,Image, TouchableOpacity, StyleSheet,Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';


const Header  = ()=>{
       const navigation = useNavigation()
       const openProfile = ()=>{
        navigation.navigate('Profile');
       }

       const openLevel= ()=>{
        navigation.navigate('LoyaltyPoints')
        }
    
       const openKyc = ()=>{
        navigation.navigate('KYCVerification');
       }
    return(
    <View style={styles.container}>

    <View style={{flexDirection:'row',gap:1}}>
      <TouchableOpacity style={{flexDirection:'column',alignItems:'center'}} onPress={openLevel}>
      <Image source={require('./assets/level.png')} style={{width:25,height:25}} />
      <Text style={{color:'#fff'}}>11</Text>
      </TouchableOpacity>
      </View>

      <View style={{flexDirection:'row'}}>
        {/* <View>
            <Text style={{color:'#fff',fontSize:10}}>Withdraw Cash</Text>
        </View> */}
      <TouchableOpacity onPress={openProfile}>
      <Image source={require('./assets/profile.png')} style={styles.profileImage} />
      </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={openKyc} style={styles.button}>
      <Image style={{width:20,height:20}} source={require('./assets/cashh.png')}  />
        <Text style={styles.buttonText}>ADD CASH</Text>
      </TouchableOpacity>
    </View>
    )
}

export default Header;


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
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 998,
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