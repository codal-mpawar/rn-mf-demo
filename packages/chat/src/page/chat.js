import React, { useContext, useEffect, useState } from 'react';
import {
  Alert,
  DeviceEventEmitter,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useHeaderHeight } from '@react-navigation/elements';

import { AppContext } from '../context';
import { MD3Colors } from 'react-native-paper';
import Message from '../component/message';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useMessageCollection } from '../hooks/useMessageCollection/useMessageCollection';
import { useConnectionHandler } from '../hooks/useConnectionHandler';
import { getMessageUniqId } from '../hooks/useMessageCollection/reducer';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const Chat = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { sendbird, currentUser } = useContext(AppContext);

  const headerHeight = useHeaderHeight();

  const { bottom } = useSafeAreaInsets();

  const [staleChannel] = useState(() => sendbird.GroupChannel.buildFromSerializedData(route.params.channel));
  const [input, setInput] = useState('');
  const [error, setError] = useState(null);

  const { messages, activeChannel, refresh, next, sendUserMessage, sendFileMessage } = useMessageCollection(
    sendbird,
    staleChannel,
    currentUser.userId,
    () => {
      navigation.navigate('Channels', {
        action: 'delete',
        data: { channel: staleChannel },
      });
    },
    setError,
  );

  useEffect(() => {
    const subscribe = [
      DeviceEventEmitter.addListener('click_member', () => {
        member();
      }),
      DeviceEventEmitter.addListener('click_leave', () => {
        leave();
      }),
    ];
    return () => subscribe.forEach(item => item.remove());
  }, []);

  useConnectionHandler(
    sendbird,
    'page-chat',
    {
      onReconnectStarted: () => {
        setError('Connecting..');
      },
      onReconnectSucceeded: () => {
        setError(null);
        refresh();
      },
      onReconnectFailed: () => {
        setError('Connection failed. Please check the network status.');
      },
    },
    [refresh],
  );

  const leave = () => {
    Alert.alert('Leave', 'Are you going to leave this channel?', [
      { text: 'Cancel' },
      {
        text: 'OK',
        onPress: () => {
          navigation.navigate('Channels', {
            action: 'leave',
            data: { channel: activeChannel },
          });
        },
      },
    ]);
  };
  const member = () => navigation.navigate('Member', { channel: activeChannel.serialize(), currentUser });

  const _sendUserMessage = async () => {
    if (input.length > 0) {
      try {
        const params = new sendbird.UserMessageParams();
        params.message = input;
        setInput('');

        await sendUserMessage(params);
      } catch (e) {
        console.log('failure user mes', e);
        setError('Failed to send a message:', e.message);
      }
    }
  };
  const viewDetail = message => {
    if (message.isFileMessage()) {
      // TODO: show file details
    }
  };
  return (
    <View style={style.container}>
      <FlatList
        data={messages}
        inverted={true}
        renderItem={({ item }) => (
          <Message channel={activeChannel} message={item} onPress={message => viewDetail(message)} />
        )}
        keyExtractor={getMessageUniqId}
        contentContainerStyle={{ flexGrow: 1, paddingVertical: 8 }}
        ListHeaderComponent={
          error && (
            <View style={style.errorContainer}>
              <Text style={style.error}>{error}</Text>
            </View>
          )
        }
        ListEmptyComponent={
          <View style={style.emptyContainer}>
            <Text style={style.empty}>{'No messages'}</Text>
          </View>
        }
        onEndReached={next}
        onEndReachedThreshold={0.5}
      />
      <KeyboardAvoidingView
        keyboardVerticalOffset={-bottom + headerHeight}
        behavior={Platform.select({ ios: 'padding', default: undefined })}>
        <View style={style.inputContainer}>
          <TextInput
            value={input}
            style={style.input}
            multiline={true}
            numberOfLines={2}
            onChangeText={content => {
              if (content.length > 0) {
                staleChannel.startTyping();
              } else {
                staleChannel.endTyping();
              }
              setInput(content);
            }}
          />
          <TouchableOpacity activeOpacity={0.85} style={style.sendButton} onPress={_sendUserMessage}>
            <Icon name="send" color={input.length > 0 ? MD3Colors.primary20 : '#ddd'} size={28} />
          </TouchableOpacity>
        </View>
        <View style={{ height: bottom }} />
      </KeyboardAvoidingView>
    </View>
  );
};

const style = {
  container: {
    flex: 1,
  },
  headerRightContainer: {
    flexDirection: 'row',
  },
  headerRightButton: {
    marginRight: 10,
  },
  errorContainer: {
    backgroundColor: '#333',
    opacity: 0.8,
    padding: 10,
  },
  error: {
    color: '#fff',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  empty: {
    fontSize: 24,
    color: '#999',
    alignSelf: 'center',
  },
  inputContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  input: {
    maxHeight: 100,
    flex: 1,
    fontSize: 20,
    color: '#555',
  },
  uploadButton: {
    marginRight: 10,
  },
  sendButton: {
    marginLeft: 10,
  },
};

export default Chat;
