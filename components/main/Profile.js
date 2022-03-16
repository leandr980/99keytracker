import React, { useEffect, useState, Component } from 'react'
import { View, FlatList, StyleSheet, ScrollView } from 'react-native'
import { Card, FAB, Searchbar, IconButton, Paragraph, Divider, Button, Chip, Colors, RadioButton, Text, TextInput, List, Portal, Dialog, Provider, Modal, Caption } from 'react-native-paper'

import firebase from 'firebase'
require("firebase/firestore")
require("firebase/firebase-storage")

import { connect } from 'react-redux'

function Profile(props) {

    const { currentUser} = props;

    const onLogout = () => {
        firebase.auth().signOut();
    }

    return (
        <View style={{ flex: 1, marginTop: 40 }}>

            <Card style={styles.cardstyle}>
                <Card.Title title='Profile' />

                <Divider/>

                <Card.Content>
                    <Caption> Company: </Caption>
                    <Caption> Name: { currentUser.name }</Caption>
                    <Caption> Email: { currentUser.email }</Caption>
                    <Caption> Number: </Caption>
                </Card.Content>
            </Card>

            <Card style={styles.cardstyle}>
                <Card.Actions style={{justifyContent: 'center'}}>
                    <Button onPress={() => onLogout()}> LOGOUT </Button>
                </Card.Actions>
            </Card>
        </View>
    )
}

const styles = StyleSheet.create({
    cardstyle: {
        borderRadius: 10,
        margin: 10,
        elevation: 10
    },
})

const mapStateToProps = (store) => ({
    currentUser: store.userState.currentUser,
    posts: store.userState.posts,
    keyinfo: store.userState.keyinfo
})

export default connect(mapStateToProps, null)(Profile)
