import React, { useState } from 'react'
import { View, TextInput, Image, Button, SnapshotViewIOS } from 'react-native'

import firebase from 'firebase'
require("firebase/firestore")
require("firebase/firebase-storage")


export default function Save(props, { navigation }) {
    console.log(props.route.params.image)

    const [caption, setcaption] = useState("")

    const uploadImage = async () => {
        const uri = props.route.params.image;
        const childPath = `post/${firebase.auth().currentUser.uid}/${Math.random().toString(36)}`
        //console.log(childPath)

        const response = await fetch(uri);
        const blob = await response.blob();

        const task = firebase
            .storage()
            .ref()
            .child(`post/${firebase.auth().currentUser.uid}/${Math.random().toString(36)}`)
            .put(blob);

        const taskProgress = snapshot => {
            console.log(`transfered: ${snapshot.bytesTransferred}`)
        }

        const taskCompleted = () => {
            task.snapshot.ref.getDownloadURL().then((snapshot) => {
                savePostData(snapshot);
                console.log(snapshot)
            })
        }

        const taskError = snapshot => {
            console.log(snapshot)
        }

        task.on("state_changed", taskProgress, taskError, taskCompleted);
    }

    const savePostData = (downloadURL) => {

        firebase.firestore()
            .collection('posts')
            .doc(firebase.auth().currentUser.uid)
            .collection("userPosts")
            .add({
                downloadURL,
                caption,
                creation: firebase.firestore.FieldValue.serverTimestamp()
            },
                function (error) {
                    if (error) {
                        console.log("Data could not be saved." + error);
                    } else {
                        console.log("Data saved successfully.");
                    }
                }
        ).then((function () {
            props.navigation.popToTop()
        }))
    }

    return (
        <View style={{ flex: 1 }}>
            <Image source={{ uri: props.route.params.image }} />
            <TextInput
                placeholder="Write a Caption . . ."
                onChangeText={(caption) => setcaption(caption)}
            />

            <Button
                title="Save"
                onPress={() => uploadImage()}
            />
        </View>
        )
}