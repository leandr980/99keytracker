import { StatusBar } from 'expo-status-bar';
import React, { Component } from 'react';
import { StyleSheet, Text, View, LogBox } from 'react-native';

import firebase from 'firebase'

import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'

import LandingScreen from './components/auth/Landing';
import RegisterScreen from './components/auth/Register';
import LoginScreen from './components/auth/Login';

import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'

import rootReducer from './redux/reducers'
import thunk from 'redux-thunk'

import MainScreen from './components/Main'
import SaveScreen from './components/main/Save'
import AddScreen from './components/main/Add'
import KeyinfoScreen from './components/main/Keyinfo'
import Addkeyscreen from './components/main/Addkey'
import AddkeyHistoryscreen from './components/main/AddHistory'
import KeyHistoryDetailsscreen from './components/main/KeyHistoryDetails'
import SignatureScreen from './components/main/AgentSignature'

//LogBox.ignoreLogs(['Warning: ...']);
//console.disableYellowBox = true;

const store = createStore(rootReducer, applyMiddleware(thunk))

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "apikey",
    authDomain: "authDomain",
    projectId: "projectId",
    storageBucket: "storageBucket",
    messagingSenderId: "messagingSenderId",
    appId: "appId",
    measurementId: "measurementId"
};

if (firebase.apps.length === 0) {
    firebase.initializeApp(firebaseConfig)
}

const Stack = createStackNavigator();

export class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loaded: false,
        }
    }

    componentDidMount() {
        firebase.auth().onAuthStateChanged((user) => {
            if (!user) {
                this.setState({
                    loggedIn: false,
                    loaded: true
                })
            }
            else {
                this.setState({
                    loggedIn: true,
                    loaded:true 
                })
            }
        })
    }

    render() {
        const { loggedIn, loaded } = this.state;
        if (!loaded) {
            return (
                <View style={{flex: 1, justifyContent: 'center'} }>
                    <Text> Loading </Text>
                    </View>
                )
        }

        if (!loggedIn) {
            return (
                <NavigationContainer>
                    <Stack.Navigator initialRouteName="Landing">
                        <Stack.Screen name="Landing" component={LandingScreen} options={{ headerShown: false }} />
                        <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
                        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
                    </Stack.Navigator>
                </NavigationContainer >
            )
        }

        return (
            <Provider store={store}>
                <NavigationContainer>
                    <Stack.Navigator
                        initialRouteName="Main">
                        <Stack.Screen name="Main" component={MainScreen}
                            options={{ headerShown: false }}  />
                        <Stack.Screen name="Add" component={AddScreen} />


                        <Stack.Screen name="AddKey" component={Addkeyscreen}
                            options={{
                                title: 'New Key',
                                headerStyle: {
                                    backgroundColor: '#efefef',
                                    elevation: 0,
                                },
                            }}                        />
                        <Stack.Screen name="AddKeyHistory" component={AddkeyHistoryscreen}
                            options={{
                                title: 'New Key History',
                                headerStyle: {
                                    backgroundColor: '#efefef',
                                    elevation: 0,
                                }
                            }}                        />
                        <Stack.Screen name="KeyHistoryDetails" component={KeyHistoryDetailsscreen}
                            options={{
                                title: 'Key Details',
                                headerStyle: {
                                    backgroundColor: '#efefef',
                                    elevation: 0,
                                }
                            }}                        />
                        <Stack.Screen name="Keyinfo" component={KeyinfoScreen}
                            options={{
                                title: 'Key Info',
                            headerStyle: {
                                backgroundColor: '#efefef',
                                elevation: 0,
                            }
                        }}/>
                        <Stack.Screen name="Signature" component={SignatureScreen}
                            options={{
                                headerStyle: {
                                    backgroundColor: '#efefef',
                                    elevation: 0,
                                }
                            }}                        />
                        <Stack.Screen name="Save" component={SaveScreen} navigation={ this.props.navigation}  />
                    </Stack.Navigator>
                </NavigationContainer >
            </Provider>
        )
    }
}
 export default App

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
