import React, { useEffect, useState, Component } from 'react'
import { View, FlatList, StyleSheet, ScrollView, Image } from 'react-native'
import { Card, FAB, Searchbar, IconButton, Paragraph, Divider, Button, Chip, Colors, RadioButton, Text, TextInput, List, Portal, Dialog, Provider, Modal } from 'react-native-paper'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import * as ImagePicker from 'expo-image-picker';
import { Camera } from 'expo-camera';
import Signature from "react-native-signature-canvas";
import base64 from 'base-64'
import utf8 from 'utf8'

import firebase from 'firebase'
require("firebase/firestore")
require("firebase/firebase-storage")

export default function AddHistory(props) {

    const [name, setfeildname] = useState("")
    const [entrytype, setfieldentrytype] = useState("") 
    const [company, setfieldcompany] = useState("")
    const [notes, setfieldnotes] = useState("")

    const creation = firebase.firestore.FieldValue.serverTimestamp()

    const [buttonLandlord, setButtonLandlord] = useState(false)
    const [buttonCompany, setButtonCompany] = useState(false)
    const [buttonAgent, setButtonAgent] = useState(false)
    const [buttonOther, setButtonOther] = useState(false)

    const [showComponent, setShowComponent] = useState(false)

    const [buttonSelectedText, setButtonSelectedText] = useState('NONE')

    useEffect(() => {
        (async () => {
            const gallerystatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
            sethasgallerypermission(gallerystatus.status === 'granted');

            const camerastatus = await Camera.requestPermissionsAsync();
            sethascamerapermission(camerastatus.status === 'granted');
        })();
    }, []);

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

    const [hasgallerypermission, sethasgallerypermission] = useState(null);
    const [imageIDfront, setImageIDfront] = useState(null);
    const [imageIDback, setImageIDback] = useState(null);
    const [imageSignature, setImageSignature] = useState(null);

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

    if (hasgallerypermission === false) {
        return <Text>No access to gallery </Text>;
    }


    const [visibleSignature, setVisibleSignature] = React.useState(false);
    const showModalSignature = () => setVisibleSignature(true);
    const hideModalSignature = () => setVisibleSignature(false);
    const containerStyleSignature = {flex: 1, justifyContent: 'center', backgroundColor: 'white', margin: 20, padding: 5, borderRadius: 10};
    const containerStylePhoto = {flex: 1, justifyContent: 'center', backgroundColor: 'white', margin: 20, padding: 5, borderRadius: 10};

    const handleOK = (signature) => {
        console.log(signature);
        setImageSignature(signature);
    };

    const handleEmpty = () => {
        console.log("Empty");
    };

    const style = `.m-signature-pad--footer
    .button {
      background-color: purple;
      color: #FFF;
    }`;

    const [visiblePhotoFront, setVisiblePhotoFront] = React.useState(false);
    const showModalPhotoFront = () => setVisiblePhotoFront(true);
    const hideModalPhotoFront = () => setVisiblePhotoFront(false);

    const [visiblePhotoBack, setVisiblePhotoBack] = React.useState(false);
    const showModalPhotoBack = () => setVisiblePhotoBack(true);
    const hideModalPhotoBack = () => setVisiblePhotoBack(false);

    const [hascamerapermission, sethascamerapermission] = useState(null);
    const [camera, setcamera] = useState(null);


    const takePicture = async (x) => {
        if (camera) {
            const data = await camera.takePictureAsync(null);
            //console.log(data.uri)

            switch (x) {
                case 'front':
                    setImageIDfront(data.uri)
                    console.log(data.uri)
                    break;
                case 'back':
                    setImageIDback(data.uri)
                    console.log(data.uri)
                    break;
            }
        }
    }

    if (hascamerapermission === false) {
        return <Text>No access to camera</Text>;
    }

    const iconbuttonpress = (buttonname) => {

        switch (buttonname) {

            case 'landlord':
                setButtonLandlord(true)
                setButtonCompany(false)
                setButtonAgent(false)
                setButtonOther(false)
                setButtonSelectedText('LANDLORD')
                setfieldentrytype('LANDLORD')
                setShowComponent(false)
                break;

            case 'company':
                setButtonLandlord(false)
                setButtonCompany(true)
                setButtonAgent(false)
                setButtonOther(false)
                setButtonSelectedText('COMPANY')
                setfieldentrytype('COMPANY')
                setShowComponent(false)
                break;

            case 'agent':
                setButtonLandlord(false)
                setButtonCompany(false)
                setButtonAgent(true)
                setButtonOther(false)
                setButtonSelectedText('AGENT')
                setfieldentrytype('AGENT')
                setShowComponent(true)
                break;

            case 'other':
                setButtonLandlord(false)
                setButtonCompany(false)
                setButtonAgent(false)
                setButtonOther(true)
                setButtonSelectedText('OTHER')
                setfieldentrytype('OTHER')
                setShowComponent(false)
                break;
        }
    }

    const uploaddata = async () => {

            const responseIDfront = await fetch(imageIDfront);
            const responseIDback = await fetch(imageIDfront);

            const blobIDfront = await responseIDfront.blob();
            const blobIDback = await responseIDback.blob();

            const blobarr = [blobIDback, blobIDfront]
            const downloadurlarr = []

            for (let i = 0; i < blobarr.length; i++) {
                try {
                    const task = firebase
                        .storage()
                        .ref()
                        .child(`post/${firebase.auth().currentUser.uid}/${Math.random().toString(36)}`)
                        .put(blobarr[i]);

                    const taskProgress = snapshot => {
                        console.log(`transfered: ${snapshot.bytesTransferred / snapshot.totalBytes * 100}`)
                    }

                    const taskCompleted = () => {
                        task.snapshot.ref.getDownloadURL().then((snapshot) => {
                            downloadurlarr.push(snapshot)
                            console.log(snapshot)
                        })
                    }

                    const taskError = snapshot => {
                        console.log(snapshot)
                    }

                    task.on("state_changed", taskProgress, taskError, taskCompleted)

                }
                catch (error) {
                    console.log(error)
                }

        }
        return downloadurlarr;
    }

    const saveKeyData = () => {

        firebase.firestore()
            .collection('keycollection')
            .doc(firebase.auth().currentUser.uid)
            .collection("keylist")
            .doc(props.route.params.keyId)
            .collection("keyhistory")
            .add({
                name,
                entrytype,
                company,
                notes,
                creation
            },
                function (error) {
                    if (error) {
                        console.log("Data could not be saved." + error);
                    } else {
                        console.log("Data saved successfully.");
                    }
                }
            )

        console.log("Document written with ID: ", props.route.params.keyId)

        firebase.firestore()
            .collection('keycollection')
            .doc(firebase.auth().currentUser.uid)
            .collection("keylist")
            .doc(props.route.params.keyId)
            .update({
                name: name,
                entrytype: entrytype,
                company: company,
                notes: notes
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



    const clearKeyData = () => {
        setImageSignature(null)
        setImageIDfront(null)
        setImageIDback(null)

        setButtonLandlord(false)
        setButtonCompany(false)
        setButtonAgent(false)
        setButtonOther(false)
        setButtonSelectedText('NONE')

        if (showComponent === true) {
            setShowComponent(false)
        }
    }

    //return screen...
    return (
        <Provider>
            <Portal>
                <Modal visible={visibleSignature} onDismiss={hideModalSignature} contentContainerStyle={containerStyleSignature}>
                    <Signature
                        onOK={handleOK}
                        onEmpty={handleEmpty}
                        descriptionText="Tap outside the area after saving"
                        clearText="Clear"
                        confirmText="Save"
                        webStyle={style}
                        imageType="image/jpeg"
                        backgroundColor={'rgb(255,255,255)'}
                    />
                </Modal>

                <Modal visible={visiblePhotoFront} onDismiss={hideModalPhotoFront} contentContainerStyle={containerStylePhoto}>
                    <Camera
                        ref={ref => setcamera(ref)}
                        style={styles.fixedratio}
                        ratio={'1:1'} />


                    <Button onPress={() => takePicture('front')}> Take Picture </Button>
                </Modal>

                <Modal visible={visiblePhotoBack} onDismiss={hideModalPhotoBack} contentContainerStyle={containerStylePhoto}>
                    <Camera
                        ref={ref => setcamera(ref)}
                        style={styles.fixedratio}
                        ratio={'1:1'} />


                    <Button onPress={() => takePicture('back')}> Take Picture </Button>
                </Modal>
            </Portal>


            <View style={styles.container}>

                <Card style={styles.cardstyleinfo}>

                    <Card.Title
                        left={() => <MaterialCommunityIcons name="file-key-outline" size={40} />}
                        style={{
                            fontSize: 30,
                            fontWeight: 'bold'
                        }}
                        title={keydetails.keyname}
                        subtitle={keydetails.keylocation}
                    />

                    <Divider style={{ marginBottom: 5 }} />

                    <Card.Content style={{ flexWrap: 'wrap', flexDirection: 'row', alignItems: 'center' }}>
                        <Chip style={{
                            marginTop: 5,
                            marginRight: 5
                        }} icon="information"> {keydetails.entrytype}</Chip>
                        <Chip style={{
                            marginTop: 5,
                            marginRight: 5
                        }} icon="account-star"> {keydetails.name}</Chip>
                        <Chip style={{
                            marginTop: 5,
                            marginRight: 5
                        }} icon="domain"> {keydetails.company}</Chip>
                    </Card.Content>
                </Card>

                <Divider />

                <ScrollView>

                    <Text style={{
                        marginHorizontal: 20,
                        fontSize: 30,
                        fontWeight: 'bold'
                    }}> New Entry </Text>

                    <Card style={styles.cardstyle}>

                        <Card.Content style={{ flexWrap: 'wrap', flexDirection: 'row', alignItems: 'center', }}>

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
                            <Text style={{ marginVertical: 10 }}> SELECTED: {buttonSelectedText} </Text>
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


                    {showComponent ? (
                        <Card style={styles.cardstyle}>

                            <Card.Title title='Emirates ID Back:' />

                            <Card.Cover source={{ uri: imageIDfront }} style={{ flex: 1, margin: 10 }} />

                            <Divider />

                            <Card.Actions style={{ justifyContent: 'space-between' }}>
                                <Button
                                    onPress={showModalPhotoFront} >
                                    NEW PHOTO
                                </Button>

                                <Button
                                    onPress={() => pickImage('idfront')} >
                                    OPEN GALLERY
                                </Button>
                            </Card.Actions>
                        </Card>
                    ) : null}

                    { showComponent ? (
                        <Card style={styles.cardstyle}>

                            <Card.Title title='Emirates ID front:' />

                            <Card.Cover source={{ uri: imageIDback }} style={{ flex: 1, margin: 10 }} />

                            <Divider />

                            <Card.Actions style={{ justifyContent: 'space-between' }}>
                                <Button
                                    onPress={showModalPhotoBack} >
                                    NEW PHOTO
                                </Button>

                                <Button
                                    onPress={() => pickImage('idback')} >
                                    OPEN GALLERY
                                </Button>
                            </Card.Actions>
                        </Card>
                    ) : null}

                    <Card style={styles.cardstyle}>
                        <Card.Actions style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                            <Button
                                onPress={() => uploadsignature()} >
                                SAVE
                            </Button>
                            <Button
                                onPress={() => clearKeyData()} >
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
    cameracontainer: {
        flex: 1,
        flexDirection: 'row'
    },
    fixedratio: {

        aspectRatio: 1
    }
})