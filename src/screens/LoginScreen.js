import * as React from 'react';
import {
  KeyboardAvoidingView,
  TouchableHighlight,
  TextInput,
  Text,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

//import from local files
import {DGRAY, WHITE, AQUA, BLACK} from '../constants/themeColors';
import APIController from '../network/axiosRequester';
import Loading from '../components/general/Loading';

//context
import {AuthContext} from '../components/context/AuthContext';

export default class LoginScreen extends React.PureComponent {
  static contextType = AuthContext;
  constructor(props) {
    super(props);
    this.state = {
      input_username: '',
      input_pword: '',
      busy_requesting: false,
    };
  }

  handleSubmit = () => {
    if (this.state.input_username === '' || this.state.input_pword === '') {
      return alert('username and/or password missing');
    }
    this.setState(
      {
        busy_requesting: true,
      },
      async () =>
        await this.doRequest(this.state.input_username, this.state.input_pword),
    );
  };

  doRequest = async (usr_name, pword) => {
    try {
      const body = {
        username: usr_name,
        password: pword,
      };

      const response = await APIController.post('/api/login', body);
      const result = response.data;
      console.log('login request result: ', result);

      await AsyncStorage.setItem('userToken', result.token);
      const {signIn} = this.context;
      signIn();
    } catch (error) {
      console.log('request error: ', error);
      console.log('axios error response: ', error.response);

      this.setState(
        {
          busy_requesting: false,
        },
        () => {
          return alert('Invalid username and/or password');
        },
      );
    }
  };

  render() {
    return (
      <KeyboardAvoidingView
        style={{
          flex: 1,
          backgroundColor: WHITE,
          padding: '8%',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Text
          style={{
            color: BLACK,
            fontSize: 28,
            fontWeight: 'bold',
            marginBottom: '10%',
          }}>
          {'WELCOME!'}
        </Text>
        <TextInput
          editable={!this.state.busy_requesting}
          style={{
            borderWidth: 1,
            width: '80%',
            borderRadius: 8,
          }}
          placeholder="username"
          value={this.state.input_username}
          onChangeText={input_username =>
            this.setState({input_username: input_username.trim()})
          }
          autoCapitalize="none"
        />

        <TextInput
          editable={!this.state.busy_requesting}
          style={{
            borderWidth: 1,
            width: '80%',
            borderRadius: 8,
            marginTop: '2%',
          }}
          placeholder="password"
          value={this.state.input_pword}
          onChangeText={input_pword => this.setState({input_pword})}
          autoCapitalize="none"
          secureTextEntry
        />
        <TouchableHighlight
          onPress={() => this.handleSubmit()}
          style={{
            display: 'flex',
            height: 46,
            width: '80%',
            marginTop: '10%',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor:
              this.state.busy_requesting ||
              this.state.input_username.length < 3 ||
              this.state.input_pword.length < 1
                ? DGRAY
                : AQUA,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: WHITE,
          }}
          disabled={
            this.state.busy_requesting ||
            this.state.input_username.length < 3 ||
            this.state.input_pword.length < 1
          }>
          {!this.state.busy_requesting ? (
            <Text
              style={{
                color: WHITE,
                fontSize: 22,
                fontWeight: 'bold',
              }}>
              {'LOGIN'}
            </Text>
          ) : (
            <Loading color={WHITE} />
          )}
        </TouchableHighlight>
      </KeyboardAvoidingView>
    );
  }
}
