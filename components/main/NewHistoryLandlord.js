// JavaScript source code
import React, { useEffect, useState, Component } from 'react'
import { View, FlatList, StyleSheet, ScrollView, Image, ImageBackground } from 'react-native'
import { Card, FAB, Searchbar, IconButton, Paragraph, Divider, Button, Chip, Colors, RadioButton, Text, TextInput, List, Portal, Dialog, Provider, Modal, ProgressBar } from 'react-native-paper'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import * as ImagePicker from 'expo-image-picker';
import { Camera } from 'expo-camera';

import firebase from 'firebase'
require("firebase/firestore")
require("firebase/firebase-storage")


export default function NewHistoryLandlord(props) {

    const creation = firebase.firestore.FieldValue.serverTimestamp()

    const [keydetails, setKeydetails] = useState([])
    const [keyId, setKeyId] = useState("")

    const [name, setfeildname] = useState("")
    const [number, setfieldnumber] = useState("")
    const [notes, setfieldnotes] = useState("")

    const [visiblePhotoFront, setVisiblePhotoFront] = React.useState(false);
    const showModalPhotoFront = () => setVisiblePhotoFront(true);
    const hideModalPhotoFront = () => setVisiblePhotoFront(false);

    const [visiblePhotoBack, setVisiblePhotoBack] = React.useState(false);
    const showModalPhotoBack = () => setVisiblePhotoBack(true);
    const hideModalPhotoBack = () => setVisiblePhotoBack(false);

    const [imageIDfront, setImageIDfront] = useState(null);
    const [imageIDback, setImageIDback] = useState(null);

    const containerStylePhoto = {flex: 1, justifyContent: 'center', backgroundColor: 'white', margin: 20, padding: 5, borderRadius: 10};

    useEffect(() => {
        (async () => {
            const gallerystatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
            sethasgallerypermission(gallerystatus.status === 'granted');

            const camerastatus = await Camera.requestPermissionsAsync();
            sethascamerapermission(camerastatus.status === 'granted');
        })();
    }, []);


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

    //Expo Image Picker
    const [hasgallerypermission, sethasgallerypermission] = useState(null);

    const pickImage = async (x) => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.cancelled && x === 'idfront') {
            setImageIDfront(result.uri);
        }

        if (!result.cancelled && x === 'idback') {
            setImageIDback(result.uri);
        }
    };

    if (hasgallerypermission === false) {
        return <Text>No access to gallery </Text>;
    }

    //Take picture using camera
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

    // Save Data to Firebase
    const saveKeyData = () => {

        // Saving data to keyhistory db
        firebase.firestore()
            .collection('keycollection')
            .doc(firebase.auth().currentUser.uid)
            .collection("keylist")
            .doc(props.route.params.keyId)
            .collection("keyhistory")
            .add({
                name,
                entrytype,
                number,
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

        // Updates the cards in key list screen
        firebase.firestore()
            .collection('keycollection')
            .doc(firebase.auth().currentUser.uid)
            .collection("keylist")
            .doc(props.route.params.keyId)
            .update({
                name: name,
                entrytype: entrytype,
                number: number,
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

    // Uploading pictures to firebase storage and generating downloadURLs
    const images = []
    //const [urls, setUrls] = useState([]);
    const urls = [];
    const [progress, setProgress] = useState(0);
    
    const handleUpload = async() => {
        
        const response1 = await fetch(imageIDfront);
        const blob1 = await response1.blob();
    
        const response2 = await fetch(imageIDback);
        const blob2 = await response2.blob();
    
        images.push(blob1)
        images.push(blob2)

        images.forEach((item) => {
            item.id = Math.random().toString(36);});

            //console.log(images[0].id + '1')
            //console.log(images[1].id + '2')

            const promises = [];
            images.map((image) => {
                const uploadTask = firebase
                .storage()
                .ref()
                .child(`post/${firebase.auth().currentUser.uid}/${image.id}`)
                .put(image);

                promises.push(uploadTask);

                uploadTask.on(

                    "state_changed",
                    (snapshot) => {
                        const progress = Math.round(

                            (snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                            setProgress(progress);},
                            
                            (error) => {
                                console.log(error);},
                                
                                async () => {   
                                    await firebase
                                    .storage()
                                    .ref()
                                    .child(`post/${firebase.auth().currentUser.uid}/${image.id}`)
                                    .getDownloadURL()
                                    .then((snapshot) => {
                                        urls.push(snapshot)
                                    });
                                }

                                

                                );
                            });
                            
                            Promise.all(promises)
                            .then(() => console.log('images uploaded'))
                            .catch((err) => console.log(err));

                            const downloadURL1 = urls[0];
                            const downloadURL2 = urls[1];
                    
                            console.log(downloadURL1 + 'url 1')
                            console.log(downloadURL2 + 'url 2')

                        };

    // Clear All Fields
    const clearKeyData = async() => {
        handleUpload();

    }

    return (
    <Provider>

        <Portal>
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
            <ImageBackground 
            style={{flex: 1}}
            imageStyle={{resizeMode: 'repeat'}}
            source={require('../../assets/bg-image/99-whatsapp-bg-small.jpg')}>

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
                    }}> New Landlord Entry </Text>

                    <Card style={styles.cardstyle}>
                        <Card.Content style={styles.cardcontentstyle}>

                            <TextInput
                                style={styles.textinputstyle}
                                type='outlined'
                                label="Name . . ."
                                onChangeText={(name) => setfeildname(name)}
                            />

                            <TextInput
                                style={styles.textinputstyle}
                                label="Phone Number . . ."
                                onChangeText={(number) => setfieldnumber(number)}
                            />

                            <TextInput
                                style={styles.textinputstyle}
                                label="Notes . . ."
                                onChangeText={(notes) => setfieldnotes(notes)}
                            />
                        </Card.Content>
                    </Card>

                    <Card style={styles.cardstyle}>
                        <Card.Title title='Emirates ID Front:' />
                        <Card.Cover source={{ uri: imageIDfront }} style={{ flex: 1, margin: 10 }} />
                        
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

                    <Card style={styles.cardstyle}>
                        <Card.Title title='Emirates ID Back:' />
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

                    <Card style={styles.cardstyle}>

                        <Card.Content style= {{marginBottom: 10}}>
                            <Paragraph>{progress}</Paragraph>
                            <ProgressBar progress={progress}/>
                        </Card.Content>

                        <Divider styles={{margin: 10}}/>

                        <Card.Actions style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                            <Button
                                onPress={() => saveKeyData()} >
                                SAVE
                            </Button>
                            <Button
                                onPress={() => clearKeyData()} >
                                CLEAR
                            </Button>
                        </Card.Actions>
                    </Card>

                </ScrollView>
                </ImageBackground>
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
        elevation: 5,
    },
    cardstyleinfo: {
        borderRadius: 10,
        margin: 10,
        elevation: 5,
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