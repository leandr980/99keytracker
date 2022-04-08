import React, {useState, useEffect } from 'react'
import { View, StyleSheet, ScrollView, ImageBackground, Alert, Text} from 'react-native'
import { Card, Button, TextInput, Provider} from 'react-native-paper'

import firebase from 'firebase'
require("firebase/firestore")
require("firebase/firebase-storage")

const alerthandler = () =>{
    Alert.alert(
        "Alert",
        "Feilds must not be left empty",
        [
          { text: "OK" }
        ]
      );
}

export default function EditKey(props) {

    const creation = firebase.firestore.FieldValue.serverTimestamp()
    const [keyname, setkeyname] = useState("")
    const [keybuildingvilla, setKeybuildingvilla] = useState("")
    const [keyarea, setKeyarea] = useState("")

    const [keydetails, setKeydetails] = useState([])

    useEffect(() => {

        console.log(props.route.params.keyId)

            const subscribe1 = firebase.firestore()
                .collection('keycollection')
                .doc(props.route.params.uid)
                .collection('keylist')
                .doc(props.route.params.keyId)
                .onSnapshot((docSnapshot) => {
                    if (!docSnapshot.metadata.hasPendingWrites) {  
                        setKeydetails(docSnapshot.data())
                    }
                })

                return () => {
                    subscribe1()
                }
    }, [])

    const updateKeyData = () => {

        if (!keyname.trim() || !keybuildingvilla.trim() || !keyarea.trim() === "") {
            alerthandler()
        }
        else {
                    firebase.firestore()
                        .collection('keycollection')
                        .doc(firebase.auth().currentUser.uid)
                        .collection("keylist")
                        .doc(props.route.params.keyId)
                        .update({
                            keyname: keyname,
                            keybuildingvilla: keybuildingvilla,
                            keyarea: keyarea,
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

                        <Card.Title title='Edit Key Details' />

                        <Card.Content >
                            <Text> Current Key Name: {keydetails.keyname}</Text>
                            <TextInput
                            style={styles.textinputstyle}
                            type='outlined'
                            placeholder="Key name . . ."
                            onChangeText={(keyname) => setkeyname(keyname)}/>

                            <Text>Current Building/Villa: {keydetails.keybuildingvilla}</Text>
                            <TextInput
                            style={styles.textinputstyle}
                            type='outlined'
                            placeholder="Building/Villa . . ."
                            onChangeText={(keybuildingvilla) => setKeybuildingvilla(keybuildingvilla)}
                            />

                            <Text>Current Area/Community: {keydetails.keyarea}</Text>
                            <TextInput
                            style={styles.textinputstyle}
                            type='outlined'
                            placeholder="Area/Community . . ."
                            onChangeText={(keyarea) => setKeyarea(keyarea)}
                            />
                        </Card.Content>

                    </Card>

                    <Card style={styles.cardstyle}>

                        <Card.Actions style={{ justifyContent: 'center' }}>

                            <Button
                                onPress={() => updateKeyData()}>
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