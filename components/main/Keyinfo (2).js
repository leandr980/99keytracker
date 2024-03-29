// JavaScript source code
import React, { useEffect, useState } from 'react'
import { View, Text, Image, FlatList, StyleSheet, Button, TouchableOpacity } from 'react-native'

import firebase from 'firebase'
require("firebase/firestore")

import { connect } from 'react-redux'

function Keyinfo(props) {

    const [userKeys, setUserKeys] = useState(null);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const { currentUser, keyinfodetails } = props;
        //console.log({ currentUser, posts })

        setUser(currentUser)
            
            firebase.firestore()
                .collection("keycollection")
                .doc(firebase.auth().currentUser.uid)
                .collection("keylist")
                .doc(props.route.params.uid)
                .get()
                .then((snapshot) => {
                    if (snapshot.exists) {

                        setUserKeys(snapshot.data());
                        console.log(snapshot.data())


                    }
                    else {
                        console.log('does not exit!')
                    }
                })
                

       
    }, [props.route.params.uid])


    if (user === null) {
        return <View />

    }


    console.log(props.route.params.uid + ' ' + firebase.auth().currentUser.uid + ' keyinfo screen ')
    console.log(userKeys + " userkeys state")

    return (
        <View style={styles.container}>
            <View style={styles.containerInfo}>
                <Text> name:  </Text>
                <Text> email:  </Text>
            </View>
        </View>
    )
}



const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 40
    },
    containerInfo: {
        margin: 20,
    },
    containerGallery: {
        flex: 1,
    },
    image: {
        flex: 1,
        aspectRatio: 1 / 1
    },
    containerImage: {
        flex: 1 / 3
    },
    containerKeylist: {
        flex: 1,
        alignItems: "center",
    }
})

const mapStateToProps = (store) => ({
    currentUser: store.userState.currentUser,
    keyinfodetails: store.userState.keyinfodetails
})

export default connect(mapStateToProps, null)(Keyinfo)