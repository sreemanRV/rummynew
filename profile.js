import React,{useState,useEffect,useRef} from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet,Dimensions,TouchableWithoutFeedback, ScrollView, Modal, TextInput, Animated } from 'react-native';
import { Calendar } from 'react-native-calendars';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';

const Profile = () => {

  const [phone,setPhone] = useState('8072303608')
  const [gender,setGender] = useState('Male')
  const [password,setPassword] = useState('')
  const [passwordPopup,setPasswordPopup] = useState(false)
  const dimAnimProfile = useRef(new Animated.Value(0)).current; // Dim background for profile
  const dimAnimMail = useRef(new Animated.Value(0)).current;
  const dimAnimPhone = useRef(new Animated.Value(0)).current;
  const dimAnimGender = useRef(new Animated.Value(0)).current;
  const slideAnim = new Animated.Value(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [profile,setProfile] = useState();
  const playerID = SecureStore.getItemAsync('playerId');
  const [changepasswordPopup,setChangePasswordPopup] = useState(false)

  const FetchProfile = async () => {
    const playerID = await SecureStore.getItemAsync('playerId');
    const token = await SecureStore.getItemAsync('token');
    try {

      if (!playerID) {
        console.error('Player ID is not available');
        return;
      }

      const response = await axios.get(`http://localhost:7070/api/user/get-user/${playerID}`,{
        headers:{
          'Authorization':`Bearer ${token}`
        }
      });

      if (response.status === 200) {
        const data = response.data; // The response data should be in the `data` property
        setProfile(data);
        console.log('Profile data:', data); // You can log the profile data here
      } else {
        console.error('Failed to fetch profile', response.status);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  useEffect(() => {
    FetchProfile();
  }, []);

  useEffect(() => {
    setName(profile?.name);
  }, [profile?.name]);

  useEffect(() => {
    setMail(profile?.email);
  }, [profile?.email]);

  useEffect(() => {
    setPhone(profile?.phoneNumber);
  }, [profile?.phoneNumber]);
  const [name, setName] = useState(profile?.name);
  const [mail, setMail] = useState(profile?.email);
  const updateName = async () => {
    const playerId = await SecureStore.getItemAsync('playerId');
    const token = await SecureStore.getItemAsync('token');

    try {
      const response = await fetch(`http://localhost:7070/api/user/update-name/${playerId}?name=${name}`,{
        method: 'PUT',
        headers:{
        'Authorization':`Bearer ${token}`}
      });

      if(response.ok){
        closeProfile();
        FetchProfile();
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json(); // Parse response body as JSON
      console.log(data); // Log the data from the response
      console.log('Registered successfully');
    } catch (error) {
      console.error("Error Updating the name:", error);
      console.log(error.message); // Log error message
      console.log(name);
    }
  }

     const [profileVisible, setprofileVisible] = useState(false);
     const [mailVisible, setmailVisible] = useState(false);
     const [phoneVisible, setphoneVisible] = useState(false);
     const [genderVisible, setGenderVisible] = useState(false);  

    const handleGenderSelect = (selectedGender) => {
      setGender(selectedGender);
    };
    const closeGender = () => {
      // Close the sidebar
      Animated.timing(sidebarAnim, {
        toValue: Dimensions.get('window').width, // Move sidebar off-screen
        duration: 300,
        useNativeDriver: true,
      }).start();

      Animated.timing(dimAnimGender, {
        toValue: 0, // Fade out the dim background
        duration: 300,
        useNativeDriver: true,
      }).start();
    
      setGenderVisible(false);// Make sure dim is hidden
    };

    const closePhone = () => {
      // Close the sidebar
      Animated.timing(sidebarAnim, {
        toValue: Dimensions.get('window').width, // Move sidebar off-screen
        duration: 300,
        useNativeDriver: true,
      }).start();
    
      // Fade out the dim background
      Animated.timing(dimAnimPhone, {
        toValue: 0, // Fade out the dim background
        duration: 300,
        useNativeDriver: true,
      }).start();
    
      // Reset the profile visibility state
      setphoneVisible(false);// Make sure dim is hidden
    };

    const closeMail = () => {
      // Close the sidebar
      Animated.timing(sidebarAnim, {
        toValue: Dimensions.get('window').width, // Move sidebar off-screen
        duration: 300,
        useNativeDriver: true,
      }).start();
    
      // Fade out the dim background
      Animated.timing(dimAnimMail, {
        toValue: 0, // Fade out the dim background
        duration: 300,
        useNativeDriver: true,
      }).start();
    
      // Reset the profile visibility state
      setmailVisible(false);// Make sure dim is hidden
    };
    const slideAnimProfile = new Animated.Value(0);
    const slideAnimMail = new Animated.Value(0);
    const slideAnimGender = new Animated.Value(0);
    const slideAnimPhone = new Animated.Value(0);
   const sidebarAnim = useRef(new Animated.Value(Dimensions.get('window').width)).current;
   const openProfile = () => {
         if (profileVisible) {
           // Close the sidebar
           Animated.timing(slideAnimProfile, {
             toValue: Dimensions.get('window').width, // Move sidebar off-screen
             duration: 300,
             useNativeDriver: true,
           }).start();
           // Fade out the dim background
           Animated.timing(dimAnimProfile, {
             toValue: 0, // Fade out the dim background
             duration: 300,
             useNativeDriver: true,
           }).start();

         } else {
           // Open the sidebar
           Animated.timing(slideAnimProfile, {
             toValue: 0, // Slide sidebar in
             duration: 300,
             useNativeDriver: true,
           }).start();
           // Fade in the dim background
           Animated.timing(dimAnimProfile, {
             toValue: 0.5, // Dim the background to 50% opacity
             duration: 300,
             useNativeDriver: true,
           }).start();

         }
         setprofileVisible(!profileVisible); // Toggle the state
       };

       const closeProfile = () => {
 
        // Close the sidebar
        Animated.timing(sidebarAnim, {
          toValue: Dimensions.get('window').width, // Move sidebar off-screen
          duration: 300,
          useNativeDriver: true,
        }).start();
      
        // Fade out the dim background
        Animated.timing(dimAnimProfile, {
          toValue: 0, // Fade out the dim background
          duration: 300,
          useNativeDriver: true,
        }).start();
      
        // Reset the profile visibility state
        setprofileVisible(false);// Make sure dim is hidden
        setName('')
      };

       const openGender = () => {
        if (genderVisible) {
          // Close the sidebar
          Animated.timing(slideAnimProfile, {
            toValue: Dimensions.get('window').width, // Move sidebar off-screen
            duration: 300,
            useNativeDriver: true,
          }).start();
          // Fade out the dim background
          Animated.timing(dimAnimGender, {
            toValue: 0, // Fade out the dim background
            duration: 300,
            useNativeDriver: true,
          }).start();

        } else {
          // Open the sidebar
          Animated.timing(slideAnimProfile, {
            toValue: 0, // Slide sidebar in
            duration: 300,
            useNativeDriver: true,
          }).start();
          // Fade in the dim background
          Animated.timing(dimAnimGender, {
            toValue: 0.5, // Dim the background to 50% opacity
            duration: 300,
            useNativeDriver: true,
          }).start();

        }
        setGenderVisible(!genderVisible); // Toggle the state
      };
       const openPhone = () => {
        if (phoneVisible) {
          // Close the sidebar
          Animated.timing(slideAnimPhone, {
            toValue: Dimensions.get('window').width, // Move sidebar off-screen
            duration: 300,
            useNativeDriver: true,
          }).start();
          // Fade out the dim background
          Animated.timing(dimAnimPhone, {
            toValue: 0, // Fade out the dim background
            duration: 300,
            useNativeDriver: true,
          }).start();

        } else {
          // Open the sidebar
          Animated.timing(slideAnimPhone, {
            toValue: 0, // Slide sidebar in
            duration: 300,
            useNativeDriver: true,
          }).start();
          // Fade in the dim background
          Animated.timing(dimAnimPhone, {
            toValue: 0.5, // Dim the background to 50% opacity
            duration: 300,
            useNativeDriver: true,
          }).start();

        }
        setphoneVisible(!phoneVisible); // Toggle the state
      };
       const openMail = () => {
        if (mailVisible) {
          // Close the sidebar
          Animated.timing(slideAnimMail, {
            toValue: Dimensions.get('window').width, // Move sidebar off-screen
            duration: 300,
            useNativeDriver: true,
          }).start();
          // Fade out the dim background
          Animated.timing(dimAnimMail, {
            toValue: 0, // Fade out the dim background
            duration: 300,
            useNativeDriver: true,
          }).start();
        } else {
          // Open the sidebar
          Animated.timing(slideAnimMail, {
            toValue: 0, // Slide sidebar in
            duration: 300,
            useNativeDriver: true,
          }).start();
          // Fade in the dim background
          Animated.timing(dimAnimMail, {
            toValue: 0.5, // Dim the background to 50% opacity
            duration: 300,
            useNativeDriver: true,
          }).start();
        }
        setmailVisible(!mailVisible); // Toggle the state
      };
      


  const handleSave = () => {
    setModalVisible(false);
  };

  return (
    <View style={{flex:1}}>
    <View style={styles.show}>

    </View>
    <View style={{position:'relative',flexDirection:'column',justifyContent:'center',alignItems:'center'}}>

    <View style={styles.container}>

    </View>
    <View style={styles.basecontainer}>

    </View>
    <View style={{flexDirection:'Column',alignItems:'center',position:'absolute',}}>
      <View style={{position:'relative'}}>
      <Image source={require('./assets/profile.png')} style={styles.profileImage} />
      <View style={{position:'absolute',right:12,bottom:8,backgroundColor:'#fff',padding:4,borderRadius:100}}>
      <Image style={{height:20,width:20}} source={require('./assets/editprofile.png')}/>
      </View>

      </View>

      <Text style={{fontSize:16,fontWeight:800}}>{profile?.name}</Text>
      </View>
    </View>
    
    <ScrollView style={{backgroundColor:'#E8E0DD',flex:1}}>
      <View style={{paddingHorizontal:20,paddingVertical:10,flexDirection:'column',gap:20}}>
        <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
          <Text style={{fontWeight:800,fontSize:16}}>Personal Information</Text>
        </View>
        <View>
        <View style={styles.card}>
          <View style={styles.cardposition}>
           <Image source={require('./assets/persona.png')} style={{width:25,height:25}} />
          <View style={styles.cardHeading}>
          <Text style={{fontSize:14}}>Your Name</Text>
      {profile?.name&& <Text style={{fontWeight:800}}>{profile?.name}</Text>}
          </View>
          </View>
          <TouchableOpacity onPress={openProfile} style={styles.buttonoutline}>
           {profile?.name === null? <Text >Add</Text> : <Text >Edit</Text>}
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <View style={styles.cardposition}>
      <Image source={require('./assets/mail.png')} style={{width:25,height:25}} />
          <View style={styles.cardHeading}>
          <Text>Email</Text>
          <Text style={{fontWeight:800}}>{profile?.email}</Text>
          </View>
          </View>
          <TouchableOpacity  onPress={openMail} style={styles.buttonoutline}>
            <Text>Change</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.card}>
          <View style={styles.cardposition}>
      <Image source={require('./assets/number.png')} style={{width:25,height:25}} />
          <View style={styles.cardHeading}>
          <Text>Phone number</Text>
          <Text style={{fontWeight:800}}>{profile?.phoneNumber}</Text>
          </View>

          </View>
          <TouchableOpacity onPress={openPhone} style={styles.buttonoutline}>
            <Text>Change</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.card}>
          <View style={styles.cardposition}>
      <Image source={require('./assets/number.png')} style={{width:25,height:25}} />
          <View style={styles.cardHeading}>
          <Text>Password</Text>
          <Text style={{fontWeight:800}}>{'*'.repeat(profile?.phoneNumber?.length || '')}</Text>
          </View>

          </View>
          <TouchableOpacity onPress={()=>setChangePasswordPopup(true)} style={{    flexDirection:'row',
    alignItems:'center',
    justifyContent:'center',
    gap:4,
    width:100,
    height:40,
    borderWidth:1,
    borderRadius:5,
    backgroundColor:'#fff',
    borderColor:'#BEBDBC'}}>
            <Text>Set Password</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.card}>
          <View style={styles.cardposition}>
          <Image source={require('./assets/calendar.png')} style={{width:25,height:25}} />
          <View style={styles.cardHeading}>
          <Text>State</Text>
          {/* <Text style={{fontWeight:800}}>28 July, 2001</Text> */}
          </View>
          </View>
          <TouchableOpacity style={styles.buttonoutline}>
            <Text>Edit</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.card}>
          <View style={styles.cardposition}>
              <Image source={require('./assets/location.png')} style={{width:25,height:25}} />
          <View style={styles.cardHeading}>
          <Text>Gender</Text>
          <Text style={{fontWeight:800}}>{gender}</Text>
          </View>
          </View>
          <TouchableOpacity onPress={openGender} style={styles.buttonoutline}>
            <Text>Edit</Text>
          </TouchableOpacity>
        </View>
        </View>
      </View>

      <View style={{paddingHorizontal:20,paddingVertical:10,flexDirection:'column',gap:20}}>
        <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
          <Text style={{fontWeight:800,fontSize:16}}>Preference</Text>
        </View>

        <View style={styles.preferencecard}>
          <View style={styles.cardposition}>
            <Image source={require('./assets/language.png')} style={{width:25,height:25}} />
          <View style={styles.cardHeading}>
          <Text>Choose your Language</Text>
          </View>
          </View>
          <View style={styles.buttonoutline}>
            <Text>Edit</Text>
          </View>
        </View>

        <View style={styles.preferencecard}>
          <View style={styles.cardposition}>
      <Image source={require('./assets/instruction.png')} style={{width:25,height:25}} />
          <View style={styles.cardHeading}>
          <Text>Responsible Gaming</Text>
          </View>
          </View>
          <Image style={{width:15,height:15}} source={require('./assets/next.png')}  />
        </View>

        <View style={styles.preferencecard}>
          <View style={styles.cardposition}>
      <Image source={require('./assets/instruction.png')} style={{width:25,height:25}} />
          <View style={styles.cardHeading}>
          <Text>TDS</Text>
          </View>
          </View>
          <Image style={{width:15,height:15}} source={require('./assets/next.png')}  />
        </View>
        
        {/* <View style={styles.preferencecard}>
          <View style={styles.cardposition}>
          <Image style={{width:20,height:20}} source={require('./assets/setting.png')}  />
          <View style={styles.cardHeading}>
          <Text>Settings</Text>
          </View>

          </View>
          <Image style={{width:15,height:15}} source={require('./assets/next.png')}  />
        </View> */}
      
      </View>

    </ScrollView>
    {profileVisible && (
  <TouchableWithoutFeedback onPress={openProfile}>
    <Animated.View
      style={[styles.dimBackground, { opacity: dimAnimProfile }]} // Apply the animated opacity
    />
  </TouchableWithoutFeedback>
)}
{profileVisible &&
  <Animated.View
  style={[
    styles.sidebar,
    {
      transform: [{ translateY: slideAnimProfile }], // Apply sliding animation
      zIndex: 999, // Ensure the sidebar is above the dim background
    },
  ]}
>
  <View style={styles.modalContent}>
    <Text style={styles.modalTitle}>Edit Your Name</Text>
    <TextInput
      value={name}
      onChangeText={setName}
      style={styles.modalInput}
    />
    <View style={styles.modalButtons}>
      <TouchableOpacity style={styles.modalButton} onPress={updateName}>
        <Text style={styles.modalButtonText}>Save</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.modalButton} onPress={closeProfile}>
        <Text style={styles.modalButtonText}>Cancel</Text>
      </TouchableOpacity>
    </View>
  </View>
</Animated.View>
}

{mailVisible && (
  <TouchableWithoutFeedback onPress={openMail}>
    <Animated.View
      style={[styles.dimBackground, { opacity: dimAnimMail }]} // Apply the animated opacity
    />
  </TouchableWithoutFeedback>
)}

{mailVisible &&
  <Animated.View
  style={[
    styles.sidebar,
    {
      transform: [{ translateY: slideAnimProfile }], // Apply sliding animation
      zIndex: 999, // Ensure the sidebar is above the dim background
    },
  ]}
>
  <View style={styles.modalContent}>
    <Text style={styles.modalTitle}>Edit Your Mail</Text>
    <TextInput
      value={mail}
      onChangeText={setName}
      style={styles.modalInput}
    />
    <View style={styles.modalButtons}>
      <TouchableOpacity style={styles.modalButton} onPress={handleSave}>
        <Text style={styles.modalButtonText}>Save</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.modalButton} onPress={closeMail}>
        <Text style={styles.modalButtonText}>Cancel</Text>
      </TouchableOpacity>
    </View>
  </View>
</Animated.View>
}

{genderVisible && (
  <TouchableWithoutFeedback onPress={openGender}>
    <Animated.View
      style={[styles.dimBackground, { opacity: dimAnimGender }]} // Apply the animated opacity
    />
  </TouchableWithoutFeedback>
)}

{genderVisible &&
  <Animated.View
  style={[
    styles.sidebar,
    {
      transform: [{ translateY: slideAnimGender }], // Apply sliding animation
      zIndex: 999, // Ensure the sidebar is above the dim background
    },
  ]}
>

  <View style={styles.modalContent}>
    <Text style={styles.modalTitle}>Choose Your Gender</Text>
    <View style={{flexDirection:'row',alignItems:'center',justifyContent:'center',gap:14}}>
    <TouchableOpacity
      style={[styles.genderCard, gender === 'Male' && styles.selectedGender]} // Apply conditional style for Male
      onPress={() => handleGenderSelect('Male')}
    >
   <Image style={{width:50,height:50}} source={require('./assets/male.png')}  />
   <Text style={[ gender === 'Male' && styles.selectedGenderText]}>Male</Text> 
    </TouchableOpacity>
    <TouchableOpacity
      style={[styles.genderCard, gender === 'Female' && styles.selectedGender]} // Apply conditional style for Male
      onPress={() => handleGenderSelect('Female')}
    >
   <Image style={{width:50,height:50}} source={require('./assets/female.png')}  />
   <Text style={[ gender === 'Female' && styles.selectedGenderText]}>Female</Text> 
    </TouchableOpacity>
    <TouchableOpacity
      style={[styles.genderCard, gender === 'Others' && styles.selectedGender]} // Apply conditional style for Male
      onPress={() => handleGenderSelect('Others')}
    >
   {/* <Image style={{width:50,height:50}} source={require('./assets/male.png')}  /> */}
   <Text style={[ gender === 'Others' && styles.selectedGenderText]}>Others</Text> 
    </TouchableOpacity>
    </View>

    <View style={styles.modalButtons}>
      <TouchableOpacity style={styles.modalButton} onPress={closeGender}>
        <Text style={styles.modalButtonText}>Save</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.modalButton} onPress={closeGender}>
        <Text style={styles.modalButtonText}>Cancel</Text>
      </TouchableOpacity>
    </View>
  </View>
</Animated.View>
}

