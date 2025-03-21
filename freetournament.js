import React, { useEffect, useState } from "react";
import { View, Text,Image,ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from "@react-navigation/native";

const AllTournament =()=>{
  const navigation = useNavigation()
  const [tournament,setTournament] = useState()
  const openTournamentDetails = (tournamentId) => {
    // Navigate and pass the tournament ID as a parameter
    navigation.navigate('TournamentDetailsById', { tournamentId });
  };
    const [isJoinDisabled,setIsJoinDisabled] = useState(false)
  const FetchTournamentDetails = async () => {
          const token = await SecureStore.getItemAsync('token');
    try {
      // Fetch the tournament details
      const response = await fetch(
      `http://localhost:7070/api/tournament/get-all-tournament`,
        {
          method: 'GET',
          headers:{
           'Authorization': `Bearer ${token}`
          }
        }
      );
  
      // Check if the response is ok (status 200-299)
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      // Parse the response body to JSON
      const data = await response.json();
  
      // Set the tournament data in state
      setTournament(data);

      console.log(data?.entryFee);
  
    } catch (error) {
      console.error("Error fetching tournament details:", error);
      console.log(error);
    }
  }

  useEffect(()=>{
    FetchTournamentDetails()
  },[])

      const JoinTournament = async (tournamentId) => {
        const token = await SecureStore.getItemAsync('token');
        const playerId = await SecureStore.getItemAsync('playerId');
        try{
          const response = await fetch(`http://localhost:7070/api/tournament/join/${tournamentId}?playerId=${playerId}`,{
            method: 'PATCH',
            headers:{
              'Authorization':`Bearer ${token}`
            }
          });
  
          if(response.ok){
            FetchTournamentDetails();
          }
  
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

    useEffect(() => {
      const fetchPlayerIdAndCheck = async () => {
        const playerId = await SecureStore.getItemAsync('playerId');
        
        if (tournament && playerId) {

          const isPlayerAlreadyInTournament = tournament.map((tournaments)=>tournaments.playerId.some(id => id === playerId));
      
          if (isPlayerAlreadyInTournament) {
            setIsJoinDisabled(true);
            console.log('joined')

          } else {
            setIsJoinDisabled(false);
            console.log('error')

          }
        }
      };
    
      fetchPlayerIdAndCheck();
    }, [tournament]);
    return(
      <View style={{}}>

    <ScrollView style={{height:600}}>
    <View style={{flexDirection:'column',gap:20,marginBottom:200}}>
      {tournament?.map((Tournaments)=>
      {
        const dateStr = Tournaments?.matchStartingAt;
        const date = new Date(dateStr);
        
        // Format the date without the year
        const formattedDate = date.toLocaleString('en-US', {
          month: 'long', // e.g., 'December'
          day: 'numeric', // e.g., '26'
          hour: 'numeric', // e.g., '4'
          minute: 'numeric', // e.g., '00'
          hour12: true // Use 12-hour clock format (AM/PM)
        });
        return( 
          <View>
          <View key={Tournaments.id} style={styles.Tournamentcard}>
     <View style={styles.cardHeading}>
    <Text style={styles.headingtext}>
        Jumbo Jackpot 1.5L Guaranteed
    </Text>
    <TouchableOpacity onPress={()=>openTournamentDetails(Tournaments.id)} style={{flexDirection:'row',alignItems:'center'}}>
    <Text style={styles.headingtext}>Details</Text>
    <Image style={{width:12,height:12}} source={require('./assets/next.png')}  />
    </TouchableOpacity>
   
     </View>
     <TouchableOpacity onPress={()=>openTournamentDetails(Tournaments.id)} style={styles.price}>
      <View>
      <View style={{width:180,flexDirection:'row',gap:2}}>
      <Image style={{width:30,height:30}} source={require('./assets/trophy.png')}  />
      <View>
      <Text style={{fontSize:20,fontWeight:800}}>₹{Tournaments?.grandTotal}</Text>

      </View>

      </View>
      <Text style={{fontSize:12,color:'#D71919',width:'80%'}}>{Tournaments?.description}</Text>
      </View>

      <View style={{flexDirection:"column",gap:10,alignItems:'center',}}>
      <Text>Entry: {Tournaments?.entryFee===0 ? Tournaments?.tournamentType : <Text>₹{Tournaments?.entryFee}</Text>}</Text>
{isJoinDisabled?  <TouchableOpacity style={styles.inactivebutton}>
        <Text style={{color:'#fff',fontWeight:800}}>Joined</Text>
    </TouchableOpacity> : <TouchableOpacity onPress={()=>JoinTournament(Tournaments.id)} style={styles.button}>
        <Text style={{color:'#fff',fontWeight:800}}>Join</Text>
    </TouchableOpacity>}
      </View>
     </TouchableOpacity>

    </View>
         <TouchableOpacity  onPress={()=>openTournamentDetails(Tournaments.id)} style={styles.details}>
         <View style={styles.center}>
         <Text style={{fontSize:10}}>Winners</Text>
         <Text style={{fontSize:12}}>{Tournaments?.winners}</Text>
         </View>
 <View style={styles.center}>
         <Text style={{fontSize:10}}>Seats</Text>
         <Text style={{fontSize:12}}>{Tournaments?.tournamentRoomSize}</Text>
         </View>
         <View style={styles.center}>
         <Text style={{fontSize:10}} >Format</Text>
         <Text style={{fontSize:12}}>{Tournaments?.tournamentMode} </Text>
         </View>
         <View style={styles.center}>
         <Text style={{fontSize:10}}>Tournament starts at</Text>
         <Text style={{fontSize:10}}>{formattedDate}</Text>
         </View>
      </TouchableOpacity>
      </View>
)})
}
</View>
    </ScrollView>
    </View>
    )
}

export default AllTournament;

const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal:20,
      height:96,
      backgroundColor: '#526E48', // blue-500
    },
    headingtext:{
      fontSize:12
    },
    subheadingtext:{
        fontSize:12,
        color:'#9D9895'
    },
    price:{
        paddingVertical:10,
      width:'100%',
      flexDirection:'row',
    },
    chips:{
      flexDirection:'column',
      alignItems:'center'
    },
    center:{
        flexDirection:'column',
        alignItems:'center',
        backgroundColor:"#"
    },
    cardHeading:{
      flexDirection:'row',
      width:'100%',
      paddingVertical:5,
      borderBottomWidth:1,
      justifyContent:'space-between',
      borderBottomColor:'#D1CECC'
    },
    cardposition:{
      flexDirection:'row',
      gap:10
    },
    details:{
      paddingHorizontal:15,
      paddingVertical:2,
      borderBottomLeftRadius:10,
      borderBottomRightRadius:10,
      backgroundColor:'#E4DFDF',
      flexDirection:'row',
      alignItems:'center',
      width:'100%',
      justifyContent:'space-between'
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
    Tournamentcard:{
      display:'flex',
      flexDirection:'column',
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
      justifyContent:'center',
      backgroundColor:'#526E48',
      paddingVertical: 5,
      width:85,
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
  