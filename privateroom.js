import React,{useState}from "react";
import { View, Text, TouchableOpacity, TextInput, StyleSheet,Animated,Dimensions,TouchableWithoutFeedback } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const PrivateRoom = ()=>{
  const navigation = useNavigation();

  const openCreateRoom = () => {
    // Navigate and pass the tournament ID as a parameter
    navigation.navigate('CreatePrivateroom');
  };

  const openJoinRoom = () => {
    // Navigate and pass the tournament ID as a parameter
    navigation.navigate('JoinPrivateroom');
  };

  
         // Update the value while keeping the "$" sign fixe
  

    return(
      <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={openCreateRoom} style={styles.button}>
          <Text style={styles.buttonText}>Create a room</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={openJoinRoom} style={styles.joinbutton}>
          <Text style={styles.joinbuttonText}>Join a room</Text>
        </TouchableOpacity>
      </View>
    </View>
    )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor:'#000',
    height:'80%',
    justifyContent: 'center', // Vertically centers the content
    alignItems: 'center',      // Horizontally centers the content
    backgroundColor: '#f8f8f8', // Optional, just for a nicer background
  },
  buttonContainer: {
    flexDirection:'column',
  alignItems: 'center',  // Ensures buttons are centered horizontally
    justifyContent: 'center',
    gap:40

  },
  joinbutton:{
    backgroundColor: '#526E48', // Button color
    height:45,
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'center',
    width:150,
    borderRadius: 10,
  },
  joinbuttonText: {
    color: '#fff',          // Text color
    fontSize: 16,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#526E48', // Button color
    height:45,
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'center',
    width:150,
    borderRadius: 10,
  },
  buttonText: {
    color: '#fff',          // Text color
    fontSize: 16,
    textAlign: 'center',
  },
});

export default PrivateRoom;