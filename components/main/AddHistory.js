import React, { useEffect, useState, Component } from 'react'
import { View, FlatList, StyleSheet, ScrollView } from 'react-native'
import { Card, FAB, Searchbar, IconButton, Paragraph, Divider, Button, Chip, Colors, RadioButton, Text, TextInput, List, Portal, Dialog, Provider, Modal } from 'react-native-paper'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import * as ImagePicker from 'expo-image-picker';
import Signature from "react-native-signature-canvas";

import firebase from 'firebase'
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

    const [hasgallerypermission, sethasgallerypermission] = useState(null);
    const [imageIDfront, setImageIDfront] = useState(null);
    const [imageIDback, setImageIDback] = useState(null);
    const [imageSignature, setImageSignature] = useState(null);

    useEffect(() => {
        (async () => {
            const gallerystatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
            sethasgallerypermission(gallerystatus.status === 'granted');
        })();
    }, []);

    const pickImage = async (x) => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        //console.log(result);

        if (!result.cancelled && x === 'idfront') {
            setImageIDfront(result.uri);
        }

        if (!result.cancelled && x === 'idback') {
            setImageIDback(result.uri);
        }

        if (!result.cancelled && x === 'signature') {
            setImageSignature(result.uri);
        }
    };

    const [visible, setVisible] = React.useState(false);
    const showModal = () => setVisible(true);
    const hideModal = () => setVisible(false);
    const containerStyle = { flex: 1, alignContent: 'center', justifyContent: 'center', backgroundColor: 'white', };

    const handleOK = (signature) => {
        console.log(signature);
        setSign(signature);
    };

    const handleEmpty = () => {
        console.log("Empty");
    };

    const style = `.m-signature-pad--footer
    .button {
      background-color: purple;
      color: #FFF;
    }`;

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

    if (hasgallerypermission === false) {
        return <Text>No access to gallery </Text>;
    }


    //return screen...
    return (
        <Provider>
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

                <Text> New Entry </Text>

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

                        <List.Section>
                            <List.Accordion
                                title="Uncontrolled Accordion">
                                <List.Item title="First item" />
                                <List.Item title="Second item" />
                            </List.Accordion>
                        </List.Section>
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
                                <Paragraph> Emirates ID front: </Paragraph>
                            </Card.Content>

                            <Card.Cover source={{ uri: imageIDfront }} style={{ flex: 1, margin: 10 }} />

                            <Divider />

                            <Card.Actions style={{ justifyContent: 'space-between' }}>
                                <Button
                                    onPress={() => props.navigation.navigate("Add")} >
                                    TAKE NEW PHOTO
                                </Button>

                                <Button
                                    onPress={() => pickImage('idfront')} >
                                    OPEN GALLERY
                                </Button>
                            </Card.Actions>

                        </Card>

                    ): null
                }

                {
                    showComponent ? (
                        <Card style={styles.cardstyle}>
                            <Card.Content>
                                <Paragraph> Emirates ID back: </Paragraph>
                            </Card.Content>

                            <Card.Cover source={{ uri: imageIDback }} style={{ flex: 1, margin: 10 }} />

                            <Divider />

                            <Card.Actions style={{ justifyContent: 'space-between' }}>
                                <Button
                                    onPress={() => props.navigation.navigate("Add")} >
                                    NEW PHOTO
                                </Button>

                                <Button
                                    onPress={() => pickImage('idback')} >
                                    OPEN GALLERY
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

                            <Card.Cover source={{ uri: imageSignature }} style={{ flex: 1, margin: 10 }} />

                            <Divider />

                            <Card.Actions style={{ justifyContent: 'space-between' }}>
                                <Button
                                    onPress={() => props.navigation.navigate("Signature")} >
                                    NEW SIGNATURE
                                </Button>

                                <Button
                                    onPress={() => pickImage('signature')} >
                                    OPEN GALLERY
                                </Button>

                                    <Button onPress={showModal}>Show Dialog</Button>
                            </Card.Actions>
                        </Card>
                    ): null

                    }

                    <Portal>
                        <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={containerStyle}>
                            <Text> test </Text>
                            <Signature
                                onOK={handleOK}
                                onEmpty={handleEmpty}
                                descriptionText="Sign"
                                clearText="Clear"
                                confirmText="Save"
                                webStyle={style}
                            />
                        </Modal>
                    </Portal>


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
    preview: {
        width: 335,
        height: 114,
        backgroundColor: "#F8F8F8",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 15,
    },
    previewText: {
        color: "#FFF",
        fontSize: 14,
        height: 40,
        lineHeight: 40,
        paddingLeft: 10,
        paddingRight: 10,
        backgroundColor: "#69B2FF",
        width: 120,
        textAlign: "center",
        marginTop: 10,
    },
})