import React, { useEffect, useState } from 'react';
import { ActivityIndicator, AppState, StyleSheet } from 'react-native';
import SendBird from 'sendbird';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AuthManager from '../libs/AuthManager';
import { AppContext } from '../context';
import Lobby from '../page/lobby';
import Chat from '../page/chat';
import Member from '../page/member';
import invite from '../page/invite';
import profile from '../page/profile';
import NavBar from '../component/NavBar';

const Stack = createNativeStackNavigator();

const appId = '2D7B4CDB-932F-4082-9B09-A1153792DC8D';
const sendbird = new SendBird({ appId, localCacheEnabled: true });
sendbird.useAsyncStorageAsDatabase(AsyncStorage);

const AppProvider = ({ children }: any) => {
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    AuthManager.getUserForAutoSignIn()
      .then(async user => {
        if (user) {
          // Even if an error occurs, you still need to sign-in. Because you can make a connection request offline.
          try {
            await sendbird.connect(user.userId);
          } finally {
            setCurrentUser(user);
          }
        }
      })
      .finally(() => setLoading(false));

    const unsubscribes = [
      AppState.addEventListener('change', appState => {
        if (appState === 'active') {
          sendbird.getConnectionState() === 'CLOSED' && sendbird.setForegroundState();
        } else {
          sendbird.getConnectionState() === 'OPEN' && sendbird.setBackgroundState();
        }
      }).remove,
      // messaging().onMessage(onRemoteMessage),
    ];
    return () => {
      unsubscribes.forEach(fn => fn());
    };
  }, []);

  if (loading) return <ActivityIndicator style={StyleSheet.absoluteFill} color={'#742ddd'} size={'large'} />;
  return <AppContext.Provider value={{ sendbird, currentUser, setCurrentUser }}>{children}</AppContext.Provider>;
};

const MainNavigator = () => {
  return (
    <AppProvider>
      <Stack.Navigator>
        <Stack.Screen name="Channels" component={Lobby} options={{ header: NavBar }} />
        <Stack.Screen name="Chat" component={Chat} options={{ header: NavBar }} />
        <Stack.Screen name="Member" component={Member} options={{ header: NavBar }} />
        <Stack.Screen name="Invite" component={invite} options={{ header: NavBar }} />
        <Stack.Screen name="Profile" component={profile} options={{ header: NavBar }} />
      </Stack.Navigator>
    </AppProvider>
  );
};

export default MainNavigator;
