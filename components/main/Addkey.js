import React, { useEffect, useState } from 'react'
import { View, Image, StyleSheet, ScrollView} from 'react-native'
import { Card, Divider, Button, Paragraph, TextInput, Provider, Dialog, Portal, HelperText} from 'react-native-paper'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

import firebase from 'firebase'
require("firebase/firestore")
require("firebase/firebase-storage")

export default function Addkey(props) {

    const [keyname, setkeyname] = useState("")
    const [keylocation, setKeylocation] = useState("")

    const [name, setfeildname] = useState("")
    //const [entrytype, setfieldentrytype] = useState("")
    const [company, setfieldcompany] = useState("")
    const [notes, setfieldnotes] = useState("")

    const creation = firebase.firestore.FieldValue.serverTimestamp()

    const saveKeyData = () => {

        if (!keyname.trim() || !keylocation.trim() || !name.trim() || !company.trim() === "") {
            console.log("blank")
        }
        else {

            //setfieldentrytype('NEW ENTRY')

            const entrytype = 'NEW ENTRY'

            firebase.firestore()
                .collection('keycollection')
                .doc(firebase.auth().currentUser.uid)
                .collection("keylist")
                .add({
                    keyname,
                    keylocation,
                    entrytype,
                    name,
                    company,
                    creation
                })
                .then(function (docRef) {
                    console.log("Document written with ID: ", docRef.id);

                    firebase.firestore()
                        .collection('keycollection')
                        .doc(firebase.auth().currentUser.uid)
                        .collection("keylist")
                        .doc(docRef.id)
                        .collection("keyhistory")
                        .add({
                            name,
                            entrytype,
                            company,
                            notes,
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
                })
        }
    }

    const hasErrors = () => {
        return !text.includes('');
    }

    return (
        <Provider>


            <ScrollView>
                <Card
                    style={styles.cardstyle}>
                    <Card.Title title='Key Details' />

                    <Card.Content >
                        <TextInput
                            style={styles.textinputstyle}
                            type='outlined'
                            placeholder="Key name . . ."
                            onChangeText={(keyname) => setkeyname(keyname)}
                        />
                        <HelperText type="error" visible={hasErrors}>
                            Field cannot be empty.
                        </HelperText>

                        <TextInput
                            style={styles.textinputstyle}
                            type='outlined'
                            placeholder="Building/Community . . ."
                            onChangeText={(keylocation) => setKeylocation(keylocation)}
                        />

                    </Card.Content>

                </Card>

                <Card style={styles.cardstyle}>
                    <Card.Title title='New Key History Entry' />

                    <Card.Content >

                        <TextInput
                            style={styles.textinputstyle}
                            type='outlined'
                            label="Name . . ."
                            onChangeText={(name) => setfeildname(name)}
                        />

                        <TextInput
                            style={styles.textinputstyle}
                            label="Company . . ."
                            onChangeText={(company) => setfieldcompany(company)}
                        />

                        <TextInput
                            style={styles.textinputstyle}
                            label="Notes . . ."
                            onChangeText={(notes) => setfieldnotes(notes)}
                        />
                    </Card.Content>
                </Card>

                <Card style={styles.cardstyle}>
                    <Card.Actions style={{ justifyContent: 'center' }}>
                        <Button
                            onPress={() => saveKeyData()}>
                            SAVE
                        </Button>
                    </Card.Actions>
                </Card>

            </ScrollView>
        </Provider>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    keyliststyle: {
        flex: 1,
        fontSize: 15,
    },
    cardstyle: {
        borderRadius: 10,
        margin: 10,
        elevation: 10,
        justifyContent: 'space-between'
    },
    textinputstyle: {
        marginVertical: 10
    },
    cardcontentstyle: {
        margin: 10
    }
})