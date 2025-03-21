import React, { useState,useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet,ScrollView } from 'react-native';
import Section from './section';
import { useNavigation } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';
import { TextInput, Button } from 'react-native-paper';
import { Swipeable } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/MaterialIcons';

const Wallet = () => {
  const [profile,setProfile] = useState()
  const navigation = useNavigation();
  const [playerID,setPlayerID] = useState('');
  const [send,setSend] = useState(false)
  const [activeTab,setActiveTab] = useState(0);
  const [WalletTab,setWalletTab] = useState(0);
  const [requests,setRequests] = useState();
    const playerId = SecureStore.getItemAsync('playerId');
         const [amount, setAmount] = useState("0"); // Default value is "0"
         const handleChange = (text) => {
          setPlayerID(text);
        };
      const handleWalletTab = (id)=>{
        setWalletTab(id)
      }
         const handleAmountChange = (text) => {
          // Remove the "$" symbol, and only keep numbers
          let numericValue = text.replace(/[^0-9]/g, ''); 
          
          // If there's no numeric value, set it back to "0"
          if (numericValue === "") {
            numericValue = "0";
          }
          
          // If the value starts with "0", remove the leading zero
          if (numericValue.startsWith("0") && numericValue.length > 1) {
            numericValue = numericValue.substring(1); // Remove leading 0
          }
          
          setAmount(numericValue); // Update the state with the new value
        };

  const handleTabPress = (id)=>{
     setActiveTab(id)
  }       
  const openKyc = ()=>{
    navigation.navigate('KYCVerification');
   }

  const openWithdrawal = ()=>{
    // setSidebarVisible(false)
    navigation.navigate('Withdraw');
  }

  const openWallet = ()=>{
    navigation.navigate('Profile');
   }

   const openRewards = ()=>{
    navigation.navigate('Rewards');
   }

   
   const openTickets = ()=>{
    navigation.navigate('Ticket');
   }

   const openCashLimit = ()=>{
    navigation.navigate('AddcashLimit');
   }
   
  const openSend = ()=>{
    setSend(!send)
  }

  const EditProfile = ()=>{
    navigation.navigate('EditProfile')
  }

  const openTransaction = ()=>{
    navigation.navigate('Transaction')
  }

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
     headers:{
      'Authorization':`Bearer ${token}`
     }

      });

      // Check if the response is successful
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


  const renderRightActions = (requestId) => (
    <View style={{flexDirection:'column',alignItems:'center',justifyContent:'center',padding:5,gap:5}}>
<TouchableOpacity onPress={()=>{sendMoneyonRequest(requestId)}} style={{flexDirection:'row',backgroundColor:'#526E48',paddingVertical:5,width:60,borderRadius:5,justifyContent:'center'}}><Text style={{color:'#fff',fontWeight:800}}>Send</Text></TouchableOpacity>
<TouchableOpacity onPress={()=>{cancelRequest(requestId)}} style={{flexDirection:'row',backgroundColor:'#E93939',paddingVertical:5,width:60,borderRadius:5,justifyContent:'center'}}><Text style={{color:'#fff',fontWeight:800}}>Delete</Text></TouchableOpacity>
    </View>
  );

  const FetchRequests = async () => {
    const token = await SecureStore.getItemAsync('token');

    const playerID = await SecureStore.getItemAsync('playerId');
    try {

      if (!playerID) {
        console.error('Player ID is not available');
        return;
      }

      const response = await axios.get(`http://localhost:7070/api/user/get-request-details/${playerID}?requestSummaryStatus=Requested`,{
        headers:{
          'Authorization':` Bearer ${token}`
        }
      });

      if (response.status === 200) {
        const data = response.data; // The response data should be in the `data` property
        setRequests(data);
        console.log('Profile data:', data); // You can log the profile data here
      } else {
        console.error('Failed to fetch profile', response.status);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  useEffect(() => {
    FetchRequests(); // Call the function when the component mounts
  }, []);

  useEffect(() => {
    FetchProfile(); // Call the function when the component mounts
  }, []);


  const sendMoneyonRequest = async (requestId) => {
    const playerId = await SecureStore.getItemAsync('playerId');
    const token = await SecureStore.getItemAsync('token');

    try {
      const response = await fetch(`http://localhost:7070/api/user/${requestId}/send-money/on-request`,{
        method: 'POST',
        headers:{
          'Authorization':`Bearer ${token}`
        }
      });

      if(response.ok){
        FetchRequests()
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json(); // Parse response body as JSON
      console.log(data); // Log the data from the response
      console.log('Registered successfully');
    } catch (error) {
      console.error("Error sending money", error);
    }
  }

  const sendMoneyRequest = async (tournamentId) => {
    const token = await SecureStore.getItemAsync('token');
    const playerId = await SecureStore.getItemAsync('playerId');
    try {
      const response = await fetch(`http://localhost:7070/api/user/request-money?requestPlayerId=${playerId}&senderPlayerId=${playerID}&amount=${amount}`,{
        method: 'POST',
        headers:{
          'Authorization':`Bearer ${token}`
        }
      });

      if(response.ok){
       setAmount('');
       setPlayerID('');
       FetchRequests;
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json(); // Parse response body as JSON
      console.log(data); // Log the data from the response
      console.log('Registered successfully');
    } catch (error) {
      console.error("Error sending money", error);
    }
  }

  const sendMoney = async (tournamentId) => {
    const token = await SecureStore.getItemAsync('token');
    const playerId = await SecureStore.getItemAsync('playerId');
    try {
      const response = await fetch(`http://localhost:7070/api/user/send-money?playerId=${playerID}&senderPlayerId=${playerId}&amount=${amount}`,{
        method: 'POST',
        headers:{
          'Authorization':`Bearer ${token}`
        }
      });

      if(response.ok){
        FetchRequests();
       setAmount('');
       setPlayerID('')
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json(); // Parse response body as JSON
      console.log(data); // Log the data from the response
      console.log('Registered successfully');
    } catch (error) {
      console.error("Error sending money", error);
    }
  }

  
  const cancelRequest = async (id) => {
    const token = await SecureStore.getItemAsync('token');
    const playerId = await SecureStore.getItemAsync('playerId');
    try {
      const response = await fetch(`http://localhost:7070/api/user/${id}/update-status/money-request?status=Failed`,{
        method: 'PATCH',
        headers:{
          'Authorization':`Bearer ${token}`
        }
      });

      if(response.ok){
        FetchRequests();
       setAmount('');
       setPlayerID('')
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json(); // Parse response body as JSON
      console.log(data); // Log the data from the response
      console.log('Registered successfully');
    } catch (error) {
      console.error("Error sending money", error);
    }
  }
 const total = parseInt(profile?.inGameWallet)+parseInt(profile?.winningWallet)
  return (
    <View style={{flex:1}}>
    <View style={styles.show}>

    </View>
    <View style={styles.container}>
      {/* Profile Image */}
      <View style={{flexDirection:'row',alignItems:'center'}}>
      <Image source={require('./assets/profile.png')} style={styles.profileImage} />
      <View>
        <Text style={styles.buttonText}>{profile?.name}</Text>
        <Text style={{fontSize:10,color:'#E8E0DD',width:90}}>{profile?.playerId}</Text>
      </View>
      </View>
      <TouchableOpacity onPress={EditProfile} style={{padding:10,flexDirection:'row',gap:1,backgroundColor:'#fff',borderRadius:5}}>
      <Image style={{width:20,height:20}} source={require('./assets/editt.png')}  />
        <Text style={{color:'#526E48',fontWeight:800}}>Edit Profile</Text>
      </TouchableOpacity>
    </View>
    <ScrollView style={{backgroundColor:'#E8E0DD',flex:1}}>
      <View style={{paddingHorizontal:20,paddingVertical:10,flexDirection:'column',gap:20}}>
        <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',backgroundColor:'#fff',borderRadius:5}}>
          <TouchableOpacity onPress={()=>handleWalletTab(0)}   style={[styles.tab, WalletTab === 0 && styles.activeTab]}>
          <Text style={[styles.tabText, WalletTab === 0 && styles.activeTabText]}>My Wallet</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={()=>handleWalletTab(1)}   style={[styles.tab, WalletTab === 1 && styles.activeTab]}>
        <Text style={[styles.tabText, WalletTab === 1 && styles.activeTabText]}>Cash Request</Text>
      </TouchableOpacity>
        </View>
        {WalletTab===1 &&
        <View >

     <View style={styles.tabContainer}>
         <TouchableOpacity
           style={[styles.tab, activeTab === 0 && styles.activityTab]}
           onPress={() => handleTabPress(0)}
         >
           <Text style={[styles.tabText, activeTab === 0 && styles.activeTabText]}>
            Send
           </Text>
         </TouchableOpacity>

         <TouchableOpacity
           style={[styles.tab, activeTab === 1 && styles.activityTab]}
           onPress={() => handleTabPress(1)}
         >
           <Text style={[styles.tabText, activeTab === 1 && styles.activeTabText]}>
             Request
           </Text>
         </TouchableOpacity>
         <TouchableOpacity
           style={[styles.tab, activeTab === 2 && styles.activityTab]}
           onPress={() => handleTabPress(2)}
         >
           <Text style={[styles.tabText, activeTab === 2 && styles.activeTabText]}>
             Received
           </Text>
         </TouchableOpacity>
       </View>
       {activeTab ===0 &&
        <View style={{flexDirection:'column',gap:10,backgroundColor:'#fff',padding:10,borderRadius:5,marginTop:20}}>
   <Text>Enter Player ID</Text>
     <TextInput
            mode="outlined"
            maxLength={24}
            onChangeText={handleChange}
            value={playerID}
            style={styles.input}
            labelStyle={{ fontSize: 6 }} 
            theme={{
              colors: {
                primary: '#000', // Border color when active (focus)
                underlineColor: 'transparent', // Disable underline
                background: '#fff', // Background color
              },
            }
          }            
          />
      
        <TextInput
            label="Amount"
            mode="outlined"
            keyboardType="numeric"
            maxLength={6}
            value={`₹${amount}`}
            onChangeText={handleAmountChange}
            style={styles.input}
            theme={{
              colors: {
                primary: '#000', // Border color when active (focus)
                underlineColor: 'transparent', // Disable underline
                background: '#fff', // Background color
              },
            }}
          />
          <TouchableOpacity onPress={sendMoney}  style={{backgroundColor:"#526E48",padding:8,borderRadius:5,flexDirection:'row',alignItems:'center',justifyContent:'center'}}>
            <Text style={{color:'#fff',fontWeight:700}}>Send Cash</Text>
          </TouchableOpacity>
        </View>
       }

{activeTab ===1 &&
        <View style={{flexDirection:'column',gap:10,backgroundColor:'#fff',padding:10,borderRadius:5,marginTop:20}}>
   <Text>Enter Player ID</Text>
     <TextInput
            mode="outlined"
            keyboardType="numeric"
            maxLength={24}
            onChangeText={handleChange}
            value={playerID}
            style={styles.input}
            labelStyle={{ fontSize: 6 }} 
            theme={{
              colors: {
                primary: '#000', // Border color when active (focus)
                underlineColor: 'transparent', // Disable underline
                background: '#fff', // Background color
              },
            }
          }
          />

        <TextInput
            label="Amount"
            mode="outlined"
            keyboardType="numeric"
            maxLength={6}
            value={`₹${amount}`}
            onChangeText={handleAmountChange}
            style={styles.input}
            theme={{
              colors: {
                primary: '#000', // Border color when active (focus)
                underlineColor: 'transparent', // Disable underline
                background: '#fff', // Background color
              },
            }}
          />
          <TouchableOpacity onPress={sendMoneyRequest} style={{backgroundColor:"#526E48",padding:8,borderRadius:5,flexDirection:'row',alignItems:'center',justifyContent:'center'}}>
            <Text style={{color:'#fff',fontWeight:700}}>Request Cash</Text>
          </TouchableOpacity>
        </View>
       }

{activeTab ===2 &&
        <View style={{flexDirection:'column',gap:10,backgroundColor:'#fff',borderRadius:5,marginTop:20,padding:10}}>
          <Text style={{fontSize:16,fontWeight:800}}>Received Requests</Text>
   {requests && requests?.map((request, index) => (
        <Swipeable key={index}renderRightActions={() => renderRightActions(request?.id)}>
          <View style={styles.requestContainer}>
            <Image style={styles.profileImage} source={require('./assets/profile.png')} />
            <View>
            <Text style={styles.requestText}>{request?.requestPlayerId}</Text>
            <Text style={{fontWeight:800,fontSize:18}}>₹{request?.amount}</Text>
            </View>

          </View>
        </Swipeable>
      ))}

        </View>
       }
       </View>
        }

        {WalletTab===0 &&
        <View style={{flexDirection:'column',gap:20}}>
          
          <View style={styles.card}>
          <View style={styles.cardposition}>
          <Image style={{width:30,height:30}} source={require('./assets/practice.png')}  />
          <View style={styles.cardHeading}>
          <Text style={styles.heading}>Practice Chips</Text>
          <Text style={{fontSize:12,fontWeight:500}}>{profile?.chips}</Text>
          </View>
          </View>
        </View>

        <View style={styles.columncard}>
          <View style={{flexDirection:'row',justifyContent:'space-between',width:'100%',alignItems:'center',backgroundColor:'#3BEBDBC',padding:10}}>
            <View>
          <Text style={styles.heading}>Total balance</Text>
          <Text>₹{total}</Text>
          </View>
          <TouchableOpacity onPress={openCashLimit}>
            <Text style={styles.heading}>Deposit Limit</Text>
          </TouchableOpacity>
          </View>
          <View style={styles.card}>
          <View style={styles.cardposition}>
          <Image style={{width:30,height:30}} source={require('./assets/wallet.png')}  />
          <View style={styles.cardHeading}>
          <Text style={styles.heading}>Deposit balance</Text>
          <Text>₹{profile?.inGameWallet}</Text>
          </View>

          </View>
          <TouchableOpacity onPress={openKyc} style={styles.buttonoutline}>
            <Text>Learn more</Text>
            <Image style={{width:15,height:15}} source={require('./assets/next.png')}  />
          </TouchableOpacity>
        </View>        <View style={styles.card}>
          <View style={styles.cardposition}>
          <Image style={{width:30,height:30}} source={require('./assets/withdraw.png')}  />
          <View style={styles.cardHeading}>
          <Text style={styles.heading}>Withdrawal balance</Text>
          <Text>₹{profile?.winningWallet}</Text>
          </View>

          </View>
          <TouchableOpacity onPress={openWithdrawal} style={styles.buttonoutline}>
            <Text>Learn more</Text>
            <Image style={{width:15,height:15}} source={require('./assets/next.png')}  />
          </TouchableOpacity>
        </View>




        </View>
        <View style={{backgroundColor:'#fff',padding:16,borderRadius:5}}>
        <View style={{flexDirection:'row',alignItems:'flex-start',justifyContent:'center', gap:40,}}>
          <TouchableOpacity onPress={openRewards}  style={{flexDirection:'column',justifyContent:'center',gap:4,alignItems:'center'}}>
          <View style={{flexDirection:'column',borderRadius:100,borderWidth:1,borderColor:'transparent',paddingVertical:8,paddingHorizontal:8,backgroundColor:"#39B293"}}>
          <View style={{flexDirection:'column',borderRadius:100,borderWidth:1,borderColor:'transparent',paddingVertical:5,paddingHorizontal:6,backgroundColor:"#fff"}}>
          <Image style={{width:30,height:30}} source={require('./assets/bonus.png')}  />
          </View>
          </View>
          <Text style={styles.heading}>Bonus</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={openTickets} style={{flexDirection:'column',borderColor:'#242423',gap:4,alignItems:'center'}}>
          <View style={{flexDirection:'column',borderRadius:100,borderWidth:1,borderColor:'transparent',paddingVertical:8,paddingHorizontal:8,backgroundColor:"#39B293"}}>
          <View style={{flexDirection:'column',borderRadius:100,borderWidth:1,borderColor:'transparent',paddingVertical:5,paddingHorizontal:6,backgroundColor:"#fff"}}>
          <Image style={{width:28,height:30}} source={require('./assets/ticket.png')}  />
          </View>
          </View>
          <Text style={styles.heading}>Ticket</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={openRewards}  style={{flexDirection:'column',gap:4,alignItems:'center'}}>
          <View style={{flexDirection:'column',borderRadius:100,borderColor:'transparent',borderWidth:1,paddingVertical:8,paddingHorizontal:8,backgroundColor:"#39B293"}}>
          <View style={{flexDirection:'column',borderRadius:100,borderColor:'transparent',borderWidth:1,paddingVertical:5,paddingHorizontal:6,width:45,backgroundColor:"#fff"}}>
          <Image style={{width:30,height:30}} source={require('./assets/loyalty.png')}  />
          </View>
          </View>
          <Text style={styles.heading}>Loyalty Points</Text>
          </TouchableOpacity>
        </View>
          </View>

        {/* <View style={styles.card}>
          <View style={styles.cardposition}>
          <Image style={{width:30,height:30}} source={require('./assets/bonus.png')}  />
          <View style={styles.cardHeading}>
          <Text style={styles.heading}>Bonus</Text>
          <Text>₹0</Text>
          </View>

          </View>
          <TouchableOpacity onPress={openRewards} style={styles.buttonoutline}>
            <Text>Learn more</Text>
            <Image style={{width:15,height:15}} source={require('./assets/next.png')}  />
          </TouchableOpacity>
        </View>
        <View style={styles.card}>
          <View style={styles.cardposition}>
          <Image style={{width:30,height:30}} source={require('./assets/ticket.png')}  />
          <View style={styles.cardHeading}>
          <Text style={styles.heading}>Tournament Tickets</Text>
          <Text>₹0</Text>
          </View>
          </View>
          <TouchableOpacity onPress={openTickets} style={styles.buttonoutline}>
            <Text>Redeem</Text>
            <Image style={{width:15,height:15}} source={require('./assets/next.png')}  />
          </TouchableOpacity>
        </View>
        <View style={styles.card}>
          <View style={styles.cardposition}>
          <Image style={{width:30,height:30}} source={require('./assets/loyalty.png')}  />
          <View style={styles.cardHeading}>
          <Text style={styles.heading}>Loyalty Points</Text>
          <Text>₹0</Text>
          </View>

          </View>
          <TouchableOpacity style={styles.buttonoutline}>
            <Text>Learn more</Text>
            <Image style={{width:15,height:15}} source={require('./assets/next.png')}  />
          </TouchableOpacity>
        </View> */}
<View style={{flexDirection:'column',gap:20}}>

      <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
          <Text style={{fontWeight:800,fontSize:16}}>Transaction History</Text>
         <TouchableOpacity onPress={openTransaction}>
         <Text style={{fontSize:12}}>View all</Text>
          </TouchableOpacity> 
        </View>
        <View>
        <View style={styles.Transactioncard}>
          <View style={styles.cardposition}>
          <Image style={{width:20,height:20}} source={require('./assets/edit.png')}  />
          <View style={styles.cardHeading}>
          <Text style={styles.heading}>Other Transaction</Text>
          <Text style={{fontSize:10}}>08 Dec,2024, 12:17 AM</Text>
          </View>

          </View>
          <View>
          <Text style={{fontSize:12}}>-₹5.00</Text>
          </View>
        </View>
        <View style={styles.Transactioncard}>
          <View style={styles.cardposition}>
          <Image style={{width:20,height:20}} source={require('./assets/edit.png')}  />
          <View style={styles.cardHeading}>
          <Text style={styles.heading}>Other Transaction</Text>
          <Text style={{fontSize:10}}>08 Dec,2024, 12:04 AM</Text>
          </View>

          </View>
          <View>
            <Text style={{fontSize:12}}>-₹15.00</Text>
          </View>
        </View>
          </View>
          </View>
          </View>}


        </View>

    </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal:20,
    height:96,
    backgroundColor: '#526E48', // blue-500
  },
  requestContainer: {
    backgroundColor: '#f4f4f4',
    padding: 8,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  chips:{
    flexDirection:'column',
    alignItems:'center'
  },
  cardHeading:{
    flexDirection:'column'
  },
  cardposition:{
    flexDirection:'row',
    alignItems:'center',
    gap:10
  },
  show:{
    width: '100%',
    height: 32,
    backgroundColor:'#fff'
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
    width: 72,
    height: 72,
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
    gap:4,
    padding:10,
    borderWidth:1,
    borderRadius:5,
    backgroundColor:'#fff',
    borderColor:'#BEBDBC'
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor:'#fff',
    borderRadius:10
  },
  // Basic style for each tab
  tab: {
   height:40,
    flex:1,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:'#fff'
  },
  // Active tab style (changes background color)
  activeTab: {
    backgroundColor: '#526E48',
  },
  activityTab: {
    backgroundColor: '#526E48',
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
  input: {
    height: 40,
    borderColor: '#ccc',
    fontSize: 20,
    backgroundColor:'#fff',
    borderRadius:5,
  },
  heading:{
    fontSize:12
  }
});

export default Wallet;