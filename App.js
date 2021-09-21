import { StatusBar } from 'expo-status-bar';
import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import firebase from 'firebase/app'
import 'firebase/auth'


import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'

import LandingScreen from './components/auth/Landing';
import RegisterScreen from './components/auth/Register';

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "apiKey",
    authDomain: "authDomain",
    projectId: "projectId",
    storageBucket: "storageBucket",
    messagingSenderId: "messagingSenderId",
    appId: "appId",
    measurementId: "measurementId"
};

firebase.initializeApp(firebaseConfig)

//github test



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
                    loaded: true,
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
        const { loggedIn, loaded } = this.setState

        if (!loaded) {
            return (
                <View>
                    </Text> Loading </Text>
                    </View>
                )
        }

        return (
            <NavigationContainer>
                <Stack.Navigator initialRouteName="Landing">
                    <Stack.Screen name="Landing" component={LandingScreen} options={{ headerShown: false }} />
                    <Stack.Screen name="Register" component={RegisterScreen} />

                </Stack.Navigator>
            </NavigationContainer >
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
