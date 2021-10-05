// JavaScript source code
import React, { useEffect, useState } from 'react'
import { View, Text, Image, FlatList, StyleSheet, Button, TouchableOpacity } from 'react-native'

import firebase from 'firebase'
require ("firebase/firestore")

import { connect } from 'react-redux'
    
function Profile(props) {

    const { currentUser, keyinfo } = props;

    //console.log({ currentUser, keyinfo }, props.route.params.uid)
    //console.log("profile screen")


    const onLogout = () => {
        firebase.auth().signOut();
    }


    if (currentUser === null) {
        return <View/>
    }

    return (
        <View style={styles.container}>
            <View style={styles.containerInfo}>
                <Text> name: {currentUser.name} </Text>
                <Text> email:  {currentUser.email}</Text>
                <Text> uid:  {currentUser.uid}</Text>

                <Button title='logout' onPress={() => onLogout()} />
            </View>

            <View style={styles.containerGallery}>

                <FlatList
                    numColumns={1}
                    horizontal={false}
                    data={keyinfo}
                    renderItem={({ item }) => (
                        <View style={styles.containerKeylist}>
                            <TouchableOpacity
                                onPress={() => props.navigation.navigate("Keyinfo", { keyId: item.id, uid: firebase.auth().currentUser.uid})}>
                                <Text> {item.keyname} {item.keylocation} {item.id}  </Text>
                            </TouchableOpacity>

                        </View>

                    )}
                />
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
        aspectRatio: 1/1
    },
    containerImage: {
        flex: 1/3
    },
    containerKeylist: {
        flex: 1,
        alignItems: "center",
        margin: 10,
    }
})

const mapStateToProps = (store) => ({
    currentUser: store.userState.currentUser,
    posts: store.userState.posts,
    keyinfo: store.userState.keyinfo
})

export default connect(mapStateToProps, null)(Profile)