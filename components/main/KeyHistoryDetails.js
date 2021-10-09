import React, { useEffect, useState } from 'react'
import { View, Text, Image, FlatList, StyleSheet, Button, TouchableOpacity } from 'react-native'
import { Card, FAB, Searchbar, IconButton, Chip, Paragraph, Divider, Title } from 'react-native-paper'

import firebase from 'firebase'
require("firebase/firestore")

export default function KeyHistoryDetails(props) {

    const [keydetails, setKeydetails] = useState([])
    const [keyHistory, setKeyHistory] = useState([])
    const [keyId, setKeyId] = useState("")
    const [text, setText] = useState("")

    //console.log(props.route.params.keyId)
    //console.log(props.route.params.uid)

    useEffect(() => {

        if (props.route.params.keyId !== keyId) {
            firebase.firestore()
                .collection('keycollection')
                .doc(props.route.params.uid)
                .collection('keylist')
                .doc(props.route.params.keyId)
                .collection('keyhistory')
                .doc(props.route.params.listId)
                .get()
                .then((snapshot) => {
                    setKeydetails(snapshot.data())
                })

            setKeyId(props.route.params.keyId)

        }

    }, [props.route.params.keyId])

    //console.log(keydetails)

    return (

        <View style={styles.container}>

            <Card>
                <Card.Content>
                    <Title style={{
                        fontSize: 30,
                        fontWeight: 'bold'}}> {keydetails.keyname} </Title>
                </Card.Content>

            </Card>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 20
    },
    containerInfo: {
        margin: 10,
    },
    containerGallery: {
        flex: 1,
        justifyContent: 'center',

    },
    keyliststyle: {
        flex: 1,
        fontSize: 15,
    },
    cardstyle: {
        borderRadius: 10,
        margin: 10,
        elevation: 5
    },
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
    },
})