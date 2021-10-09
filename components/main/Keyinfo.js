import React, { useEffect, useState } from 'react'
import { View, Text, Image, FlatList, StyleSheet, TouchableOpacity } from 'react-native'
import { Card, FAB, Searchbar, IconButton, Chip, Paragraph, Button } from 'react-native-paper'

import firebase from 'firebase'
require("firebase/firestore")

export default function Keyinfo(props) {

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

            <View style={styles.containerInfo}>
                <Text style={{
                    fontSize: 30,
                    fontWeight: 'bold'
                }}>{keydetails.keyname} </Text>

                <View style={{ flexDirection: 'row', justifyContent: 'space-between'}}>
                    <Text> key location: {keydetails.keylocation} </Text>
                    <Text> Key Status </Text>
                </View>

                <Button
                    title='Add'
                    onPress={() => props.navigation.navigate("AddKeyHistory", { keyId: props.route.params.keyId, uid: firebase.auth().currentUser.uid })} />

            </View>
            <View style={styles.containerGallery}>

                <FlatList
                    numColumns={1}
                    horizontal={false}
                    data={keyHistory}
                    renderItem={({ item }) => (

                        <Card
                            style={styles.cardstyle}>
                                <Card.Title
                                    title={item.name}
                            />
                            <Card.Content style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
                                <Paragraph> {item.user} </Paragraph>
                                <Paragraph> {item.creation.toDate().toDateString()} </Paragraph>
                            </Card.Content>

                            <Card.Actions>
                                <Button onPress={() => props.navigation.navigate("KeyHistoryDetails", { keyId: props.route.params.keyId, listId: item.id, uid: firebase.auth().currentUser.uid })}>View</Button>
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