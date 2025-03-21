import React,{useState,useRef,useEffect} from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet, TouchableWithoutFeedback, Modal, Animated,Dimensions } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import { TextInput, Button } from 'react-native-paper';
import * as SecureStore from 'expo-secure-store';
import axios from "axios";
import RadioButton from "./radiobutton";

const Withdraw = () => {
    const navigation = useNavigation()
    const [activeTab, setActiveTab] = useState(0); 
       const dimAnim = useRef(new Animated.Value(0)).current; 
       const [dimVisible, setDimVisible] = useState(false);
       const [sidebarVisible, setSidebarVisible] = useState(false);
       const sidebarAnim = useRef(new Animated.Value(Dimensions.get('window').width)).current;
       const [amount, setAmount] = useState("0"); // Default value is "0"
       const [profile,setProfile] = useState();
       const [active,setActive] = useState(null);
       const [error,setError] = useState('');
       const [filterVisible,setFilterVisible] = useState(false)
       const [selectedOption, setSelectedOption] = useState(null);

       const handlePress = (option) => {
         setSelectedOption(option);
       };
     
       // Update the value while keeping the "$" sign fixed
    const slideAnimProfile = new Animated.Value(0);
      const dimAnimProfile = useRef(new Animated.Value(0)).current; // Dim background for profile
          const openProfile = () => {
                if (filterVisible) {
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
                setFilterVisible(! filterVisible); // Toggle the state
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
               setFilterVisible(false);// Make sure dim is hidden
             };

       const handleAmountChange = (text) => {
        // Remove the "$" symbol, and only keep numbers
        let numericValue = text.replace(/[^0-9]/g, ''); 
      
        if (numericValue === "") {
          numericValue = "0";
        }
        
        // If the value starts with "0", remove the leading zero
        if (numericValue.startsWith("0") && numericValue.length > 1) {
          numericValue = numericValue.substring(1); // Remove leading 0
        }
        
        // Update the amount state
        setAmount(numericValue);
      
        // Check if the entered amount exceeds the winningWallet balance
        if (parseInt(numericValue) > profile?.winningWallet) {
          setError('Amount exceeds your available balance');
        } else {
          setError(''); // Clear error if valid
        }
      };
      
    const handleTabPress = (index) => {
     setActiveTab(index);
   };

   const FetchProfile = async () => {
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
      const response = await axios.get(`http://localhost:7070/api/user/get-user/${playerID}`,{
        'Authorization':`Bearer ${token}`
      });

      // Check if the response is successful
      if (response.status === 200) {
        const data = response.data; // The response data should be in the `data` property
        setProfile(data);
        console.log(data); // You can log the profile data here
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

 
   return (
     <View style={{position:'relative'}}>
     <View style={styles.show}>
 
     </View>

     <View style={styles.container}>

       <TouchableOpacity style={{padding:5}} onPress={() => navigation.goBack()} >
    <Image source={require('./assets/back.png')} style={styles.profileImage} />
       </TouchableOpacity>

    <Text style={{color:'#fff',fontSize:16,fontWeight:800}}>Withdrawal</Text>
     </View>
     <View style={{height:'85%',flexDirection:'column',gap:10,marginTop:10}}>
        <View style={{flexDirection:'row',justifyContent:'center'}}>
        <View style={styles.tabContainer}>

        <TouchableOpacity
          style={[styles.tab, activeTab === 0 && styles.activeTab]}
          onPress={() => handleTabPress(0)}
        >
          <Text style={[styles.tabText, activeTab === 0 && styles.activeTabText]}>
           Withdraw Amount
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 1 && styles.activeTab]}
          onPress={() => handleTabPress(1)}
        >
          <Text style={[styles.tabText, activeTab === 1 && styles.activeTabText]}>
            Withdrawal History
          </Text>
        </TouchableOpacity>
      </View>
        </View>
{activeTab ===0 && <View style={{flexDirection:'column',gap:10,}}>
        <View style={{flexDirection:'row',justifyContent:'space-between',paddingHorizontal:20,paddingVertical:10}}>
            <View style={{flexDirection:'row',gap:10}}>
            <Image source={require('./assets/wallet.png')} style={styles.profileImage} />
            <Text>Withdrawal Balance</Text>
            </View>
            <Text>₹{profile?.winningWallet}</Text>
        </View>
     <View style={{padding:20,flexDirection:'column',gap:10,backgroundColor:'#fff'}}>
        <Text style={{fontSize:16,fontWeight:600}}>Enter Amount</Text>
        <View style={styles.inputContainer}>
        <TextInput
            label="Amount"
            mode="outlined"
            keyboardType="numeric"
            maxLength={6}
            value={`₹${amount}`}
            onChangeText={handleAmountChange}
            style={styles.inputField}
            theme={{
              colors: {
                primary: '#000',
                underlineColor: 'transparent',
                background: '#fff',
              },
            }}
          />
        {error && <Text style={{ color: 'red' }}>{error}</Text>}
        </View>
      </View>
      <View style={{paddingHorizontal:20}}>
        <View style={{backgroundColor:'#fff',paddingHorizontal:20,paddingVertical:10}}>
        <Text>UPI</Text>
        <View style={{flexDirection:'column',gap:20,paddingVertical:10}}>

        <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
            <View style={{width:'50%'}}>
            <Image source={require('./assets/gpay.png')} style={{width:50,height:18}}/>
            <Text style={{fontWeight:800}}>Google Pay</Text>
            </View>
            <TouchableOpacity style={styles.button} >
            <Text style={{color:'#fff',fontWeight:800}}>Withdraw {`₹${amount}`}</Text>
          </TouchableOpacity>
        </View>
        <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
            <View style={{width:'50%'}}>
            <Image source={require('./assets/paytm.png')} style={{width:50,height:16}} />
            <Text style={{fontWeight:800}}>Paytm</Text>
            </View>

            <TouchableOpacity style={styles.button} >
                <Text style={{color:'#fff',fontWeight:800}}>
                Withdraw ₹{amount}      
                </Text>
   </TouchableOpacity>
        </View>
        </View>
        </View>
        <View style={{backgroundColor:'#fff',paddingHorizontal:20,paddingVertical:10}}>
          <View style={{flexDirection:'row',justifyContent:'space-between'}}>
          <Text>NETBANKING</Text>
          <Text>show more</Text>
          </View>

        <View style={{flexDirection:'row',justifyContent:'space-between',paddingVertical:10}}>
        <TouchableOpacity
  onPress={() => setActive('Sbi')}
  style={{
    flexDirection: 'column',
    gap: 6,
    alignItems: 'center'
  }}
>
<View style={{padding:2,borderRadius:100,      borderWidth: active === 'Sbi' ? 2 : 2, // Border if active tab is 'Sbi'
      borderColor: active === 'Sbi' ? '#526E48' : 'transparent',}}>
<Image
  source={require('./assets/sbi.jpg')}
  style={[
    styles.bank,
    {
        borderRadius:100,
    }
  ]}
/>
</View>

        <Text>Sbi</Text>
        </TouchableOpacity>
        <TouchableOpacity
  onPress={() => setActive('Citi')}
  style={{
    flexDirection: 'column',
    gap: 6,
    alignItems: 'center',
  }}
>
  <View style={{padding:2,borderRadius:100,      borderWidth: active === 'Citi' ? 2 : 2, // Border if active tab is 'Sbi'
      borderColor: active === 'Citi' ? '#526E48' : '#fff'}}>
  <Image source={require('./assets/citi.png')}   style={[
    styles.bank,
    {
        borderRadius:100,

    }
  ]} />
  </View>

        <Text>Citi</Text>
        </TouchableOpacity>
        <TouchableOpacity
  onPress={() => setActive('Axis')}
  style={{
    flexDirection: 'column',
    gap: 6,
    alignItems: 'center'
  }}
>
<View style={{padding:2,borderRadius:100,      borderWidth: active === 'Axis' ? 2 : 2, // Border if active tab is 'Sbi'
      borderColor: active === 'Axis' ? '#526E48' : '#fff'}}>
        <Image source={require('./assets/axis.jpg')}   style={[
    styles.bank,
    {
        borderRadius:100,
    }
  ]}/>
  </View>
        <Text>Axis</Text>
        </TouchableOpacity>
        <TouchableOpacity
  onPress={() => setActive('Canara')}
  style={{
    flexDirection: 'column',
    gap: 6,
    alignItems: 'center'
  }}
>
<View style={{padding:2,borderRadius:100,      borderWidth: active ==='Canara' ? 2 : 2, // Border if active tab is 'Sbi'
      borderColor: active ==='Canara' ? '#526E48' : '#fff'}}>
        <Image source={require('./assets/canara.jpg')}   style={[
    styles.bank,
    {
        borderRadius:100,

    }
  ]} />
  </View>
        <Text>Canara</Text>
        </TouchableOpacity>
        </View>
        </View>
       
      </View>
      <View style={{paddingHorizontal:20}}>
      <TouchableOpacity style={{flexDirection:'row',alignItems:'center',justifyContent:'center',padding:10,backgroundColor: active !== null ? '#526E48' : '#656879',borderRadius:5}}><Text style={{color:'#fff'}}>Continue</Text></TouchableOpacity>

      </View>
       {/* Content for active tab */}
       </View>}
       {
        activeTab ===1 && <View style={{flexDirection:'column',gap:5}}>
            <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingHorizontal:20,paddingVertical:10}}>
            <Text style={{textAlign:'center',fontSize:14,fontWeight:800}}>Withdrawal History</Text>
       <TouchableOpacity onPress={openProfile} style={{flexDirection:'row'}}>
            <Image style={{width:20,height:20}} source={require('./assets/filter.png')}  />
            <Text style={{textAlign:'center',fontSize:14}}>Filter</Text>
            </TouchableOpacity>

                </View>

            <View style={{flexDirection:'column',gap:2}}>
            <View style={styles.Transactioncard}>
          <View style={styles.cardposition}>
          <Image style={{width:20,height:20}} source={require('./assets/edit.png')}  />
          <View style={styles.cardHeading}>
          <Text>UPI Withdrawal</Text>
          <Text>08 Dec,2024, 12:04 AM</Text>
          </View>

          </View>
          <View>
            <Text style={{color:'#526E48'}}>₹15.00</Text>
            <Text>Successful</Text>
          </View>
        </View>
        </View>
            </View>
       }
     </View>
    {/* <View style={styles.bottomNavbar}>
        <TouchableOpacity onPress style={{flexDirection:'row',gap:5,alignItems:'center'}}>
            <Text>Add via</Text>
            <Image source={require('./assets/down.png')} style={styles.profileImage} />
        </TouchableOpacity>
    <TouchableOpacity style={styles.button} >
            <Text style={{color:'#fff',fontWeight:800}}>Add {`₹${amount}`}</Text>
          </TouchableOpacity>
      </View> */}
            {/* Filter and Profile Modal */}
            {filterVisible && (
                <TouchableWithoutFeedback onPress={closeProfile}>
                    <Animated.View
                        style={[styles.dimBackground, { opacity: dimAnimProfile }]} // Apply animated opacity
                    />
                </TouchableWithoutFeedback>
            )}

            {filterVisible && (
                <Animated.View
                    style={[
                        styles.sidebar,
                        {
                            transform: [{ translateY: slideAnimProfile }],
                            height: Dimensions.get('window').height * 0.2, // 20% height of the screen
                        }
                    ]}
                >
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Filters</Text>
                        {/* Modal content here */}
                        <RadioButton
        label="This month"
        isSelected={selectedOption === 'This Month'}
        onPress={() => handlePress('This Month')}
      />      <RadioButton
      label="Last 3 Month"
      isSelected={selectedOption === 'Last 3 Month'}
      onPress={() => handlePress('Last 3 Month')}
    />      <RadioButton
    label="Last 6 Month"
    isSelected={selectedOption === 'Last 6 Month'}
    onPress={() => handlePress('Last 6 Month')}
  />
      <RadioButton
        label="Last 1 Year"
        isSelected={selectedOption === 'last1Year'}
        onPress={() => handlePress('last1Year')}
      />


                        <TouchableOpacity onPress={closeProfile} style={styles.button}>
                            <Text style={{ color: '#fff' }}>Apply </Text>
                        </TouchableOpacity>
                    </View>
                </Animated.View>
            )}
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
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 70,
    paddingHorizontal: 20,
    backgroundColor: '#526E48',
},
profileImage: {
    width: 20,
    height: 20,
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
sidebar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0, // Position the sidebar at the bottom
    backgroundColor: '#fff',
    zIndex: 999, // Ensure the sidebar is above other components
},
modalContent: {
    flexDirection: 'column',
    gap: 12,
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: '#fff',
    position: 'absolute',
    bottom: 0,
    width: '100%',
},
modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
},
  card:{
    display:'flex',
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:"center",
    padding:10,
    borderRadius:5,
    backgroundColor:'#fff',
    width:'100%'
  },  cardHeading:{
    flexDirection:'column'
  },
  cardposition:{
    flexDirection:'row',
    alignItems:'center',
    gap:10
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
   sidebar: {
     position: 'absolute',
   bottom:0,
     right: 0,

     width: Dimensions.get('window').width * 0.70, // Sidebar takes up 75% of the screen width
     height: '100%',
     width:'100%',
     marginTop:30, // Dark background for the sidebar
     flexDirection:'row',
     justifyContent: 'flex-end', // Align content from the top
     zIndex: 999, // Ensure it appears above other components
   },
   bank:{
   width:40,
   height:40
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
     width:'90%',
     justifyContent:'center',
     backgroundColor:'#fff'
   },
   // Basic style for each tab
   tab: {
    paddingVertical:18,
    paddingHorizontal:24,
    borderRadius:8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:'#fff',
  },
  // Active tab style (changes background color)
  activeTab: {
    backgroundColor: '#526E48', // Green for active tab,

  },
   // Text style for each tab
   tabText: {
     fontWeight: 'bold',
     color: '#000',
     fontSize:14 // Default text color
   },
   // Active text style (changes color when active)
   activeTabText: {
     color: '#fff',
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
     width: 20,
     height: 20,
   },
   button: {
     flexDirection:'row',
     justifyContent:'center',
     gap:4,
     backgroundColor:'#526E48',
     paddingVertical: 12,
     paddingHorizontal: 20,
     borderRadius: 5,
   },
   buttonText: {
     color: '#fff', // blue-500
     fontWeight: 'bold',
 
   },
 });
 
 export default Withdraw;