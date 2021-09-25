import { StatusBar } from 'expo-status-bar';
import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import firebase from 'firebase/app'
import 'firebase/auth'


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

console.disableYellowBox = true;

const store = createStore(rootReducer, applyMiddleware(thunk))

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBnuRW8gKciBu-nWwVO5N7sIZJOnQUYtKE",
    authDomain: "keytracker-5133a.firebaseapp.com",
    projectId: "keytracker-5133a",
    storageBucket: "keytracker-5133a.appspot.com",
    messagingSenderId: "880024016660",
    appId: "1:880024016660:web:4d029c3f44a650baa41401",
    measurementId: "G-HLYXQHGYPT"
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
                        <Stack.Screen name="Register" component={RegisterScreen} />
                        <Stack.Screen name="Login" component={LoginScreen} />
                    </Stack.Navigator>
                </NavigationContainer >
            )
        }

        return (
            <Provider store={store}>
                <NavigationContainer>
                    <Stack.Navigator initialRouteName="Main">
                        <Stack.Screen name="Main" component={MainScreen} options={{ headerShown: false }} />
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
