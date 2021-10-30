import React, { useEffect, useState } from 'react'
import { View, Text, Image, FlatList, StyleSheet, TouchableOpacity } from 'react-native'
import {Button as ButtonDefault } from 'react-native'
import { Card, FAB, Searchbar, IconButton, Chip, Paragraph, Button, Divider, Caption, Provider, Portal, Dialog } from 'react-native-paper'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

import firebase from 'firebase'
require("firebase/firestore")

export default function Keyinfo(props) {

    const [keydetails, setKeydetails] = useState([])
    const [keyHistory, setKeyHistory] = useState([])

    const [keyId, setKeyId] = useState("")

    const [visabledialogue, setvisabledialogue] = useState(false)
    const hideDialog = () => setvisabledialogue(false);

    useEffect(() => {

        if (props.route.params.keyId !== keyId) {

            firebase.firestore()
                .collection('keycollection')
                .doc(props.route.params.uid)
                .collection('keylist')
                .doc(props.route.params.keyId)
                .onSnapshot((docSnapshot) => {
                    setKeydetails(docSnapshot.data())
                })

            firebase.firestore()
                .collection('keycollection')
                .doc(props.route.params.uid)
                .collection('keylist')
                .doc(props.route.params.keyId)
                .collection('keyhistory')
                .orderBy("creation", "desc")
                .onSnapshot((docSnapshot) => {
                    let keyHistory = docSnapshot.docs.map(doc => {
                        const data = doc.data();
                        const id = doc.id;
                        return { id, ...data }
                    })
                    setKeyHistory(keyHistory)
                })

            setKeyId(props.route.params.keyId)

        }

    }, [props.route.params.keyId])

    const deletehistory = () => {
        setvisabledialogue(true)

    }

    const deletehistorydialogue = (itemid) => {

        firebase.firestore()
            .collection('keycollection')
            .doc(props.route.params.uid)
            .collection('keylist')
            .doc(props.route.params.keyId)
            .collection('keyhistory')
            .doc(itemid)
            .delete()
            .then(() => {
                console.log("Document successfully deleted!");
            }).catch((error) => {
                console.error("Error removing document: ", error);
            })
    }

    return (
        <Provider>

            <Portal>
                <Dialog visible={visabledialogue} onDismiss={hideDialog}>
                    <Dialog.Title>Alert</Dialog.Title>
                    <Dialog.Content>
                        <Paragraph>Are you sure you want to delete this log?</Paragraph>
                    </Dialog.Content>
                    <Dialog.Actions style={{justifyContent: 'space-between'}}>
                        <Button onPress={hideDialog}>CONFIRM</Button>
                        <Button onPress={hideDialog}>CANCEL</Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>

            <View style={styles.container}>

                <Card style={styles.cardstyle}>

                    <Card.Title
                        left={() => <MaterialCommunityIcons name="file-key-outline" size={40} />}
                        style={{
                            fontSize: 30,
                            fontWeight: 'bold'
                        }}
                        title={keydetails.keyname}
                        subtitle={keydetails.keylocation}
                    />

                    <Divider style={{ marginBottom: 5 }} />

                    <Card.Content style={{ flexWrap: 'wrap', flexDirection: 'row', alignItems: 'center' }}>
                        <Chip style={{
                            marginTop: 5,
                            marginRight: 5
                        }} icon="information"> {keydetails.entrytype}</Chip>
                        <Chip style={{
                            marginTop: 5,
                            marginRight: 5
                        }} icon="account-star"> {keydetails.name}</Chip>
                        <Chip style={{
                            marginTop: 5,
                            marginRight: 5
                        }} icon="domain"> {keydetails.company}</Chip>
                    </Card.Content>
                </Card>

                <Divider />

                <View style={styles.containerGallery}>

                    <FlatList
                        numColumns={1}
                        horizontal={false}
                        data={keyHistory}

                        renderItem={({ item, index }) => (

                            <Card style={styles.cardstyle}>
                                <Card.Title
                                    title={index}
                                />

                                <Divider />

                                <Card.Content>

                                    <Caption> Name: {item.name} </Caption>
                                    <Caption> Company: {item.company} </Caption>
                                    <Caption> Type: {item.entrytype} </Caption>
                                    <Caption> Notes: {item.notes} </Caption>
                                </Card.Content>


                            </Card>
                        )}
                    />
                </View>

                <FAB
                    style={styles.fab}
                    theme={{ colors: { accent: 'white' } }}
                    color='blue'
                    large
                    icon="plus"
                    label="NEW LOG"
                    onPress={() => props.navigation.navigate("AddKeyHistory", { keyId: props.route.params.keyId, uid: firebase.auth().currentUser.uid })}
                />
            </View>
        </Provider>
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