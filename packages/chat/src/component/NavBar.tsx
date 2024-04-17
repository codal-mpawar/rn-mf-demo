import React, { useContext } from 'react';
import { NativeStackHeaderProps } from '@react-navigation/native-stack';
import { Appbar } from 'react-native-paper';
import { DeviceEventEmitter, StyleSheet, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { AppContext } from '../context';

const NavBar = ({ navigation, back, route, options }: NativeStackHeaderProps) => {
  const { currentUser } = useContext(AppContext);
  const startChat = () => {
    navigation.navigate('Invite', { currentUser });
  };

  const member = () => {
    DeviceEventEmitter.emit('click_member');
  };
  const leave = () => {
    DeviceEventEmitter.emit('click_leave');
  };
  const right = (
    <View style={style.headerRightContainer}>
      <TouchableOpacity activeOpacity={0.85} style={style.headerRightButton} onPress={member}>
        <Icon name="people" color="#000" size={28} />
      </TouchableOpacity>
      <TouchableOpacity activeOpacity={0.85} style={style.headerRightButton} onPress={leave}>
        <Icon name="directions-walk" color="#000" size={28} />
      </TouchableOpacity>
    </View>
  );

  return (
    <Appbar.Header elevated>
      {back ? <Appbar.BackAction onPress={navigation.goBack} /> : null}
      <Appbar.Content title={options.title ?? route.name} />
      {(options.title || route.name) === 'Channels' && (
        <TouchableOpacity activeOpacity={0.85} onPress={startChat}>
          <Icon name="chat" color="#000" size={28} />
        </TouchableOpacity>
      )}
      {(options.title || route.name) === 'Chat' && right}
    </Appbar.Header>
  );
};

const style = StyleSheet.create({
  headerRightContainer: {
    flexDirection: 'row',
  },
  headerRightButton: {
    marginRight: 10,
  },
});

export default NavBar;
