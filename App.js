import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import firebase from 'firebase/app'
import 'firebase/auth'


import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'

import LandingScreen from './components/auth/Landing';
import RegisterScreen from './components/auth/Register';

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

firebase.initializeApp(firebaseConfig)

//github test



const Stack = createStackNavigator();

export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Landing">
                <Stack.Screen name="Landing" component={LandingScreen} options={{headerShown: false}}/>
                <Stack.Screen name="Register" component={RegisterScreen} />

                </Stack.Navigator>
        </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
