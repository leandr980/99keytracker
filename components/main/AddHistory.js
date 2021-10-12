import React, { useEffect, useState } from 'react'
import { View, FlatList, StyleSheet, } from 'react-native'
import { Card, FAB, Searchbar, IconButton, Paragraph, Divider, Button, Chip, Colors, RadioButton, Text, TextInput } from 'react-native-paper'
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

    const [keydetails, setKeydetails] = useState([])
    const [keyId, setKeyId] = useState("")

    useEffect(() => {

        if (props.route.params.keyId !== keyId) {
            firebase.firestore()
                .collection('keycollection')
                .doc(props.route.params.uid)
                .collection('keylist')
                .doc(props.route.params.keyId)
                .get()
                .then((snapshot) => {
                    setKeydetails(snapshot.data())
                })

            setKeyId(props.route.params.keyId)

        }

    }, [props.route.params.keyId])

    return (
        <View style={styles.container}>

            <Card style={styles.cardstyleinfo}>

                <Card.Title
                    left={() => <MaterialCommunityIcons name="file-key-outline" size={40} />}
                    style={{
                        fontSize: 30,
                        fontWeight: 'bold'
                    }}
                    title={keydetails.keyname}
                />

                <Card.Content >
                    <Paragraph> key location: {keydetails.keylocation} </Paragraph>
                    <Paragraph > Key Status </Paragraph>
                </Card.Content>

            </Card>

            <Divider />

            <Card style={ styles.cardstyle}>
                <Card.Content style={{ flexDirection: 'row', justifyContent: 'space-between', alignContent: 'center', flexWrap: 'wrap' }}>

                    <Button
                        icon="account-star"
                        color={Colors.red500}
                        size={40}
                        onPress={() => console.log('Pressed')}
                    > Landlord </Button>

                    <Button
                        icon="domain"
                        color={Colors.red500}
                        size={40}
                        onPress={() => console.log('Pressed')}
                    > Company </Button>

                    <Button
                        icon="account-tie"
                        color={Colors.red500}
                        size={40}
                        onPress={() => console.log('Pressed')}
                    > Agent </Button>

                    <Button
                        icon="help-circle"
                        color={Colors.red500}
                        size={40}
                        onPress={() => console.log('Pressed')}
                    > Other </Button>
                </Card.Content>

                <Divider/>

                <Card.Content style={{alignItems: 'center'}}>
                    <Text> SELECTED </Text>
                </Card.Content>

            </Card>

            <Card style={styles.cardstyle}>
                <Card.Content style={styles.cardcontentstyle}>

                        <TextInput
                        style={styles.textinputstyle}
                        type='outlined'
                            label="name . . ."
                            onChangeText={(name) => setfeildname(name)}
                    />

                        <TextInput
                            style={styles.textinputstyle}
                            label="company . . ."
                            onChangeText={(company) => setfieldcompany(company)}
                        />

                        <TextInput
                            style={styles.textinputstyle}
                            label="notes . . ."
                            onChangeText={(notes) => setfieldnotes(notes)}
                        />

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
    },
    cardstyleinfo: {
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
        fontSize: 30,
    },
    cardcontentstyle: {
        justifyContent: 'space-between',
        margin: 10
    },
})