import React from 'react';
import {View, ActivityIndicator} from 'react-native';
import {AQUA} from '../../constants/themeColors';

const Loading = props => {
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <ActivityIndicator size={'large'} color={props?.color ?? AQUA} />
    </View>
  );
};

export default Loading;
