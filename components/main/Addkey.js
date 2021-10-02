import React, { useState } from 'react'
import { View, TextInput, Image, Button, SnapshotViewIOS } from 'react-native'

import firebase from 'firebase'
require("firebase/firestore")
require("firebase/firebase-storage")

export default function Addkey(props) {

    const [keyname, setkeyname] = useState("")
    const [keylocation, setKeylocation] = useState("")

    const saveKeyData = () => {

        firebase.firestore()
            .collection('keycollection')
            .doc(firebase.auth().currentUser.uid)
            .collection("keylist")
            .add({
                keyname,
                keylocation,
                creation: firebase.firestore.FieldValue.serverTimestamp()
            },
                function (error) {
                    if (error) {
                        console.log("Data could not be saved." + error);
                    } else {
                        console.log("Data saved successfully.");
                    }
                }
            )
    }

    return (
        <View style={{ flex: 1 }}>
            <TextInput
                placeholder="Write key name . . ."
                onChangeText={(keyname) => setkeyname(keyname)}
            />
            <TextInput
                placeholder="Write a location . . ."
                onChangeText={(keylocation) => setKeylocation(keylocation)}
            />

            <Button
                title="Save"
                onPress={() => saveKeyData()}
            />
        </View>
    )
}