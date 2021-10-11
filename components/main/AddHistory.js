import React, { useEffect, useState } from 'react'
import { View, FlatList, StyleSheet, TextInput, ScrollView } from 'react-native'
import { Card, FAB, Searchbar, IconButton, Paragraph, Divider, Button, Chip, Colors, RadioButton, Text } from 'react-native-paper'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

import firebase from 'firebase'
require("firebase/firestore")
require("firebase/firebase-storage")

export default function AddHistory(props) {

    const [name, setfeildname] = useState("")
    const [type, setfieldtype] = useState("")
    const [company, setfieldcompany] = useState("")
    const [notes, setfieldnotes] = useState("")

    const [value, setValue] = React.useState('first');

    const saveKeyData = () => {

        if (!name.trim() || !type.trim() || !company.trim() || !notes.trim()) {
            console.log("empty fields")
            console.log(name + type + company + notes)
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
        }


    }

    return (
        <View style={styles.container}>
            <ScrollView>

                <Card style={styles.cardstyle}>

                    <Card.Content>

                        <RadioButton.Group
                            style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-evenly' }}
                            onValueChange={newValue => setValue(newValue)} value={value}>
                            <View>
                                <Text>First</Text>
                                <RadioButton value="first" />
                            </View>
                            <View>
                                <Text>Second</Text>
                                <RadioButton value="second" />
                            </View>
                        </RadioButton.Group>

                    </Card.Content>

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
                            onChangeText={(type) => setfieldtype(type)}
                        />

                        <Divider />

                        <TextInput
                            style={styles.textinputstyle}
                            placeholder="company . . ."
                            onChangeText={(company) => setfieldcompany(company)}
                        />

                        <Divider />

                        <TextInput
                            style={styles.textinputstyle}
                            placeholder="notes . . ."
                            onChangeText={(notes) => setfieldnotes(notes)}
                        />

                        <Divider />

                        <Button
                            mode='contained'
                            onPress={() => saveKeyData()}>
                            ADD
                        </Button>

                        <Button
                            mode='contained'
                            onPress={() => props.navigation.navigate("Signature")}>
                            SIGNATURE SCREEN
                        </Button>
                    </Card.Content>
                </Card>
            </ScrollView>
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
        flex: 1,
        fontSize: 30,
    },
    cardcontentstyle: {
        flex: 1,
        justifyContent: 'space-between',
        margin: 10
    },
})