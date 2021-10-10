import React, { useEffect, useState } from 'react'
import { View, Text, FlatList, StyleSheet, TextInput } from 'react-native'
import { Card, FAB, Searchbar, IconButton, Paragraph, Divider, Button } from 'react-native-paper'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

import firebase from 'firebase'
require("firebase/firestore")
require("firebase/firebase-storage")

export default function AddHistory(props) {

    const [name, setfeildname] = useState("")
    const [type, setfieldtype] = useState("")
    const [company, setfieldcompany] = useState("")
    const [reason, setfieldreason] = useState("")

    const saveKeyData = () => {

        if (name || type || company || reason === "") {
            console.log("empty fields")
        }
        else {
            firebase.firestore()
                .collection('keycollection')
                .doc(firebase.auth().currentUser.uid)
                .collection("keylist")
                .doc(props.route.params.keyId)
                .collection("keyhistory")
                .add({
                    name,
                    type,
                    company,
                    reason,
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


    }

    return (
        <View style={styles.container}>
            <Card
                style={styles.cardstyle}>
                <Card.Content style={styles.cardcontentstyle}>

                    <TextInput
                        style={styles.textinputstyle}
                        placeholder="name . . ."
                        onChangeText={(name) => setfeildname(name)}
                    />

                    <Divider />

                    <TextInput
                        style={styles.textinputstyle}
                        placeholder="type . . ."
                        onChangeText={(user) => setfieldtype(user)}
                    />

                    <Divider />

                    <TextInput
                        style={styles.textinputstyle}
                        placeholder="company . . ."
                        onChangeText={(user) => setfieldcompany(user)}
                    />

                    <Divider />

                    <TextInput
                        style={styles.textinputstyle}
                        placeholder="reason . . ."
                        onChangeText={(user) => setfieldreason(user)}
                    />

                    <Divider />

                    <Button
                        mode='contained'
                        onPress={() => saveKeyData()}>
                        ADD
                    </Button>
                </Card.Content>
            </Card>
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 30,
    },
    keyliststyle: {
        flex: 1,
        fontSize: 15,
    },
    cardstyle: {
        borderRadius: 10,
        margin: 10,
        elevation: 10,
    },
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
    },
    textinputstyle: {
        flex: 1,
        fontSize: 30,
        padding: 10,
    },
    cardcontentstyle: {
        justifyContent: 'space-between',
        margin: 10
    }
})