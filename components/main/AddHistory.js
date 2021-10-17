import React, { useEffect, useState, Component } from 'react'
import { View, FlatList, StyleSheet, } from 'react-native'
import { Card, FAB, Searchbar, IconButton, Paragraph, Divider, Button, Chip, Colors, RadioButton, Text, TextInput } from 'react-native-paper'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

import firebase from 'firebase'
import { ScrollView } from 'react-native'
import { ListView } from 'react-native'
require("firebase/firestore")
require("firebase/firebase-storage")

export default function AddHistory(props) {

    const [name, setfeildname] = useState("")
    const [type, setfieldtype] = useState("")
    const [company, setfieldcompany] = useState("")
    const [notes, setfieldnotes] = useState("")

    const [buttonLandlord, setButtonLandlord] = useState(false)
    const [buttonCompany, setButtonCompany] = useState(false)
    const [buttonAgent, setButtonAgent] = useState(false)
    const [buttonOther, setButtonOther] = useState(false)

    const [showComponent, setShowComponent] = useState(false)

    const [buttonSelectedText, setButtonSelectedText] = useState('NONE')

    const iconbuttonpress = (buttonname) => {

        switch (buttonname) {

            case 'landlord':
                setButtonLandlord(true)
                setButtonCompany(false)
                setButtonAgent(false)
                setButtonOther(false)
                setButtonSelectedText('LANDLORD')
                setfieldcompany('LANDLORD')
                setShowComponent(false)
                break;

            case 'company':
                setButtonLandlord(false)
                setButtonCompany(true)
                setButtonAgent(false)
                setButtonOther(false)
                setButtonSelectedText('COMPANY')
                setfieldtype('COMPANY')
                setShowComponent(false)
                break;

            case 'agent':
                setButtonLandlord(false)
                setButtonCompany(false)
                setButtonAgent(true)
                setButtonOther(false)
                setButtonSelectedText('AGENT')
                setfieldtype('AGENT')
                setShowComponent(true)
                break;

            case 'other':
                setButtonLandlord(false)
                setButtonCompany(false)
                setButtonAgent(false)
                setButtonOther(true)
                setButtonSelectedText('OTHER')
                setfieldtype('OTHER')
                setShowComponent(false)
                break;
        }
    }

    componentHideAndShow = () => {
        this.set
    }

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


    //return screen...
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

            <ScrollView>
                <Card style={styles.cardstyle}>
                    <Card.Content style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>

                        <Button
                            icon="account-star"
                            mode="outlined"
                            disabled={buttonLandlord}
                            color={Colors.red500}
                            size={40}
                            onPress={() => iconbuttonpress('landlord')}
                        > Landlord </Button>

                        <Button
                            icon="domain"
                            mode="outlined"
                            disabled={buttonCompany}
                            color={Colors.red500}
                            size={40}
                            onPress={() => iconbuttonpress('company')}
                        > Company </Button>

                        <Button
                            icon="account-tie"
                            mode="outlined"
                            disabled={buttonAgent}
                            color={Colors.red500}
                            size={40}
                            onPress={() => iconbuttonpress('agent')}
                        > Agent </Button>

                        <Button
                            icon="help-circle"
                            mode="outlined"
                            disabled={buttonOther}
                            color={Colors.red500}
                            size={40}
                            onPress={() => iconbuttonpress('other')}
                        > Other </Button>
                    </Card.Content>

                    <Divider />

                    <Card.Content>
                        <Text style={{marginVertical: 10}}> SELECTED: {buttonSelectedText} </Text>
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
                    </Card.Content>
                </Card>


                {
                    showComponent ? (

                        <Card style={styles.cardstyle}>
                            <Card.Content>
                                <Paragraph> Emirates Id front: </Paragraph>
                            </Card.Content>

                            <Divider />

                            <Card.Actions style={{ justifyContent: 'space-between' }}>
                                <Button
                                    onPress={() => props.navigation.navigate("Add")} >
                                    TAKE NEW PHOTO
                                </Button>

                                <Button
                                    onPress={() => props.navigation.navigate("AddKeyHistory", { keyId: props.route.params.keyId, uid: firebase.auth().currentUser.uid })} >
                                    ADD FROM GALLERY
                                </Button>
                            </Card.Actions>

                        </Card>

                    ): null
                }

                {
                    showComponent ? (
                        <Card style={styles.cardstyle}>
                            <Card.Content>
                                <Paragraph> Emirates Id back: </Paragraph>
                            </Card.Content>

                            <Divider />

                            <Card.Actions style={{ justifyContent: 'space-between' }}>
                                <Button
                                    onPress={() => props.navigation.navigate("AddKeyHistory", { keyId: props.route.params.keyId, uid: firebase.auth().currentUser.uid })} >
                                    TAKE NEW PHOTO
                                </Button>

                                <Button
                                    onPress={() => props.navigation.navigate("AddKeyHistory", { keyId: props.route.params.keyId, uid: firebase.auth().currentUser.uid })} >
                                    ADD FROM GALLERY
                                </Button>
                            </Card.Actions>
                        </Card>
                    ): null

                }


                {
                    showComponent ? (
                        <Card style={styles.cardstyle}>
                            <Card.Content>
                                <Paragraph> Agent Signature: </Paragraph>
                            </Card.Content>

                            <Divider />

                            <Card.Actions style={{ justifyContent: 'space-between' }}>
                                <Button
                                    onPress={() => props.navigation.navigate("Signature")} >
                                    TAKE NEW SIGNATURE
                                </Button>

                                <Button
                                    onPress={() => props.navigation.navigate("Signature")} >
                                    ADD FROM GALLERY
                                </Button>
                            </Card.Actions>
                        </Card>
                    ): null

                }




                <Card style={styles.cardstyle}>
                    <Card.Actions style={{ justifyContent: 'space-between', alignItems: 'center'}}>
                        <Button
                            onPress={() => saveKeyData()} >
                            SAVE
                        </Button>
                        <Button
                            onPress={() => props.navigation.navigate("AddKeyHistory", { keyId: props.route.params.keyId, uid: firebase.auth().currentUser.uid })} >
                            CLEAR
                        </Button>
                    </Card.Actions>
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
        marginVertical: 10
    },
    cardcontentstyle: {
        justifyContent: 'space-between',
        margin: 10
    },
})