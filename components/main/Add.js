import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Button, Image, Platform } from 'react-native';
import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';



export default function App() {
    const [hasgallerypermission, sethasgallerypermission] = useState(null);
    const [hascamerapermission, sethascamerapermission] = useState(null);
    const [camera, setcamera] = useState(null);
    const [image, setImage] = useState(null);
    const [type, setType] = useState(Camera.Constants.Type.back);

    useEffect(() => {
        (async () => {
            const camerastatus = await Camera.requestPermissionsAsync();
            sethascamerapermission(camerastatus.status === 'granted');

            const gallerystatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
            sethasgallerypermission(gallerystatus.status === 'granted');
        })();
    }, []);

    const takePicture = async () => {
        if (camera) {
            const data = await camera.takePictureAsync(null);
            console.log(data.uri)
            setImage(data.uri)
        }
    }

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        console.log(result);

        if (!result.cancelled) {
            setImage(result.uri);
        }
    };

    if (hascamerapermission=== null || hasgallerypermission === false) {
        return <View />;
    }
    if (hascamerapermission === false  || hasgallerypermission === false) {
        return <Text>No access to camera</Text>;
    }
    return (
        <View style={styles.container}>
            <View style={styles.cameracontainer}>

                <Camera
                    ref={ref => setcamera(ref)}
                    style={styles.fixedratio}
                    type={type}
                    ratio={'1:1'} />
        </View>

            <Button
                style={styles.button}
                title="Flip Image"
                onPress={() => {
                    setType(
                        type === Camera.Constants.Type.back
                            ? Camera.Constants.Type.front
                            : Camera.Constants.Type.back
                    );
                }}>
                <Text style={styles.text}> Flip </Text>
            </Button>

            <Button title="take picture" onPress={() => takePicture()} />
            <Button title="pick image from gallery" onPress={() => pickImage()} />

            {image && <Image source={{ uri: image }} style={{flex: 1}} />}
        </View>
    );
}

const styles = StyleSheet.create({
    text: {
        fontSize: 18,
        marginBottom: 10, color: 'white'
    },
    button: {
        flex: 0.1,
        alignSelf: 'flex-end',
        alignItems: 'center'
    },
    buttonContainer: {
        flex: 1,
        backgroundColor: 'transparent',
        flexDirection: 'row',
    },
    container: {
        flex: 1,
    },
    cameracontainer: {
        flex: 1,
        flexDirection: 'row'
    }, fixedratio: {
        flex: 1,
        aspectRatio: 1
    }

})