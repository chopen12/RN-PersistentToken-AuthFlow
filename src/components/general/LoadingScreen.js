import React from 'react';
import {ActivityIndicator, View, Text} from 'react-native';

//import from local files
import {BLUE, WHITE} from '../../constants/themeColors';

const LoadingScreen = () => {
  return (
    <View
      style={{
        flex: 1,
        flexDirection: 'column',
        height: '100%',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: WHITE,
      }}>
      <ActivityIndicator size={'large'} color={BLUE} />
      <Text style={{color: BLUE, fontSize: 22}}>{'Loading'}</Text>
    </View>
  );
};

export default LoadingScreen;
