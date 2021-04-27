import * as React from 'react';
import {TouchableHighlight, Text, View} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

//import from local files
import {DGRAY, WHITE, AQUA} from '../constants/themeColors';
import Loading from '../components/general/Loading';

//context
import {AuthContext} from '../components/context/AuthContext';

export default class LogoutScreen extends React.PureComponent {
  static contextType = AuthContext;
  constructor(props) {
    super(props);
    this.state = {
      ending_session: false,
    };
  }

  logout = async () => {
    try {
      await AsyncStorage.clear();
      const {signOut} = this.context;
      signOut();
    } catch (error) {
      console.log('err login out -> ', error);
    }
  };

  beginLogout = () => {
    this.setState(
      {
        ending_session: true,
      },
      () => {
        setTimeout(async () => await this.logout(), 1500);
      },
    );
  };

  render() {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: WHITE,
          padding: '8%',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <TouchableHighlight
          onPress={() => this.logout()}
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: 40,
            width: '50%',
            backgroundColor: AQUA,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: DGRAY,
          }}
          disabled={this.state.ending_session}>
          {!this.state.ending_session ? (
            <Text
              style={{
                color: WHITE,
                fontSize: 20,
                fontSize: 22,
                fontWeight: 'bold',
              }}>
              {'LOGOUT'}
            </Text>
          ) : (
            <Loading color={WHITE} />
          )}
        </TouchableHighlight>
      </View>
    );
  }
}
