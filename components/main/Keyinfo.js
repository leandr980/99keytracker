import React, { useEffect, useState } from 'react'
import { View, Text, Image, FlatList, StyleSheet, TouchableOpacity } from 'react-native'
import {Button as ButtonDefault } from 'react-native'
import { Card, FAB, Searchbar, IconButton, Chip, Paragraph, Button, Divider } from 'react-native-paper'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

import firebase from 'firebase'
require("firebase/firestore")

export default function Keyinfo(props) {

    const [keydetails, setKeydetails] = useState([])
    const [keyHistory, setKeyHistory] = useState([])
    const [keyId, setKeyId] = useState("")

    //console.log(props.route.params.keyId)
    //console.log(props.route.params.uid)

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

            firebase.firestore()
                .collection('keycollection')
                .doc(props.route.params.uid)
                .collection('keylist')
                .doc(props.route.params.keyId)
                .collection('keyhistory')
                .get()
                .then((snapshot) => {
                    let keyHistory = snapshot.docs.map(doc => {
                        const data = doc.data();
                        const id = doc.id;
                        return { id, ...data }
                    })
                    setKeyHistory(keyHistory)
                })

            setKeyId(props.route.params.keyId)

        }

    }, [props.route.params.keyId])

    //console.log(keydetails)

    return (

        <View style={styles.container}>

            <Card style={styles.cardstyle}>

                <Card.Title
                    left={() => <MaterialCommunityIcons name="file-key-outline" size={40} />}
                    style={{
                        fontSize: 30,
                        fontWeight: 'bold'}}
                    title={keydetails.keyname}
                />

                <Card.Content >
                    <Paragraph> key location: {keydetails.keylocation} </Paragraph>
                    <Paragraph > Key Status </Paragraph>
                </Card.Content>

                <Divider/>

                <Card.Actions style={{ justifyContent: 'space-between'}}>
                    <Button
                        onPress={() => props.navigation.navigate("AddKeyHistory", { keyId: props.route.params.keyId, uid: firebase.auth().currentUser.uid })} >
                        ADD TO HISTORY
                    </Button>
                    <Button
                        onPress={() => props.navigation.navigate("AddKeyHistory", { keyId: props.route.params.keyId, uid: firebase.auth().currentUser.uid })} >
                        EDIT DETAILS
                    </Button>
                </Card.Actions>


            </Card>

            <Divider />

            <View style={styles.containerGallery}>

                <FlatList
                    numColumns={1}
                    horizontal={false}
                    data={keyHistory}
                    renderItem={({ item }) => (

                        <Card
                            style={styles.cardstyle}>
                                <Card.Title
                                title={item.creation.toDate().toDateString()}
                            />

                            <Card.Content style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
                                <Paragraph> {item.name} </Paragraph>
                                <Paragraph> {item.user} </Paragraph>
                            </Card.Content>

                            <Divider/>

                            <Card.Actions
                                style={{justifyContent: 'center'}}>
                                <Button
                                    onPress={() => props.navigation.navigate("KeyHistoryDetails", { historyId: item.id, keyId: props.route.params.keyId, uid: firebase.auth().currentUser.uid })}
                                >VIEW HISTORY</Button>
                            </Card.Actions>

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