{phoneVisible && (
  <TouchableWithoutFeedback onPress={openPhone}>
    <Animated.View
      style={[styles.dimBackground, { opacity: dimAnimPhone }]} // Apply the animated opacity
    />
  </TouchableWithoutFeedback>
)}
{phoneVisible &&
  <Animated.View
  style={[
    styles.sidebar,
    {
      transform: [{ translateY: slideAnimPhone }],
      zIndex: 999,
    },
  ]}
>
  <View style={styles.modalContent}>
    <Text style={styles.modalTitle}>Edit Your Number</Text>
    <TextInput
      value={phone}
      onChangeText={setName}
      style={styles.modalInput}
    />   
    <View style={styles.modalButtons}>
      <TouchableOpacity style={styles.modalButton}>
        <Text style={styles.modalButtonText}>Save</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.modalButton} onPress={closePhone}>
        <Text style={styles.modalButtonText}>Cancel</Text>
      </TouchableOpacity>
    </View>
  </View>
</Animated.View>
}

   {/* <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalOverlay}>
          <Animated.View
            style={[
              styles.modalContainer,
              {
                transform: [
                  {
                    translateY: slideAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [500, 0],
                    }),
                  },
                ],
              },
            ]}
          >
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Edit Your Name</Text>
              <TextInput
                value={name}
                onChangeText={setName}
                style={styles.modalInput}
              />
              <View style={styles.modalButtons}>
                <TouchableOpacity style={styles.modalButton} onPress={handleSave}>
                  <Text style={styles.modalButtonText}>Save</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.modalButton} onPress={handleCloseModal}>
                  <Text style={styles.modalButtonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Animated.View>
        </View>
      </Modal> */}
            <Modal visible={passwordPopup} transparent={true} animationType="fade" onRequestClose={() => setPasswordPopup(false)}>
              <View style={styles.passwordmodalContainer}>
                <View style={styles.forgotPasswordPopup}>
                  <View style={{display:'flex',flexDirection:'row',width:'100%', justifyContent:'center'}}>
                  <Text style={{fontWeight:800,textAlign:'center'}}>Set Your Password</Text>
                  </View>
         <View style={{width:'100%'}}>
         <Text>Password</Text>
          <TextInput
            style={styles.otpInput}
            keyboardType="numeric"
            maxLength={1}
            // onChangeText={(text) => handleOtpChange(text, index)}
            // value={otp[index]}
          />      
         </View>

         <View style={{width:'100%'}}>
         <Text>Confirm Password</Text>
          <TextInput
            style={styles.otpInput}
            keyboardType="numeric"
            maxLength={1}
            // onChangeText={(text) => handleOtpChange(text, index)}
            // value={otp[index]}
          />      
         </View>

      <TouchableOpacity style={styles.otpbutton}>
                <Text style={{color: '#fff', }}>Submit</Text>
              </TouchableOpacity>
                </View>
              </View>
            </Modal>

            <Modal visible={changepasswordPopup} transparent={true} animationType="fade" onRequestClose={() => setPasswordPopup(false)}>
              <View style={styles.passwordmodalContainer}>
                <View style={styles.forgotPasswordPopup}>
                  <View style={{display:'flex',flexDirection:'row',width:'100%', justifyContent:'center'}}>
                  <Text style={{fontWeight:800,textAlign:'center'}}>Set Your Password</Text>
                  </View>
                  <View style={{width:'100%'}}>
         <Text>Old Password</Text>
          <TextInput
            style={styles.otpInput}
            keyboardType="numeric"
            maxLength={1}
            // onChangeText={(text) => handleOtpChange(text, index)}
            // value={otp[index]}
          />      
         </View>
         <View style={{width:'100%'}}>
         <Text>Password</Text>
          <TextInput
            style={styles.otpInput}
            keyboardType="numeric"
            maxLength={1}
            // onChangeText={(text) => handleOtpChange(text, index)}
            // value={otp[index]}
          />      
         </View>

         <View style={{width:'100%'}}>
         <Text>Confirm Password</Text>
          <TextInput
            style={styles.otpInput}
            keyboardType="numeric"
            maxLength={1}
            // onChangeText={(text) => handleOtpChange(text, index)}
            // value={otp[index]}
          />      
         </View>

      <TouchableOpacity style={styles.otpbutton}>
                <Text style={{color: '#fff', }}>Submit</Text>
              </TouchableOpacity>
                </View>
              </View>
            </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    height:'220',
    justifyContent: 'flex-end', // Position the modal at the bottom
    alignItems: 'center',
    backgroundColor:'#f48971'
 // Overlay background
  },
  passwordmodalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
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
  otpInput: {
    width: '100%',  // Width of each box
    height: 35,  // Height of each box
    borderWidth: 1,  // Border for each box
    borderRadius: 5,  // Optional: rounded corners for the boxes
    textAlign: 'center',  // Center the text inside each box
    fontSize: 12,  // Adjust font size as needed
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
  genderCard:{
    flexDirection:'column',
    justifyContent:'center',
    alignItems:'center',
    borderRadius:10,
    width:'30%',
   borderWidth:1,
   borderColor:'#D4D4D4',
    height:90
  },
  selectedGender:{
    borderWidth:2,
    borderColor:'#526E48'
  },
  selectedGenderText:{
    color:'#526E48',
    fontWeight:700
  },
  modalContent: {
    width: '100%',
    backgroundColor: '#fff',
    position:'absolute',
    flexDirection:'column',
    gap:12,
    bottom:0,
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
    paddingLeft: 10,
  },
  modalButtons:{
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    backgroundColor: '#526E48',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  modalButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal:20,
    height:96,
    width:'100%',
    backgroundColor: '#526E48', // blue-500
  },
  basecontainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal:20,
    height:64,
    width:'100%',
    backgroundColor: '#E8E0DD', // blue-500
  },
  preferencecard:{
    display:'flex',
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:"center",
    padding:12,
    borderRadius:5,

    backgroundColor:'#fff',
    width:'100%'
  },
  chips:{
    flexDirection:'column',
    alignItems:'center'
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
  cardHeading:{
    flexDirection:'column'
  },
  cardposition:{
    flexDirection:'row',
    justifyContent:'center',
    alignItems:'center',
    gap:10
  },
  show:{
    width: '100%',
    height: 32,
    backgroundColor:'#fff'
  },
  bottomNavbar: {
    position: 'absolute',  // Position at the bottom
    bottom: 0,             // Stick to the bottom
    left: 0,               // Align to the left
    right: 0,              // Align to the right
    height: 80,            // Set a height for the navbar
    backgroundColor: '#526E48', // Background color for the navbar
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  card:{
    display:'flex',
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:"center",
    paddingHorizontal:10,
    paddingVertical:15,
    borderBottomWidth:1,
    borderBottomColor:'#BBB8B7',
    borderRadius:5,
    backgroundColor:'#fff',
    width:'100%'
  },
  Transactioncard:{
    display:'flex',
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:"center",
    padding:10,
    borderBottomWidth:1,
    borderColor:'#D1CECC',
    borderRadius:5,
    backgroundColor:'#fff',
    width:'100%'
  },
  columncard:{
    display:'flex',
    flexDirection:'column',
    justifyContent:'space-between',
    alignItems:"center",
    borderRadius:5,
    backgroundColor:'#fff'
  },
  profileImage: {
    width: 96,
    height: 96,
    borderRadius: 24, // rounded-full
  },
  button: {
    flexDirection:'row',
    gap:4,
    backgroundColor:'#526E48',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff', // blue-500
    fontWeight: 'bold',
    fontSize:20
  },
  buttonoutline:{
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'center',
    gap:4,
    width:60,
    height:40,
    borderWidth:1,
    borderRadius:5,
    backgroundColor:'#fff',
    borderColor:'#BEBDBC'
  }
});

export default Profile;
