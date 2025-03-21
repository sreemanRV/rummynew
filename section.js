import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native';
import Cashtab from './cashtab';
import Freesection from './freesection';
import Filter from './filter';
import PrivateRoom from './privateroom';

const Section = () => {
  // State to track active tab
  const [activeTab, setActiveTab] = useState(0);

  // Function to handle tab click
  const handleTabPress = (index) => {
    setActiveTab(index);
  };

  return (
    <View>
      {/* Tabs Container */}
      <View style={styles.tabContainer}>
        {/* Tab 1 */}
        <TouchableOpacity
          style={[styles.tab, activeTab === 0 && styles.activeTab]}
          onPress={() => handleTabPress(0)}
        >{activeTab === 0 ?
             <Image style={{width:30,height:30}} source={require('./assets/cashactive.png')}/> :  <Image style={{width:30,height:30}} source={require('./assets/cashm.png')}/>}
          <Text style={[styles.tabText, activeTab === 0 && styles.activeTabText]}>
           CASH
          </Text>
        </TouchableOpacity>

        {/* Tab 2 */}
        <TouchableOpacity
          style={[styles.tab, activeTab === 1 && styles.activeTab]}
          onPress={() => handleTabPress(1)}
        >
          {activeTab === 1 ?
             <Image style={{width:30,height:30}} source={require('./assets/practiceactive.png')}/> :  <Image style={{width:30,height:30}} source={require('./assets/practice.png')}/>}
          <Text style={[styles.tabText, activeTab === 1 && styles.activeTabText]}>
            PRACTICE
          </Text>
        </TouchableOpacity>

        {/* Tab 3 */}
        <TouchableOpacity
          style={[styles.tab, activeTab === 2 && styles.activeTab]}
          onPress={() => handleTabPress(2)}
        >
                    {activeTab === 2 ?
             <Image style={{width:30,height:30}} source={require('./assets/tournamentactive.png')}/> :  <Image style={{width:30,height:30}} source={require('./assets/tournament.png')}/>}
          <Text style={[styles.tabText, activeTab === 2 && styles.activeTabText]}>
            TOURNAMENTS
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 3 && styles.activeTab]}
          onPress={() => handleTabPress(3)}
        >
          {activeTab === 3 ?
             <Image style={{width:30,height:30}} source={require('./assets/friendsactive.png')}/> :  <Image style={{width:30,height:30}} source={require('./assets/friends.png')}/>}
          <Text style={[styles.tabText, activeTab === 3 && styles.activeTabText]}>
            FRIENDS
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content for active tab */}
      <View style={styles.contentContainer}>
        {activeTab === 0 && <Cashtab />}
        {activeTab === 1 && <Freesection />}
        {activeTab === 2 && <Filter />}
        {activeTab === 3 && <PrivateRoom />}
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  // Container for tabs
  tabContainer: {
    flexDirection: 'row',
    padding:10,
    justifyContent:'space-between'
  },
  // Basic style for each tab
  tab: {
   height:72,
    flex:1,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:'#fff'
  },
  // Active tab style (changes background color)
  activeTab: {
    backgroundColor: '#526E48', // Green for active tab
  },
  // Text style for each tab
  tabText: {
    fontWeight: 'bold',
    color: '#000',
    fontSize:10 // Default text color
  },
  // Active text style (changes color when active)
  activeTabText: {
    color: '#fff',
    fontWeight:800 // White text for active tab
  },
  // Content area for active tab

});

export default Section;
