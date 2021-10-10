import React, { useEffect, useState } from 'react'
import { View, TextInput, Image, StyleSheet} from 'react-native'
import { Card, Divider, Button, Paragraph, Dialog, Portal, Provider} from 'react-native-paper'
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
        <View style={styles.container}>
            <Card
                style={ styles.cardstyle}>
                <Card.Content style={{ flex: 1, justifyContent: 'space-between', margin: 10} }>

                    <TextInput
                        style={styles.textinputstyle}
                        placeholder="Write key name . . ."
                        onChangeText={(keyname) => setkeyname(keyname)}
                    />

                    <Divider />

                    <TextInput
                        style={styles.textinputstyle}
                        placeholder="Write a location . . ."
                        onChangeText={(keylocation) => setKeylocation(keylocation)}
                    />

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
    containerInfo: {
        margin: 10,
    },
    containerGallery: {
        flex: 1,
        justifyContent: 'center',
    },
    keyliststyle: {
        flex: 1,
        fontSize: 15,
    },
    cardstyle: {
        flex: 1,
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
        fontSize: 30
    }
})