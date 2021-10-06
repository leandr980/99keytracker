// JavaScript source code
import React, { useEffect, useState } from 'react'
import { View, Text, Image, FlatList, StyleSheet, Button, TouchableOpacity } from 'react-native'
import { Card } from 'react-native-elements'

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
                <Text> Welcome {currentUser.name} </Text>
            </View>

            <View style={styles.containerGallery}>

                <FlatList
                    numColumns={1}
                    horizontal={false}
                    data={keyinfo}
                    renderItem={({ item }) => (

                        <Card style={{ borderRadius: 8 }}>
                            <View style={styles.containerKeylist}>


                                <TouchableOpacity
                                    style={styles.containerTouchable}
                                    onPress={() => props.navigation.navigate("Keyinfo", { keyId: item.id, uid: firebase.auth().currentUser.uid })}>
                                    <Text style={styles.keyliststyle}> {item.keyname} </Text>
                                    <Text style={styles.keyliststyle}> {item.keylocation} </Text>
                                    <Text style={styles.keyliststyle}> {item.id}  </Text>
                                </TouchableOpacity>
                            </View>
                            </Card>

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
        margin: 20,
        justifyContent: 'center',
    },
    containerKeylist: {
        flex: 1,
        alignItems: "center",
        flexDirection: 'row',
        justifyContent:'space-between',
        margin: 10,
    },
    containerTouchable: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    keyliststyle: {
        flex: 1,
        fontSize: 15,
    }
})

const mapStateToProps = (store) => ({
    currentUser: store.userState.currentUser,
    posts: store.userState.posts,
    keyinfo: store.userState.keyinfo
})

export default connect(mapStateToProps, null)(Profile)