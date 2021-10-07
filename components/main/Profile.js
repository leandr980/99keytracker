import React, { useState } from 'react'
import { View, Text, TextInput, Image, Button, SnapshotViewIOS } from 'react-native'

import firebase from 'firebase'
require("firebase/firestore")
require("firebase/firebase-storage")

export default function Profile(props) {

    const onLogout = () => {
        firebase.auth().signOut();
    }

    return (
        <View style={{ flex: 1, marginTop: 40 }}>
            <Text> Profile Screen </Text>
            <Button title= 'Logout' onPress={() => onLogout()}/>
        </View>
    )
}