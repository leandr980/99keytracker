import React, {useState } from 'react'
import { View, StyleSheet, ScrollView, ImageBackground, Alert, Text} from 'react-native'
import { Card, Button, TextInput, Provider, Dialog} from 'react-native-paper'

import firebase from 'firebase'
require("firebase/firestore")
require("firebase/firebase-storage")

import {DropdownComponent} from './dropdowncomponent'

const alerthandler = () =>{
    Alert.alert(
        "Alert",
        "Feilds must not be left empty",
        [
          { text: "OK" }
        ]
      );
}

export default function Addkey(props) {

    const [keyname, setkeyname] = useState("")
    const [keybuildingvilla, setKeybuildingvilla] = useState("")
    const [keyarea, setKeyarea] = useState("")

    const [text, settext] =useState('')
    const [text1, settext1] =useState('')

    const creation = firebase.firestore.FieldValue.serverTimestamp()
    const keyhistorycreation = creation

    const saveKeyData = () => {

        if (!keyname.trim() || !keybuildingvilla.trim() || !keyarea.trim() === "") {
            alerthandler()
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
                    keybuildingvilla,
                    keyarea,
                    entrytype,
                    creation,
                    keyhistorycreation,
                })
                .then(function (docRef) {
                    console.log("Document written with ID: ", docRef.id);
                    let keyid = docRef.id

                    firebase.firestore()
                        .collection('keycollection')
                        .doc(firebase.auth().currentUser.uid)
                        .collection("keylist")
                        .doc(docRef.id)
                        .collection("keyhistory")
                        .add({
                            entrytype,
                            keyid,
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
                            props.navigation.pop()
                        }))
                })
        }
    }

    return (
        <Provider>
            
            <ImageBackground 
            style={{flex: 1}}
            imageStyle={{resizeMode: 'repeat'}}
            source={require('../../assets/bg-image/99-whatsapp-bg-small.jpg')}>

                <ScrollView>

                    <Card style={styles.cardstyle}>

                        <Card.Title title='Key Details' />

                        <Card.Content >
                            <TextInput
                            style={styles.textinputstyle}
                            type='outlined'
                            placeholder="Key name . . ."
                            onChangeText={(keyname) => setkeyname(keyname)}/>
                            
                            <TextInput
                            style={styles.textinputstyle}
                            type='outlined'
                            placeholder="Building/Villa . . ."
                            onChangeText={(keybuildingvilla) => setKeybuildingvilla(keybuildingvilla)}
                            />

                            <TextInput
                            style={styles.textinputstyle}
                            type='outlined'
                            placeholder="Area/Community . . ."
                            onChangeText={(keyarea) => setKeyarea(keyarea)}
                            />

                            <DropdownComponent />
                            <Text>coc {text}</Text>
                            <DropdownComponent />

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
            </ImageBackground>
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
        elevation: 5,
        justifyContent: 'space-between'
    },
    textinputstyle: {
        marginVertical: 10
    },
    cardcontentstyle: {
        margin: 10
    }
})