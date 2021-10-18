import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Button, Image, Platform } from 'react-native';
import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';



export default function Addphoto({ navigation }) {

    const [hascamerapermission, sethascamerapermission] = useState(null);
    const [camera, setcamera] = useState(null);
    const [image, setImage] = useState(null);
    const [type, setType] = useState(Camera.Constants.Type.back);

    useEffect(() => {
        (async () => {
            const camerastatus = await Camera.requestPermissionsAsync();
            sethascamerapermission(camerastatus.status === 'granted');
        })();
    }, []);

    const takePicture = async () => {
        if (camera) {
            const data = await camera.takePictureAsync(null);
            //console.log(data.uri)
            setImage(data.uri)
        }
    }

    if (hascamerapermission === false) {
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
            <Button title="save" onPress={() => navigation.navigate('Save', { image })} />

            {image && <Image source={{ uri: image }} style={{ flex: 1 }} />}
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