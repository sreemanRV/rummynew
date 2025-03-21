import React from 'react';
import { StyleSheet, } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { enableScreens } from 'react-native-screens';
import Wallet from './wallet';
import Profile from './profile';
import Home from './home';
import TournamentDetails from './tournamentDetails';
import Gameroom from './gameroom';
import Mission from './mission';
import Rewards from './rewards';
import LoginScreen from './login';
import SignupScreen from './signup';
import Kyc from './kyc';
import Addcash from './addcash';
import PrivateRoom from './privateroom';
import Transaction from './alltransaction';
import CreatePrivateRoom from './createprivateroom';
import JoinPrivateRoom from './joinprivateroom';
import KYCVerification from './kyc verification';
import Pan from './panverification';
import Refer from './refer';
import Withdraw from './withdraw';
import Chat from './chat';
import Ticket from './ticket';
import AddcashLimit from './addcashlimit';
import LoyaltyPoints from './bonus';
import TermsandConditions from './termsandconditions';
import Legal from './legal';
import Security from './security';
import Contactus from './contactus';
import FAQ from './Faq';
import Drag from './drag';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Setting from './settings';
import PastGames from './pastgames';
import SplashScreen from './splash';
import Sidebar from './sidebar';

export default function App() {

  const Stack = createStackNavigator();
  enableScreens();
  return (
    <NavigationContainer>
     <GestureHandlerRootView style={{ flex: 1 }}>
     <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName='PastGames'>
     <Stack.Screen name='Home' component={Home} />
     <Stack.Screen name='Profile' component={Wallet} />
     <Stack.Screen name='EditProfile' component={Profile} />
     <Stack.Screen name='Menu' component={Sidebar} />
     <Stack.Screen name="TournamentDetailsById" component={TournamentDetails} />
     <Stack.Screen name='Game' component={Gameroom} />
     <Stack.Screen name='PastGame' component={PastGames} />
     <Stack.Screen name='Privateroom' component={PrivateRoom} />
     <Stack.Screen name='CreatePrivateroom' component={CreatePrivateRoom} />
     <Stack.Screen name='JoinPrivateroom' component={JoinPrivateRoom} />
     <Stack.Screen name='TermsandConditions' component={TermsandConditions} />
     <Stack.Screen name='Legal' component={Legal} />
     <Stack.Screen name='Security' component={Security} />
     <Stack.Screen name='Settings' component={Setting} />
     <Stack.Screen name='Contactus' component={Contactus} />
     <Stack.Screen name='Mission' component={Mission} />
     <Stack.Screen name='Chat' component={Chat} />
     <Stack.Screen name='FAQ' component={FAQ} />
     <Stack.Screen name='Splash' component={SplashScreen} />
     <Stack.Screen name='Rewards' component={Rewards} />
     <Stack.Screen name='PastGames' component={PastGames} />
     <Stack.Screen name='AddcashLimit' component={AddcashLimit} />
     <Stack.Screen name='LoyaltyPoints' component={LoyaltyPoints} />
     <Stack.Screen name='Withdraw' component={Withdraw} />
     <Stack.Screen name='Ticket' component={Ticket} />
     <Stack.Screen name='Login' component={LoginScreen} />
     <Stack.Screen name='Signup' component={SignupScreen} />
     <Stack.Screen name='Kyc' component={Kyc} />
     <Stack.Screen name='drag' component={Drag} />
     <Stack.Screen name='Pancard' component={Pan} />
     <Stack.Screen name='KYCVerification' component={KYCVerification} />
     <Stack.Screen name='Refer' component={Refer} />
     <Stack.Screen name='Addcash' component={Addcash} />
     <Stack.Screen name='Transaction' component={Transaction} />
    </Stack.Navigator>
    </GestureHandlerRootView>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
