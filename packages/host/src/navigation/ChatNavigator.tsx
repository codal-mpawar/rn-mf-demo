import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import NavBar from '../components/NavBar';
import ChatScreen from '../screens/ChatScreen';

export type ChatScreenParamList = {
  Chat: undefined;
};

const Home = createNativeStackNavigator<ChatScreenParamList>();

const ChatNavigator = () => {
  return (
    <Home.Navigator
      screenOptions={{
        header: NavBar,
        headerShown: false,
      }}>
      <Home.Screen name="Chat" component={ChatScreen} />
    </Home.Navigator>
  );
};

export default ChatNavigator;
