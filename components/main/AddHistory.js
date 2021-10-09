import React, { useState } from 'react'
import { View, TextInput, Image, Button, SnapshotViewIOS } from 'react-native'

import firebase from 'firebase'
require("firebase/firestore")
require("firebase/firebase-storage")

export default function AddHistory(props) {

    const [name, setfeild1] = useState("")
    const [user, setfield2] = useState("")

    const saveKeyData = () => {

        firebase.firestore()
            .collection('keycollection')
            .doc(firebase.auth().currentUser.uid)
            .collection("keylist")
            .doc(props.route.params.keyId)
            .collection("keyhistory")
            .add({
                name,
                user,
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
                placeholder="Write user name . . ."
                onChangeText={(name) => setfeild1(name)}
            />
            <TextInput
                placeholder="Write company . . ."
                onChangeText={(user) => setfield2(user)}
            />

            <Button
                title="Save"
                onPress={() => saveKeyData()}
            />
        </View>
    )
}