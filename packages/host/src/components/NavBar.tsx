import React from 'react';
import {NativeStackHeaderProps} from '@react-navigation/native-stack';
import {Appbar, MD3Colors} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const NavBar = ({navigation, back, route, options}: NativeStackHeaderProps) => {
  const onPressChat = () => {
    navigation.navigate('ChatScreen');
  };
  return (
    <Appbar.Header elevated>
      {back ? <Appbar.BackAction onPress={navigation.goBack} /> : null}
      <Appbar.Content title={options.title ?? route.name} />
      <Icon
        size={30}
        color={MD3Colors.primary20}
        name="chat"
        onPress={onPressChat}
      />
    </Appbar.Header>
  );
};

export default NavBar;
