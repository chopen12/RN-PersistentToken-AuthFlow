import 'react-native-gesture-handler';
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import AsyncStorage from '@react-native-community/async-storage';
import FeatherIcon from 'react-native-vector-icons/Feather';

//import from local files
import {BLACK, WHITE, AQUA} from './src/constants/themeColors';
// loading
import LoadingScreen from './src/components/general/LoadingScreen';
// bottom tabs
import HomeScreen from './src/screens/HomeScreen';
import LoginScreen from './src/screens/LoginScreen';
import LogoutScreen from './src/screens/LogoutScreen';

// context
import {AuthContext} from './src/components/context/AuthContext';

//shared styles
const screenSharedOpts = {
  headerTitleStyle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerStyle: {
    backgroundColor: WHITE,
  },
  headerTintColor: BLACK,
};

//tab nav, stacks inside
const TabNavigator = createBottomTabNavigator();
function TabNavigatorScreen() {
  return (
    <TabNavigator.Navigator
      initialRouteName="Home"
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size}) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = 'home';
          } else {
            iconName = 'log-out';
          }

          return <FeatherIcon name={iconName} color={color} size={size} />;
        },
        headerShown: false,
      })}
      tabBarOptions={{
        activeTintColor: AQUA,
        inactiveTintColor: BLACK,
        showLabel: false,
      }}>
      <TabNavigator.Screen name="Home" component={HomeScreen} />
      <TabNavigator.Screen name="Logout" component={LogoutScreen} />
    </TabNavigator.Navigator>
  );
}

//main app
const MainStack = createStackNavigator();

export default function App({navigation}) {
  const [state, dispatch] = React.useReducer(
    (prevState, action) => {
      switch (action.type) {
        case 'LOGIN':
          return {
            ...prevState,
            isLoading: false,
            tokenIsPresent: true,
          };
        case 'LOGOUT':
          return {
            ...prevState,
            isLoading: false,
            tokenIsPresent: null,
          };
      }
    },
    {
      isLoading: true,
      tokenIsPresent: null,
    },
  );

  React.useEffect(() => {
    const booter = async () => {
      let userToken = null;

      try {
        userToken = await AsyncStorage.getItem('userToken');
      } catch (e) {
        // No token found, user hasn't logged in before
        // userToken === null
      }
      dispatch({type: userToken ? 'LOGIN' : 'LOGOUT'});
    };

    booter();
  }, []);

  const authContext = React.useMemo(
    () => ({
      signIn: () => dispatch({type: 'LOGIN'}),
      signOut: () => dispatch({type: 'LOGOUT'}),
    }),
    [],
  );

  if (state.isLoading) {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer>
      <AuthContext.Provider value={authContext}>
        <MainStack.Navigator headerMode="none">
          {state.tokenIsPresent == null ? (
            <>
              <MainStack.Screen name="Login" component={LoginScreen} />
            </>
          ) : (
            <>
              <MainStack.Screen name="Main" component={TabNavigatorScreen} />
            </>
          )}
        </MainStack.Navigator>
      </AuthContext.Provider>
    </NavigationContainer>
  );
}
