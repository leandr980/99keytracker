import React, { useState } from 'react'
import { View, TextInput, Image, Button, SnapshotViewIOS } from 'react-native'

import firebase from 'firebase'
require("firebase/firestore")
require("firebase/firebase-storage")

export default function Addkey(props) {

    const [keyname, setkeyname] = useState("")

    const saveKeyData = () => {

        firebase.firestore()
            .collection('keycollection')
            .doc(firebase.auth().currentUser.uid)
            .collection("keylist")
            .add({
                keyname,
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
                placeholder="Write a Caption . . ."
                onChangeText={(keyname) => setkeyname(keyname)}
            />

            <Button
                title="Save"
                onPress={() => saveKeyData()}
            />
        </View>
    )
}