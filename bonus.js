import React, { useState,useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet,ScrollView,Animated,Easing } from 'react-native';
import Section from './section';
import { useNavigation } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';
import { Badge } from 'react-native-paper';

const HonourPoints = () => {
  const [profile,setProfile] = useState()
  const navigation = useNavigation();

  const EditProfile = ()=>{
    navigation.navigate('EditProfile')
  }
 
  const [active,setActive] = useState(1);
  const [image,setImage] = useState();
  const [rotation] = useState(new Animated.Value(0));
  const [translateX] = useState(new Animated.Value(0));
  const [badge,setBadge] = useState('');

  // Handle section change with 360 slide animation
  const handleActiveSection = (id) => {
    if (id !== active) {
    
      Animated.sequence([

        Animated.timing(rotation, {
          toValue: 360, // Rotate 360 degrees
          duration: 200,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
        Animated.timing(translateX, {
          toValue: id * -360,
          duration: 200,
          easing: Easing.ease,
          useNativeDriver: true,
        }),

        Animated.timing(rotation, {
          toValue: 0,
          duration: 200,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
        Animated.timing(translateX, {
          toValue: 0,
          duration: 200,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
      ]).start();
      setTimeout(() => {
        setActive(id);
      }, 800);
    }
  };

  useEffect(() => {

    translateX.setValue(0);
  }, []);

  const FetchProfile = async () => {
    const playerID = '677fee503750c327daac53c2'
    const token = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJzcmVlbWFudmtAZ21haWwuY29tIiwiaXNzIjoic2FkZXRlY2gtcnVtbXkiLCJyb2xlcyI6WyJVU0VSIl0sInBsYXllcklkIjoiNjc3ZmVlNTAzNzUwYzMyN2RhYWM1M2MyIiwiaWF0IjoxNzQyMjE4NTYyLCJleHAiOjE3NDIzMDQ5NjJ9._-qKxpgrHLj0UKadRW5ZTGqwGDhfWarEL_bIEzzsOTk'
    try {
      // Fetch the player ID from SecureStore
 // Ensure the player ID is being retrieved properly

      if (!playerID) {
        console.error('Player ID is not available');
        return;
      }

      // Make the API request using axios
      const response = await axios.get(`http://localhost:7070/api/user/get-user/677fee503750c327daac53c2`,{
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


  useEffect(() => {
    FetchProfile(); // Call the function when the component mounts
  }, []);

  useEffect(() => {
    // Range checking using if-else
    if (profile?.loyaltyPoint >= 0 && profile?.loyaltyPoint <= 49) {
      setImage(require('./assets/bronze.png'));
      setBadge('Bronze')
    } else if (profile?.loyaltyPoint >= 50 && profile?.loyaltyPoint <= 499) {
      setImage(require('./assets/third.png'));
      setBadge('Silver')
    } else if (profile?.loyaltyPoint >= 500 && profile?.loyaltyPoint <= 4999) {
      setImage(require('./assets/second.png'));
      setBadge('Gold')
    } else if(profile?.loyaltyPoint >= 5000 && profile?.loyaltyPoint <= 8999) {
      setImage(require('./assets/fourth.png'));
      setBadge('Diamond')
    } else if(profile?.loyaltyPoint >= 9000 && profile?.loyaltyPoint <= 10000) {
      setImage(require('./assets/fifth.png'));
      setBadge('Platinum')
    }
  }, [profile]);

  return (
    <View style={{flex:1,backgroundColor:'#499C1D'}}>
    <View style={styles.show}>

    </View>


    <ScrollView style={{backgroundColor:'#526E48',flex:1}}>

    <View style={styles.container}>
       {/* Profile Image */}
       <TouchableOpacity style={{padding:5}} onPress={() => navigation.goBack()}>
       <Image source={require('./assets/back.png')} style={{width:20,height:20}} />
       </TouchableOpacity>
 
    <Text style={{color:'#fff',fontSize:16,fontWeight:800}}></Text>
     </View>
      <View style={{paddingHorizontal:20,paddingVertical:10,flexDirection:'column',gap:20}}>
        <View style={{flexDirection:'column',gap:2,justifyContent:'center',alignItems:'center'}}>
          <Text style={{fontSize:14,color:'#fff'}}>Welcome to</Text>
          <Text style={{fontWeight:800,fontSize:16,color:'#fff'}}>Welcome to Honour Points</Text>
          <View style={{flexDirection:"column",gap:4,justifyContent:'center',alignItems:'center'}}>
          <Text style={{color:'#fff'}}>{badge} Hub</Text>
          {image && <Image source={image} style={{ width: 100, height: 100 }} />}
          <Text style={{color:'#fff'}}>{profile?.loyaltyPoint} Points</Text>
          </View>
   
        </View>
        <View style={styles.card}>
          <View style={styles.cardposition}>
          <Image style={{width:20,height:20}} source={require('./assets/edit.png')}  />
          <View style={styles.cardHeading}>
          <Text style={{fontWeight:700}}>Earn Honour Points</Text>
          <Text style={{fontSize:10}}>play cash games to win points</Text>
          </View>
          </View>
          <TouchableOpacity style={styles.button}>
            <Text style={{color:'#fff'}}>Play Now</Text>
          </TouchableOpacity>
        </View>
        <View style={{flexDirection:"column",gap:10}}>
        <Text style={{color:'#FFF'}}>How Honour Points work?</Text>
        <View style={styles.columncard}>
   
          <View style={styles.card}>
          <View style={styles.cardposition}>
          <Image style={{width:20,height:20}} source={require('./assets/edit.png')}  />
          <View style={styles.cardHeading}>
          <Text style={{fontSize:12}}>Play Cash Rummy Games</Text>
          <Text style={{fontSize:10}}>Earn 1 Honour Points for every ₹100 cash game</Text>
          </View>
          </View>
        </View>        
           
        <View style={styles.card}>
        
          <View style={styles.cardposition}>
          <Image style={{width:20,height:20}} source={require('./assets/edit.png')}  />
          <View style={styles.cardHeading}>
          <Text style={{fontSize:12}}>Redeem Cash and Join Tournaments</Text>
          <Text style={{fontSize:10}}>Using uyou Honour Points</Text>
          </View>
          </View>
        
        </View>
           
        <View style={styles.card}>
          <View style={styles.cardposition}>
          <Image style={{width:20,height:20}} source={require('./assets/edit.png')}  />
          <View style={styles.cardHeading}>
          <Text style={{fontSize:12}}>Play more to Earn more Honour Points</Text>
          <Text style={{fontSize:10}}>Win more to reach big club and win exciting prizes</Text>
          </View>
          </View>

        </View>
        </View>
        </View>
        <View style={{flexDirection:'column',alignItems:"center"}}>
          <Text style={{fontWeight:700,color:'#fff'}}>What are Honour Hubs</Text>
          <Text style={{fontSize:10,color:'#fff',textAlign:'center'}}>Levels of Honour that are achieved by earning more Honour points, Each Honour club has its own Exclusive benefits

          </Text>
          </View>
          <View>
          <View style={{flexDirection:'row',gap:10,justifyContent:'center'}}>
            <TouchableOpacity style={{flexDirection:'column',gap:10}}  onPress={()=>{handleActiveSection(1)}}>
            <Image style={{width:55,height:55}} source={require('./assets/bronze.png')}  />

            </TouchableOpacity>
            <TouchableOpacity style={{flexDirection:'column',gap:10}}   onPress={()=>{handleActiveSection(2)}}>

            <Image style={{width:55,height:55}} source={require('./assets/third.png')}  />

            </TouchableOpacity>
            <TouchableOpacity style={{flexDirection:'column',gap:10}}  onPress={()=>{handleActiveSection(3)}}>
            <Image style={{width:55,height:55}} source={require('./assets/second.png')}  />

            </TouchableOpacity>
            <TouchableOpacity style={{flexDirection:'column',gap:10}}  onPress={()=>{handleActiveSection(4)}}>

            <Image style={{width:55,height:55}} source={require('./assets/fourth.png')}  />

            </TouchableOpacity>
            <TouchableOpacity style={{flexDirection:'column',gap:10}}  onPress={()=>{handleActiveSection(5)}}>
            <Image style={{width:55,height:55}} source={require('./assets/fifth.png')}  />

            </TouchableOpacity>
          </View>
          <Animated.View
            style={[
              styles.activeSection,
              {
                transform: [{ translateX }], // Apply the slide animation
              },
            ]}
          >
          {active === 1 &&   <View style={{backgroundColor:'#fff',width:'100%',height:150,borderRadius:5,padding:10,flexDirection:'column',gap:10,position:'relative'}}>
            <View style={{flexDirection:'row',alignItems:'center',position:'absolute',top:0}}>
            <View style={{width:'20%',borderBottomWidth:2, borderColor: active === 1 ? '#000' : '#FFF',  }}>
                </View>
                <View style={{width:'20%',borderBottomWidth:2, borderColor: active === 2 ? '#000' : '#fff',  }}>
                </View>
                <View style={{width:'20%',borderBottomWidth:2, borderColor: active === 3 ? '#000' : '#fff',  }}>
                </View>
                <View style={{width:'20%',borderBottomWidth:2, borderColor: active === 4 ? '#000' : '#fff',  }}>
                </View>
                <View style={{width:'20%',borderBottomWidth:2, borderColor: active === 5 ? '#000' : '#fff',  }}>
                </View>
                </View>
           <View>
                <Text>BRONZE HUB</Text>
            </View>
            <View>
                <View>
                <Text style={{fontSize:12}}>Eligibility</Text>
                <Text style={{fontSize:10}}>0 Honour Points needed to join the Bronze Club </Text>
                </View>
                <View>
                <Text style={{fontSize:12}}>Instant Cash</Text>
                <Text style={{fontSize:10}}>250 Honour Points needed to join the Bronze Club </Text>
                </View>
                <View>
                <Text style={{fontSize:12}}>Loyalty Tournaments</Text>
                <Text style={{fontSize:10}}>250 Honour Points needed to join the Bronze Club </Text>
                </View>
            </View>
         
          </View>   }
          {active === 3&&   <View style={{backgroundColor:'#fff',width:'100%',height:150,borderRadius:5,padding:10,flexDirection:'column',gap:10}}>
           <View>
                <Text>GOLD HUB</Text>
            </View>
            <View>
                <View>
                <Text style={{fontSize:12}}>Eligibility</Text>
                <Text style={{fontSize:10}}>50 Honour Points needed to join the Bronze Club </Text>
                </View>
                <View>
                <Text style={{fontSize:12}}>Instant Cash</Text>
                <Text style={{fontSize:10}}>250 Honour Points needed to join the Bronze Club </Text>
                </View>
                <View>
                <Text style={{fontSize:12}}>Loyalty Tournaments</Text>
                <Text style={{fontSize:10}}>250 Honour Points needed to join the Bronze Club </Text>
                </View>
            </View>
         
          </View>   }
          {active === 4 &&   <View style={{backgroundColor:'#fff',width:'100%',height:150,borderRadius:5,padding:10,flexDirection:'column',gap:10}}>
           <View>
                <Text>DIAMOND HUB</Text>
            </View>
            <View>
                <View>
                <Text style={{fontSize:12}}>Eligibility</Text>
                <Text style={{fontSize:10}}>500 Honour Points needed to join the Bronze Club </Text>
                </View>
                <View>
                <Text style={{fontSize:12}}>Instant Cash</Text>
                <Text style={{fontSize:10}}>250 Honour Points needed to join the Bronze Club </Text>
                </View>
                <View>
                <Text style={{fontSize:12}}>Loyalty Tournaments</Text>
                <Text style={{fontSize:10}}>250 Honour Points needed to join the Bronze Club </Text>
                </View>
            </View>
         
          </View>   }
          {active === 5&&   <View style={{backgroundColor:'#fff',width:'100%',height:150,borderRadius:5,padding:10,flexDirection:'column',gap:10}}>
           <View>
                <Text>PLATINUM HUB</Text>
            </View>
            
            <View>
                <View>
                <Text style={{fontSize:12}}>Eligibility</Text>
                <Text style={{fontSize:10}}>5000 Honour Points needed to join the Bronze Club </Text>
                </View>
                <View>
                <Text style={{fontSize:12}}>Instant Cash</Text>
                <Text style={{fontSize:10}}>250 Honour Points needed to join the Bronze Club </Text>
                </View>
                <View>
                <Text style={{fontSize:12}}>Loyalty Tournaments</Text>
                <Text style={{fontSize:10}}>250 Honour Points needed to join the Bronze Club </Text>
                </View>
            </View>
         
          </View>   }
          {active === 2&&   <View style={{backgroundColor:'#fff',width:'100%',height:150,borderRadius:5,padding:10,flexDirection:'column',gap:10}}>
           <View>
                <Text>SILVER HUB</Text>
            </View>
            <View>
                <View>
                <Text style={{fontSize:12}}>Eligibility</Text>
                <Text style={{fontSize:10}}>9000 Honour Points needed to join the Bronze Club </Text>
                </View>
                <View>
                <Text style={{fontSize:12}}>Instant Cash</Text>
                <Text style={{fontSize:10}}>250 Honour Points needed to join the Bronze Club </Text>
                </View>
                <View>
                <Text style={{fontSize:12}}>Loyalty Tournaments</Text>
                <Text style={{fontSize:10}}>250 Honour Points needed to join the Bronze Club </Text>
                </View>
            </View>
         
          </View>   }
          </Animated.View>
          </View>
<View style={{flexDirection:'row',justifyContent:'space-between',position:'relative'}}>
  <View style={{position:'absolute',borderWidth:2,borderColor:'#C8C8C8',width:'100%',marginTop:22}}></View>
  {profile?.loyaltyPoint >= 0 && profile?.loyaltyPoint <= 49 ? (
    <View style={styles.activeBadge}>
  <Image
  style={{width:25,height:25}}
    source={require('./assets/bronze.png')} // Your active badge
  />
  </View>
) : (
  <View style={styles.badge}>
  <Image
  style={{width:25,height:25}}
    source={require('./assets/bronze.png')} // Your active badge
  />
  </View>
)}
  {profile?.loyaltyPoint >= 50 && profile?.loyaltyPoint <= 499 ? (
    <View style={styles.activeBadge}>
  <Image
  style={{width:25,height:25}}
    source={require('./assets/third.png')} // Your active badge
  />
  </View>
) : (
  <View style={styles.badge}>
  <Image
  style={{width:25,height:25}}
    source={require('./assets/third.png')} // Your active badge
  />
  </View>
)}
  {profile?.loyaltyPoint >= 500 && profile?.loyaltyPoint <= 4999 ? (
    <View style={styles.activeBadge}>
  <Image
  style={{width:25,height:25}}
    source={require('./assets/second.png')} // Your active badge
  />
  </View>
) : (
  <View style={styles.badge}>
  <Image
  style={{width:25,height:25}}
    source={require('./assets/second.png')} // Your active badge
  />
  </View>
)}
  {profile?.loyaltyPoint >= 5000 && profile?.loyaltyPoint <= 8999 ? (
    <View style={styles.activeBadge}>
  <Image
  style={{width:25,height:25}}
    source={require('./assets/fourth.png')} // Your active badge
  />
  </View>
) : (
  <View style={styles.badge}>
  <Image
  style={{width:25,height:25}}
    source={require('./assets/fourth.png')} // Your active badge
  />
  </View>
)}
  {profile?.loyaltyPoint >= 9000 && profile?.loyaltyPoint <= 10999 ? (
    <View style={styles.activeBadge}>
  <Image
  style={{width:25,height:25}}
    source={require('./assets/fifth.png')} // Your active badge
  />
  </View>
) : (
  <View style={styles.badge}>
  <Image
  style={{width:25,height:25}}
    source={require('./assets/fifth.png')} // Your active badge
  />
  </View>
)}

</View>

        <View style={styles.card}>
          <View style={styles.cardposition}>
          <Image style={{width:20,height:20}} source={require('./assets/edit.png')}  />
          <View style={styles.cardHeading}>
          <Text>Tournament Tickets</Text>
          <Text>₹0</Text>
          </View>

          </View>
          <View style={styles.buttonoutline}>
            <Text>Redeem</Text>
            <Image style={{width:15,height:15}} source={require('./assets/next.png')}  />
          </View>
        </View>
        <View style={styles.card}>
          <View style={styles.cardposition}>
          <Image style={{width:20,height:20}} source={require('./assets/edit.png')}  />

          </View>
          <TouchableOpacity style={styles.buttonoutline}>
            <Text>Learn more</Text>
            <Image style={{width:15,height:15}} source={require('./assets/next.png')}  />
          </TouchableOpacity>
        </View>
        
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

  },
  chips:{
    flexDirection:'column',
    alignItems:'center'
  },
  activeSection: {
    width: '100%', // Ensure the section takes up the full width
    height: 200, // Adjust the height as per your content
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 10,
  },
  activeBadge:{
    padding: 10,
    borderRadius: 100, // Adjust to your shape
    borderWidth: 2,
    borderColor: '#FDC939',
    backgroundColor: '#CDCACA',
    shadowColor: '#FDC939',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9, // Stronger glow
    shadowRadius: 25, // Massive spread
    elevation: 20, // For Android shadow
  },
  badge:{
    padding: 10,
    borderRadius: 100, // Adjust to your shape
    backgroundColor: '#CDCACA',
  },
  cardHeading:{
    flexDirection:'column'
  },
  cardposition:{
    flexDirection:'row',
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
    backgroundColor:'#53AF67',
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
  }
});

export default HonourPoints;