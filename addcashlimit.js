import React,{useState}from "react";
import { View, Text, TouchableOpacity, TextInput, StyleSheet,Animated,Dimensions,TouchableWithoutFeedback,Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const AddcashLimit = ()=>{
  const navigation = useNavigation();


  const openCreateRoom = () => {
    navigation.navigate('CreatePrivateroom');
  };

  const openJoinRoom = () => {

    navigation.navigate('JoinPrivateroom');
  };
  
    return(
      <View>
        <View style={{flexDirection:"row",alignItems:'center',gap:10,backgroundColor:'#526E48',paddingVertical:20}}>
        <TouchableOpacity style={{padding:5}} onPress={() => navigation.goBack()}>
                 <Image source={require('./assets/back.png')} style={{width:25,height:25}} />
                 </TouchableOpacity>
        <Text style={{color:'#fff',fontSize:16,fontWeight:800}}>Terms & Conditions</Text>
        </View>
  

      <View style={styles.container}>
      
                 {/* Profile Image */}
             
           
           
          
    
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={openCreateRoom} style={styles.button}>
          <Text style={styles.buttonText}>Create a room</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={openJoinRoom} style={styles.joinbutton}>
          <Text style={styles.joinbuttonText}>Join a room</Text>
        </TouchableOpacity>
      </View>
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

export default AddcashLimit;