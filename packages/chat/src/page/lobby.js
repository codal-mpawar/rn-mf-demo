import React, { useContext, useEffect } from 'react';
import { AppContext } from '../context';
import Login from './login';
import Channels from './channels';
import AuthManager from '../libs/AuthManager';
import { useNavigation } from '@react-navigation/native';

async function safeRunForOffline(callback) {
  try {
    await callback();
  } catch {}
}

const Lobby = () => {
  const navigation = useNavigation();
  const { sendbird, currentUser, setCurrentUser } = useContext(AppContext);

  useEffect(() => {
    const params = { 'nickname': 'Manthan', 'userId': 'Manthan' };
    login(params);
  }, []);

  const login = async signUser => {
    return new Promise((resolve, reject) => {
      const cacheStrictCodes = [400300, 400301, 400302, 400310];

      sendbird.connect(signUser.userId, async (sendbirdUser, error) => {
        // Cache strict errors - https://sendbird.com/docs/chat/v3/javascript/guides/authentication#2-connect-to-sendbird-server-with-a-user-id
        if (error && sendbird.isCacheEnabled && cacheStrictCodes.some(c => error.code === c)) {
          await sendbird.clearCachedData().catch(e => console.log('clear cache failure', e));
          return reject(error);
        }

        if (sendbirdUser) {
          await AuthManager.signIn(signUser);
          let _user = sendbirdUser;

          await safeRunForOffline(async () => {
            _user = await sendbird.updateCurrentUserInfo(signUser.nickname, _user.profileUrl);
          });
          await safeRunForOffline(async () => {});

          setCurrentUser(_user);
          return resolve(_user);
        }

        if (error) {
          return reject(error);
        }
      });
    });
  };

  const goback = async () => {
    navigation.goBack();
  };

  return <>{currentUser ? <Channels /> : <Login onLogin={login} />}</>;
};

const style = {
  headerLeftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    color: '#000000',
  },
  logo: {
    width: 32,
    height: 32,
    backgroundColor: 'cyan',
  },
};

export default Lobby;
