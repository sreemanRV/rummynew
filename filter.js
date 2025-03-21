import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import AllTournament from './freetournament';

const Filter = () => {
  // State to track active tab
  const [activeTab, setActiveTab] = useState(0);

  // Function to handle tab click
  const handleTabPress = (index) => {
    setActiveTab(index);
  };

  return (
    <View>
      {/* Scrollable Tabs Container */}
      <ScrollView
        horizontal // Make the ScrollView horizontal
        showsHorizontalScrollIndicator={false} // Hide the horizontal scroll indicator
        contentContainerStyle={styles.tabContainer} // Move justifyContent to this prop
      >
        {/* Tab 1 */}
        <TouchableOpacity
          style={[styles.tab, activeTab === 0 && styles.activeTab]}
          onPress={() => handleTabPress(0)}
        >
          <Text style={[styles.tabText, activeTab === 0 && styles.activeTabText]}>
            All
          </Text>
        </TouchableOpacity>

        {/* Tab 2 */}
        <TouchableOpacity
          style={[styles.tab, activeTab === 1 && styles.activeTab]}
          onPress={() => handleTabPress(1)}
        >
          <Text style={[styles.tabText, activeTab === 1 && styles.activeTabText]}>
            Exclusive
          </Text>
        </TouchableOpacity>

        {/* Tab 3 */}
        <TouchableOpacity
          style={[styles.tab, activeTab === 2 && styles.activeTab]}
          onPress={() => handleTabPress(2)}
        >
          <Text style={[styles.tabText, activeTab === 2 && styles.activeTabText]}>
            1Cr GTD Pool
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 3 && styles.activeTab]}
          onPress={() => handleTabPress(3)}
        >
          <Text style={[styles.tabText, activeTab === 3 && styles.activeTabText]}>
            New Year 37Cr
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 4 && styles.activeTab]}
          onPress={() => handleTabPress(4)}
        >
          <Text style={[styles.tabText, activeTab === 4 && styles.activeTabText]}>
            Knockouts
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 5 && styles.activeTab]}
          onPress={() => handleTabPress(5)}
        >
          <Text style={[styles.tabText, activeTab === 5 && styles.activeTabText]}>
           Multipliers
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 6 && styles.activeTab]}
          onPress={() => handleTabPress(6)}
        >
          <Text style={[styles.tabText, activeTab === 6 && styles.activeTabText]}>
           MTT
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 7 && styles.activeTab]}
          onPress={() => handleTabPress(7)}
        >
          <Text style={[styles.tabText, activeTab === 7 && styles.activeTabText]}>
           Cash
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 8 && styles.activeTab]}
          onPress={() => handleTabPress(8)}
        >
          <Text style={[styles.tabText, activeTab === 8 && styles.activeTabText]}>
           Free
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Content for active tab */}
      <View style={styles.contentContainer}>
        {activeTab === 0 && <AllTournament />}
        {/* {activeTab === 1 && <Pool />}
        {activeTab === 2 && <Deals />} */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  // Container for tabs (moved to contentContainerStyle in ScrollView)
  tabContainer: {
    paddingHorizontal:10,
    flexDirection: 'row',
    // backgroundColor: '#CAE0BC',
    height:40,
 // Add padding to avoid tabs touching edges
    justifyContent: 'flex-start', // Moved here
  },
  // Basic style for each tab
  tab: {
    height: 40,
    width: 96,
    backgroundColor: '#CAE0BC',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 5,
    borderWidth:1,
    borderColor:'#526E48' // Space between tabs
  },
  // Active tab style (changes background color)
  activeTab: {
    borderBottomWidth: 1,
    backgroundColor: '#526E48', // Green for active tab
  },
  // Text style for each tab
  tabText: {
    fontWeight: 'black',
    color: '#526E48',
    fontSize: 12, // Default text color
  },
  // Active text style (changes color when active)
  activeTabText: {
    color: '#fff',
    fontWeight: '800', // White text for active tab
  },
  // Content area for active tab
  contentContainer: {
    padding: 16,
  },
});

export default Filter;
