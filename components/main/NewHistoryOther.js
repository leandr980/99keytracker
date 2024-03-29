// JavaScript source code
import React, { useEffect, useState, useRef } from 'react'
import { View, StyleSheet, ScrollView, Image, ImageBackground, TextInput } from 'react-native'
import { Card,  IconButton, Divider, Button, Text, Portal, Dialog, Provider, Switch } from 'react-native-paper'
import * as ImagePicker from 'expo-image-picker';
import { Camera } from 'expo-camera';

import firebase from 'firebase'
require("firebase/firestore")
require("firebase/firebase-storage")


export default function NewHistoryOther(props, { navigation }) {

    const creation = firebase.firestore.FieldValue.serverTimestamp()
    const keyhistorycreation = creation

    const [name, setfeildname] = useState("")
    const [number, setfieldnumber] = useState("")
    const [notes, setfieldnotes] = useState("")

    const entrytype = "OTHER"
    const returnedstatus = "NOT RETURNED"

    const [visiblePhotoFront, setVisiblePhotoFront] = React.useState(false);
    const showModalPhotoFront = () => setVisiblePhotoFront(true);

    const [visiblePhotoBack, setVisiblePhotoBack] = React.useState(false);
    const showModalPhotoBack = () => setVisiblePhotoBack(true);

    const [visibleAlert, setVisibleAlert] = React.useState(false);
    const showModalAlert = () => setVisibleAlert(true);
    const hideModalAlert = () => setVisibleAlert(false);

    const [imageIDfront, setImageIDfront] = useState(null);
    const [imageIDback, setImageIDback] = useState(null);

    const containerStylePhoto = {flex: 1, justifyContent: 'center', backgroundColor: 'white', margin: 20, padding: 5, borderRadius: 10};
    const containerStyleAlert = {flex: 1, justifyContent: 'center', width: 300};

    const mounted = useRef(false);

    useEffect(() => {
        mounted.current = true;

        (async () => {
            const gallerystatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
            sethasgallerypermission(gallerystatus.status === 'granted');

            const camerastatus = await Camera.requestPermissionsAsync();
            sethascamerapermission(camerastatus.status === 'granted');
        })();

        return () => { mounted.current = false; };

    }, []);

    const [loading, setLoading] = useState(false);

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
                    setVisiblePhotoFront(false)
                    break;
                case 'back':
                    setImageIDback(data.uri)
                    console.log(data.uri)
                    setVisiblePhotoBack(false)
                    break;
            }
        }
    }

    if (hascamerapermission === false) {
        return <Text>No access to camera</Text>;
    }

    // Save Data to Firebase
    const saveKeyData = (imageIDbackURL, imageIDfrontURL) => {

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
                creation,
                imageIDbackURL,
                imageIDfrontURL,
                returnedstatus

            },
                function (error) {
                    if (error) {
                        console.log("Data could not be saved." + error);
                    } else {
                        console.log("Data saved successfully.");
                    }
                }
            )

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
                keyhistorycreation: keyhistorycreation
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

            console.log("Document written with ID: ", props.route.params.keyId)

            if(mounted.current){
                setLoading(false)
            }
    }

    const [progress, setProgress] = useState(0);

    //upload images to firebase storage & get downloadURL
    const uploadimage = async(x) => {
        console.log('upload image func start')
        return new Promise (async (resolve) => {
            x.id = Math.random().toString(36)
            const uploadTask = firebase
            .storage()
            .ref()
            .child(`post/${firebase.auth().currentUser.uid}/${x.id}`)
            .put(x);

            uploadTask.on ("state_changed",

                (snapshot) => {
                    const progress = Math.round(
                        (snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                    setProgress(progress);},

                (error) => { console.log(error); },

                async () => {
                    await firebase
                        .storage()
                        .ref()
                        .child(`post/${firebase.auth().currentUser.uid}/${x.id}`)
                        .getDownloadURL()
                        .then((snapshot) => {
                            resolve(snapshot);
                            //console.log(snapshot)
                        });}
            )
        })
        .catch((err) => console.log(err))
    }
    
    //loop images into uploadimage
    const downloadURLarray = async () => {
        if(isSwitchOn == true && !name.trim() || !number.trim() === ""){
            console.log('empty fields')
            showModalAlert(true)
        }
        else if(isSwitchOn == false && ((imageIDfront === null) || (imageIDback === null))){
            console.log('empty images')
            showModalAlert(true)
        }
        else{
            setLoading(true);
            console.log('-----------------------')
            if(isSwitchOn == true){
                saveKeyData('../../assets/99nomedia.jpg','../../assets/99nomedia.jpg')
            }
            else{
                const images = []
                const urls = []
        
                const response1 = await fetch(imageIDfront);
                const blob1 = await response1.blob();
            
                const response2 = await fetch(imageIDback);
                const blob2 = await response2.blob();
            
                images.push(blob1)
                images.push(blob2)
        
                for (const image of images) {
                    const dd = await uploadimage(image)
                    urls.push(dd)
                    console.log('uploading')
                }
                console.log(urls[0], 'results1')
                console.log(urls[1], 'results2')
        
                const url1 = urls[0]
                const url2 = urls[1]
        
                saveKeyData(url1,url2)
            }
        }
    }

    // Clear All Fields
    const clearKeyData = () => {
        setImageIDback(null)
        setImageIDfront(null)
    
        console.log('clear')
    }

 

    const [isSwitchOn, setIsSwitchOn] = React.useState(false);
    const onToggleSwitch = () => setIsSwitchOn(!isSwitchOn);

    return (
    <Provider>
        <Portal>

            <Dialog visible={visiblePhotoFront} dismissable={false} contentContainerStyle={containerStylePhoto}>
                <Camera 
                ref={ref => setcamera(ref)}
                style={styles.fixedratio}
                ratio={'1:1'} />

                <Card style={{position: 'absolute', bottom: 10, left: 10, borderRadius: 100, justifyContent: 'center'}}>
                    <IconButton icon="camera" size={40} onPress={() => takePicture('front')}/> 
                </Card>

                <Card style={{position: 'absolute', bottom: 10, right: 10, borderRadius: 100, justifyContent: 'center'}}>
                    <IconButton  icon="close" size={40} onPress={() => setVisiblePhotoFront(false)}/>
                </Card>
            </Dialog>

            <Dialog visible={visiblePhotoBack} dismissable={false} contentContainerStyle={containerStylePhoto}>
                <Camera
                ref={ref => setcamera(ref)}
                style={styles.fixedratio}
                ratio={'1:1'} />
                <Card style={{position: 'absolute', bottom: 10, left: 10, borderRadius: 100, justifyContent: 'center'}}>
                    <IconButton  icon="camera" size={40} onPress={() => takePicture('back')}/>
                </Card>

                <Card style={{position: 'absolute', bottom: 10, right: 10, borderRadius: 100, justifyContent: 'center'}}>
                    <IconButton  icon="close" size={40} onPress={() => setVisiblePhotoBack(false)}/>
                </Card>
            </Dialog>

            <Dialog visible={visibleAlert} dismissable={false} contentContainerStyle={containerStyleAlert}>
                <View style={{flexDirection: 'row', margin: 10, alignItems: 'center'}}>
                    <IconButton icon={'alert'}/>
                    <Text> Some text fields/media are empty</Text>
                </View>
                
                <Dialog.Actions>
                    <Button onPress={hideModalAlert}>OK</Button>
                </Dialog.Actions>
            </Dialog>
        </Portal>

        <View style={styles.container}>
            <ImageBackground 
            style={{flex: 1}}
            imageStyle={{resizeMode: 'repeat'}}
            source={require('../../assets/bg-image/99-whatsapp-bg-small.jpg')}>

                {
                    loading ? <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>

                    <Image  source={require('../../assets/LOADING-GIF_3.gif')}/>

                </View> :

                    <ScrollView>

                    <Text style={{
                        marginHorizontal: 20,
                        fontSize: 30, 
                        fontWeight: 'bold'
                    }}> New Other Entry </Text>

                    <Card style={styles.cardstyle}>
                        <Card.Content style={styles.cardcontentstyle}>
                            <TextInput
                                style={styles.textinputstyle}
                                onChangeText={(name) => setfeildname(name)}
                                placeholder='Name . . .'
                            />

                            <TextInput
                                style={styles.textinputstyle}
                                onChangeText={(number) => setfieldnumber(number)}
                                placeholder='Number . . .'
                            />

                            <TextInput
                                style={styles.textinputstyle}
                                onChangeText={(notes) => setfieldnotes(notes)}
                                placeholder='Notes . . .'
                            />
                        </Card.Content>
                    </Card>

                    <Card style={styles.cardstyle}>
                        <Card.Title 
                        title='Do not include Emirates ID'
                        right={()=> 
                            <Switch value={isSwitchOn} onValueChange={onToggleSwitch} />
                        }
                        />
                    </Card>

                    {
                        isSwitchOn ? <></> :

                        <View>
                            <Card style={styles.cardstyle}>
                                <Card.Title title='Emirates ID Front:' />
                                <Card.Cover source={{ uri: imageIDfront }} style={{ flex: 1, margin: 10, aspectRatio: 4/3, alignSelf: "center"}} />
                                
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
                                <Card.Cover source={{ uri: imageIDback }} style={{ flex: 1, margin: 10, aspectRatio: 4/3, alignSelf: "center"}} />
                                
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
                        </View>
                    }

                    <Card style={styles.cardstyle}>

                    <Card.Actions style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                        <Button
                            onPress={() => downloadURLarray()} >
                            SAVE
                        </Button>
                        <Button
                            onPress={() => clearKeyData()} >
                            CLEAR
                        </Button>
                    </Card.Actions>
                    </Card>

                    </ScrollView>
                }

                
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
        height: 40,
        borderBottomWidth: 1,
        borderBottomColor: 'grey',
        margin: 12,
        padding: 10
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