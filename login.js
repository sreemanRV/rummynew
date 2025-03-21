import React, { useState,useCallback,useRef } from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, Text,Image, TextInput, TouchableOpacity, StyleSheet, Modal, ImageBackground } from 'react-native';
import Icon from 'react-native-vector-icons/EvilIcons';
import * as SecureStore from 'expo-secure-store';
// import * as SecureStore from 'expo-secure-store';
// import { useDispatch } from 'react-redux';

const LoginScreen = () => {
  // const dispatch = useDispatch();
  // const [mobilenumber, setMobilenumber] = useState('');
  const [ismobileFocused, setIsMobileFocused] = useState(false);
  const [ispassFocused, setIsPassFocused] = useState(false);
  const [showForgotPasswordPopup, setShowForgotPasswordPopup] = useState(false);
  const [signUpModal,setSignupModal] = useState(false)
  const navigation = useNavigation();
  const [user,setUser] = useState({ email: '', password:''});
  const [error,setError] = useState('')
  const [otp, setOtp] = useState(Array(6).fill(''));
const otpRefs = useRef([]);

const handleOtpChange = (text, index) => {
  const newOtp = [...otp];
  newOtp[index] = text;
  setOtp(newOtp);

  // Move to the next input automatically if the current input is not empty
  if (text && index < otp.length - 1) {
    otpRefs.current[index + 1].focus();
  }

  // Move to the previous input if the user deletes a character
  if (!text && index > 0) {
    otpRefs.current[index - 1].focus();
  }
};

  // const navigateToAmountReceivedScreen = (phoneNumber) => {
  //   navigation.navigate('AmountReceived', { phoneNumber });
  // };
  // const saveToken = async (key, value) => {
  //   await SecureStore.setItemAsync(key, value);
  // };
      const JoinTournament = async () => {
        const token = await AsyncStorage.getItem('token');
  
        const playerId = await AsyncStorage.getItem('playerId');
      
        try {
          const response = await fetch(`https://d9ed-2401-4900-1cd0-5265-210b-c37b-40f8-4eec.ngrok-free.app/api/tournament/join/676bcadef4d0321567fc45f8?playerId=${playerId}`,{
            method: 'PATCH',
          });
      
          // Check if the response is successful (status 200-299)
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
      
          const data = await response.json(); // Parse response body as JSON
          console.log(data); // Log the data from the response
          console.log('Registered successfully');
        } catch (error) {
          console.error("Error joining the tournament:", error);
          console.log(error.message); // Log error message
          console.log('Registration failed');
        }
      }

   const fetchUserdata = async () => {
    if (user.password.length < 8) {
 
      return;
    }
    const payload = {
      phoneNumber:user.password
    }
    try {
      const response = await fetch(`http://localhost:7070/api/user/send-otp-mobile?phoneNumber=${user.password}`, {
        method: 'POST',
      });
  
      if (response.ok) {
        setShowForgotPasswordPopup(true);
          console.error('Invalid data format:', data);
          return null;
      }
       else {
        await SecureStore.setItemAsync('token', 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJzcmVlbWFudmtAZ21haWwuY29tIiwiaXNzIjoic2FkZXRlY2gtcnVtbXkiLCJyb2xlcyI6WyJVU0VSIl0sInBsYXllcklkIjoiNjc3ZmVlNTAzNzUwYzMyN2RhYWM1M2MyIiwiaWF0IjoxNzQyMjE4NTYyLCJleHAiOjE3NDIzMDQ5NjJ9._-qKxpgrHLj0UKadRW5ZTGqwGDhfWarEL_bIEzzsOTk');
        await SecureStore.setItemAsync('playerId', '677fee503750c327daac53c2');
        console.log('Token stored securely');
        
        const gettoken = await SecureStore.getItemAsync('token');
        console.log('Token:', gettoken);
        setOtp('')
        setShowForgotPasswordPopup(false);
        navigation.navigate('Home');
        console.error('Failed to fetch user profile:', response.status);
        return null;
      }
    } catch (error) {
      await SecureStore.setItemAsync('token', 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJzcmVlbWFudmtAZ21haWwuY29tIiwiaXNzIjoic2FkZXRlY2gtcnVtbXkiLCJyb2xlcyI6WyJVU0VSIl0sInBsYXllcklkIjoiNjc3ZmVlNTAzNzUwYzMyN2RhYWM1M2MyIiwiaWF0IjoxNzQyMjE4NTYyLCJleHAiOjE3NDIzMDQ5NjJ9._-qKxpgrHLj0UKadRW5ZTGqwGDhfWarEL_bIEzzsOTk');
      await SecureStore.setItemAsync('playerId', '677fee503750c327daac53c2');
      console.log('Token stored securely');
      
      const gettoken = await SecureStore.getItemAsync('token');
      console.log('Token:', gettoken);
      setOtp('')
      setShowForgotPasswordPopup(false);
      navigation.navigate('Home');
      console.error('Failed to fetch user profile:', response.status);
      return null;
    }
  };

  const RegisterUserdata = async () => {
    try {
      const response = await fetch(`http://localhost:7070/api/user/register-mobile?phoneNumber=${user.password}`, {
        method: 'POST',
      });
  
      if (response.ok) {
        openVerifyOtp()
          return null;
      }
       else {
        console.error('Failed to fetch user profile:', response.status);
        return null;
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  };

  const goToSignup = () => {
    if (navigation) {
      navigation.navigate('Signup')// Correct usage of navigation
    }
  };
  
  const openVerifyOtp = ()=>{
    setSignupModal(true)
  }

  const handleChange = (field, value) => {
    setError('');
    setUser((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };

  const handleForgotPassword = () => {
  

  };

  const handleSubmit = async (e) => {
    const payload = {
    phoneNumber:user.password,
    otp:otp.join('')
   }
    try {
      // const token = process.env.REACT_APP_GITHUB_TOKEN;
      const response = await fetch('http://localhost:7070/api/user/login/otp',{
        method: 'POST',
        headers:{
         'Content-Type': 'application/json',
        },
        body:JSON.stringify(payload),
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);
      if (response.status === 200) 
        if (response.status === 200) {
          const data = await response.json();
          const token = data.token;
          const playerId = data.playerId;
          await SecureStore.setItemAsync('token', token);
          await SecureStore.setItemAsync('playerId', playerId);
          console.log('Token stored securely');
          
          const gettoken = await SecureStore.getItemAsync('token');
          console.log('Token:', gettoken);
          setOtp('')
          setShowForgotPasswordPopup(false);
          navigation.navigate('Home');
          console.log(data.token);
        } else {
        setError('Invalid credentials. Please try again.');
        }
      }
     catch (error) {
      console.error('Error submitting form:', error);
      console.log(data.token);
      setError('Invalid credentials. Please try again.');
    }
  };

  const handleOtpSubmit = async (e) => {
    const payload = {
     phoneNumber:user.password,
     otp:otp.join('')
    }
     try {
       const response = await fetch('http://localhost:7070/api/user/verify-otp-register',{
         method: 'POST',
         headers:{
          'Content-Type': 'application/json',
         },
         body:JSON.stringify(payload),
       });
 
       console.log('Response status:', response.status);
       console.log('Response headers:', response.headers);
         if (response.status === 200 || response.status === 201) {
           const data = await response.json();
           const token = data.token;
           const playerId = data.playerId;
           await SecureStore.setItemAsync('token', token);
           await SecureStore.setItemAsync('playerId', playerId);
           console.log('Token stored securely');
          
           const gettoken = await SecureStore.getItemAsync('token');
           console.log('Token:', gettoken);
           setOtp('')
           setShowForgotPasswordPopup(false);
           setSignupModal(false);
           navigation.navigate('Home');
           console.log(data);
         } else {
         setError('Invalid credentials. Please try again.');
         }
       }
      catch (error) {
       console.error('Error submitting form:', error);
       console.log(data.token);
       setError('Invalid credentials. Please try again.');
     }
   };

  return (
    <View style={{ flex: 1,backgroundColor:"#526E48"}}>
    <ImageBackground style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 35}}>
      <View style={styles.inputContainer}>
        <View style={{gap:5}}>
      <View style={{ gap: 10 }}>
      <Text style={{fontWeight:500,textAlign:'center'}}>Login / Register</Text>
      <Text style={{fontSize:14}}>Mobile Number</Text>
      <TextInput
        style={[styles.input, ismobileFocused && styles.focusedInput]}
        onChangeText={(value) => handleChange('password', value)}
        value={user.password}
      keyboardType='phone-pad' 
      maxLength={10}
        placeholder="Enter phone number"    
        required
        onFocus={() => setIsPassFocused(true)}
        onBlur={() => setIsPassFocused(false)}
      />
       </View>

        </View>
        <View style={{display:'flex',flexDirection:'column',gap:'10'}}>
            <TouchableOpacity onPress={fetchUserdata} style={styles.button}>
          <Text style={{color: '#fff', }}>Login</Text>
        </TouchableOpacity>

        </View>
      </View>

      <Modal visible={showForgotPasswordPopup} transparent={true} animationType="fade" onRequestClose={() => setShowForgotPasswordPopup(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.forgotPasswordPopup}>
            <View style={{display:'flex',flexDirection:'row',width:'100%', justifyContent:'center'}}>
            <Text style={{fontWeight:800}}>OTP</Text>
            </View>
            <View style={styles.otpContainer}>
  {[...Array(6)].map((_, index) => (
    <TextInput
      key={index}
      style={styles.otpInput}
      keyboardType="numeric"
      maxLength={1}
      onChangeText={(text) => handleOtpChange(text, index)}
      value={otp[index]}
      ref={(input) => (otpRefs.current[index] = input)}  // Handling focus change
    />
  ))}
</View>
{error && <Text style={{color:'red'}}>{error}</Text>}
<TouchableOpacity onPress={handleSubmit} style={styles.otpbutton}>
          <Text style={{color: '#fff', }}>Submit</Text>
        </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Modal visible={signUpModal} transparent={true} animationType="fade" onRequestClose={() => setShowForgotPasswordPopup(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.forgotPasswordPopup}>
            <View style={{display:'flex',flexDirection:'row',width:'100%', justifyContent:'center'}}>
            <Text style={{fontWeight:800,textAlign:'center'}}>OTP</Text>
            </View>
            <View style={styles.otpContainer}>
  {[...Array(6)].map((_, index) => (
    <TextInput
      key={index}
      style={styles.otpInput}
      keyboardType="numeric"
      maxLength={1}
      onChangeText={(text) => handleOtpChange(text, index)}
      value={otp[index]}
      ref={(input) => (otpRefs.current[index] = input)}  // Handling focus change
    />
  ))}
</View>
{error && <Text style={{color:'red'}}>{error}</Text>}
<TouchableOpacity onPress={handleOtpSubmit} style={styles.otpbutton}>
          <Text style={{color: '#fff', }}>Submit</Text>
        </TouchableOpacity>
          </View>
        </View>
      </Modal>
      </ImageBackground>
    </View>

  );
};

const styles = StyleSheet.create({
  inputFocused: {
    borderColor: '#1F41BB',
    borderWidth: 1,
  },
  input: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    fontSize: 14,  
    borderWidth: 1,    
    borderColor: '#D1D5DB', 
    borderRadius: 4,   
    backgroundColor: '#fff',
  },
  image:{
    height:50,
    width:'60%'
  },
    otpContainer: {
      flexDirection: 'row',  // Arrange the inputs in a row
      justifyContent: 'space-between',  // Even spacing between the inputs
      width: '100%',  // Adjust width as needed
      alignItems: 'center',
    },
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },  
    forgotPasswordPopup: {
      width:'85%',
      backgroundColor: '#fff',
      padding: 20,
      display:'flex',
      flexDirection:'column',
      alignItems:'center',
      gap:20,
      borderRadius: 10,
    },
    otpInput: {
      width: 35,  // Width of each box
      height: 35,  // Height of each box
      borderWidth: 1,  // Border for each box
      borderRadius: 5,  // Optional: rounded corners for the boxes
      textAlign: 'center',  // Center the text inside each box
      fontSize: 12,  // Adjust font size as needed
    },
  gradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1, // Ensures gradient is behind other content
  },
  otpbutton:{
    width:'100%',
    padding:10,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:'#526E48',
    zIndex: 2, 
    color:'#fff' // Ensures button is on top of the gradient
  },
  button: { // To stack the gradient background and text
    padding:10,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:'#526E48',
    zIndex: 2, 
    color:'#fff' // Ensures button is on top of the gradient
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height:10
  },
  forgotinput: {
    width:'80%',
    height: 40,
    border: 'none',
    backgroundColor: '#F3F6FF',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  forgotbutton:{
    backgroundColor: '#1F41BB',
    width: '60%',
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },

  inputContainer: {
    display:'flex',
    flexDirection:'column',
    height:200,
    justifyContent: 'center',
    gap:'30',
    borderRadius: 5, 
    width:'85%',
    backgroundColor: '#fff',
    paddingHorizontal:20
  },
  

});

export default LoginScreen;
