import React, {useState } from 'react'
import { View, StyleSheet, ScrollView, ImageBackground, Alert, TextInput} from 'react-native'
import { Card, Button, Provider, Title, Divider} from 'react-native-paper'

import { Dropdown, MultiSelect} from 'react-native-element-dropdown';

import firebase from 'firebase'
require("firebase/firestore")
require("firebase/firebase-storage")

import {DropdownComponent} from './dropdowncomponent'
import {dubaiareadata} from './listofareas.js'

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
                            
                            <Dropdown
                            style={styles.dropdown}
                            placeholderStyle={styles.placeholderStyle}
                            selectedTextStyle={styles.selectedTextStyle}
                            inputSearchStyle={styles.inputSearchStyle}
                            iconStyle={styles.iconStyle}
                            data={dubaiareadata}
                            search
                            maxHeight={300}
                            labelField="label"
                            valueField="value"
                            placeholder="Select item"
                            searchPlaceholder="Search..."
                            value={keyarea}
                            onChange={item => {
                            setKeyarea(item.value);
                            }}
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
        marginVertical: 20,
        borderBottomWidth: 0.5,
        borderBottomColor: 'grey',
    },
    cardcontentstyle: {
        margin: 10
    },

    dropdown: {
        height: 50,
        backgroundColor: 'transparent',
        borderBottomColor: 'gray',
        borderBottomWidth: 0.5,
    },
    icon: {
        marginRight: 5,
    },
    iconStyle: {
      width: 20,
      height: 20,
    },

    placeholderStyle: {
        fontSize: 16,
    },
    selectedTextStyle: {
        fontSize: 16,
    },
    inputSearchStyle: {
        height: 40,
        fontSize: 16,
    },
    selectedStyle: {
        borderRadius: 12,
    },
})