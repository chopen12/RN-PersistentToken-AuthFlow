import * as React from 'react';
import {ScrollView, TouchableHighlight, Image, Text, View} from 'react-native';

//import from local files
import {DGRAY, WHITE, AQUA} from '../constants/themeColors';
import APIController from '../network/axiosRequester';
import Loading from '../components/general/Loading';

export default class HomeScreen extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      busy_requesting: false,
      img_list_data: [],
    };
  }

  reloadList = () => {
    this.setState(
      {
        busy_requesting: true,
        img_list_data: [],
      },
      async () => await this.doRequest(),
    );
  };

  doRequest = async () => {
    try {
      const response = await APIController.get('/api/images');
      const result = response.data;
      console.log('request img data result: ', result);
      this.setState({
        busy_requesting: false,
        img_list_data: [...result],
      });
    } catch (error) {
      console.log('request error: ', error);
      console.log('axios error response: ', error.response);

      this.setState({
        busy_requesting: false,
      });
    }
  };

  componentDidMount() {
    this.doRequest();
  }

  render() {
    return (
      <View
        style={{
          backgroundColor: WHITE,
          padding: '8%',
          height: '100%',
          width: '100%',
        }}
        contentContainerStyle={{
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <TouchableHighlight
          onPress={() => this.reloadList()}
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: 50,
            width: '100%',
            backgroundColor: AQUA,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: WHITE,
            marginBottom: '10%',
          }}
          disabled={this.state.busy_requesting}>
          {!this.state.busy_requesting ? (
            <Text style={{color: WHITE, fontSize: 20}}>{'RELOAD'}</Text>
          ) : (
            <Loading color={WHITE} />
          )}
        </TouchableHighlight>
        <ScrollView style={{flex: 1}}>
          {this.state.img_list_data.map((item, index) => (
            <View
              key={index}
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                borderWidth: 1,
                borderRadius: 10,
                marginBottom: '4%',
                borderColor: DGRAY,
              }}>
              <Text
                style={{
                  fontSize: 18,
                  margin: '3%',
                }}>
                {item.title}
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  margin: '3%',
                }}>
                {item.description}
              </Text>
              <View
                style={{
                  height: 400,
                  width: '100%',
                  padding: '6%',
                  borderRadius: 10,
                }}>
                <Image
                  style={{
                    alignSelf: 'center',
                    height: '100%',
                    width: '100%',
                    borderRadius: 25,
                  }}
                  source={{
                    uri: item.image,
                  }}
                  resizeMode="cover"
                />
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
    );
  }
}
