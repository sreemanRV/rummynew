import React, { useState } from "react";
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Dimensions, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Chat = () => {
  const navigation = useNavigation();
  const [queriesDropdown, setQueriesDropdown] = useState(false);
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [question, setQuestion] = useState([]);
  const [selectedQuestion,setSelectedquestion] = useState()

  const back = () => {
    navigation.goBack();
  };

  const dropdown = () => {
    setQueriesDropdown(!queriesDropdown);
  };
  const Withdraw = [
    { id: 1, que: "Requirements for Withdrawal" },
    { 
      id: 2, 
      que: "What are the Withdrawal limits ?", 
      heading: "Enhanced Security for your Withdrawal Transactions", 
      steps: `To ensure smooth and secure withdrawals, follow these steps:
      \n1. Select the Withdraw option in the withdrawal confirmation.\n2. An OTP (One-Time Password) will be sent to your registered mobile number.\n3. Enter the OTP received to proceed.\n4. Place your withdrawal request with confidence.`,
      note:`Note:
This verification process is mandatory for every withdrawal transaction.
KYC verification (Aadhaar and PAN verification) is required to place a withdrawal request.`
    },
    { id: 3, que: "OTP Related Information" },
  ];

  const selectQuestion = (payload)=>{
    setSelectedquestion(payload)
  }

  const handleTopicClick = (topic) => {
    // Always add the selected topic to the array (including duplicates)
    setSelectedTopics(prevTopics => [...prevTopics, topic]);

    // If the topic is "Withdrawal Related Queries", update questions
    if (topic.heading === "Withdrawal Related Queries") {
      // Set the withdrawal data as questions
      setQuestion(Withdraw); // Clear any previous transaction data

      Withdraw.forEach(item => {
        setQuestions(prevQuestions => [...prevQuestions, { type: 'transaction', message: item.que, heading: item.heading, steps: item.steps, note:item.note }]);
      });
    }

    setQueriesDropdown(false); // Close dropdown after selecting a topic
  };

  const topic = [
    { id: 1, heading: "Deposit Related Queries" },
    { id: 2, heading: "Withdrawal Related Queries" },
    { id: 3, heading: "Account Related Queries" },
    { id: 4, heading: "KYC Related Queries" },
    { id: 5, heading: "TDS Related Queries" },
    { id: 6, heading: "Tournament Related Queries" },
  ];

  return (
    <View style={{ flex: 1 }}>
      <View style={{ backgroundColor: '#fff', height: 28 }}></View>
      <View style={{ backgroundColor: '#526E48', height: 60, flexDirection: 'row', gap: 5, alignItems: "center", paddingHorizontal: 10 }}>
        <TouchableOpacity onPress={back} style={{ padding: 5 }}>
          <Image source={require('./assets/back.png')} style={{ width: 20, height: 20 }} />
        </TouchableOpacity>

        <View style={{ backgroundColor: '#', flexDirection: 'row', alignItems: 'center' }}>
          <Image source={require('./assets/profile.png')} style={{ width: 40, height: 40 }} />
          <View>
            <Text style={{ color: '#fff' }}>Rummy</Text>
            <Text style={{ fontSize: 10, color: '#fff' }}>Chat with us 24/7</Text>
          </View>
        </View>
      </View>

      {selectedTopics.map((selectedTopic, index) => (
        <View key={index}>
          <View style={styles.messageContainer}>
            <Text style={styles.messageText}>{selectedTopic.heading}</Text>
          </View>
        </View>
      ))}

      {questions.map((question, index) => (
        <View>
        <TouchableOpacity onPress={()=>{selectQuestion(index)}} key={index} style={styles.messageLeftContainer}>
          <Text style={styles.messageText}>{question.message}</Text>
        </TouchableOpacity>
        {selectedQuestion === index &&
          <View style={{flexDirection:'column',paddingHorizontal:16,paddingVertical:10,gap:10}}>
            <Text>{question.heading}</Text>
            <Text>{question.steps}</Text>
            <Text>{question.note}</Text>
            </View>
        }
        </View>
      ))}

      <View style={styles.bottomNavbar}>
        {queriesDropdown && (
          <View style={{ width: '100%' }}>
            {topic.map((topics) => (
              <TouchableOpacity key={topics.id} onPress={() => handleTopicClick(topics)} style={{ paddingVertical: 10, borderColor: '#E4E7E3', borderBottomWidth: 1 }}>
                <Text>{topics.heading}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <View style={{ flexDirection: 'row', paddingHorizontal: 16, alignItems: 'center', gap: 6 }}>
          <TextInput placeholder="Type Here.." style={styles.inputField} />
          <TouchableOpacity onPress={dropdown}>
            <Image source={require('./assets/iconmenu.png')} style={{ width: 30, height: 20 }} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Chat;

const styles = StyleSheet.create({
  messageContainer: {
    backgroundColor: '#E4E7E3',
    padding: 10,
    borderRadius: 8,
    marginTop: 15,
    alignSelf: 'flex-end',
    maxWidth: '80%',
  },
  messageLeftContainer:{
    backgroundColor: '#E4E7E3',
    padding: 10,
    borderRadius: 8,
    marginTop: 15,
    alignSelf: 'flex-start',
    maxWidth: '80%',
  },
  messageText: {
    fontSize: 16,
    color: '#333',
  },
  inputField: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#526E48',
    borderRadius: 50,
    paddingHorizontal: 20,
    backgroundColor: '#D9EAD1',
  },
  bottomNavbar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#9D9895',
    gap: 15,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
});
