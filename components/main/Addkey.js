import React, { useEffect, useState } from 'react'
import { View, Image, StyleSheet} from 'react-native'
import { Card, Divider, Button, Paragraph, Dialog, Portal, Provider, TextInput} from 'react-native-paper'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

import firebase from 'firebase'
require("firebase/firestore")
require("firebase/firebase-storage")

export default function Addkey(props) {

    const [keyname, setkeyname] = useState("")
    const [keylocation, setKeylocation] = useState("")

    const [visible, setVisible] = React.useState(false);
    const showDialog = () => setVisible(true);
    const hideDialog = () => setVisible(false);

    const saveKeyData = () => {

        if (keyname || keylocation === "") {
            console.log("blank")
            setVisible(true)
            return (
                <Provider>
                    <View>
                        <Portal>
                            <Dialog visible={visible} onDismiss={hideDialog}>
                                <Dialog.Title>Alert</Dialog.Title>
                                <Dialog.Content>
                                    <Paragraph>Some Fields are missing or empty</Paragraph>
                                </Dialog.Content>
                                <Dialog.Actions>
                                    <Button onPress={hideDialog}>Done</Button>
                                </Dialog.Actions>
                            </Dialog>
                        </Portal>
                    </View>
                </Provider>
            );
        }
        else {
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
    }

    return (
        <View >
            <Card
                style={styles.cardstyle}>

                <Card.Content >
                    <TextInput
                        style={styles.textinputstyle}
                        type='outlined'
                        placeholder="Write key name . . ."
                        onChangeText={(keyname) => setkeyname(keyname)}
                    />

                </Card.Content>

                <Card.Content >
                    <TextInput
                        style={styles.textinputstyle}
                        type='outlined'
                        placeholder="Write a location . . ."
                        onChangeText={(keylocation) => setKeylocation(keylocation)}
                    />

                </Card.Content>

                <Divider/>

                <Card.Actions style={{justifyContent: 'center'} }>
                    <Button
                        onPress={() => saveKeyData()}>
                        ADD
                    </Button>
                </Card.Actions>

            </Card>
        </View>
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
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
    },
    textinputstyle: {
        marginVertical: 10
    },
    cardcontentstyle: {
        flex: 1,
        margin: 10
    }
})