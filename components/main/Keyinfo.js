import React, { useEffect, useState } from 'react'
import { View, Text, Image, FlatList, StyleSheet, TouchableOpacity } from 'react-native'
import {Button as ButtonDefault } from 'react-native'
import { Card, FAB, Searchbar, IconButton, Chip, Paragraph, Button, Divider, List } from 'react-native-paper'
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
                    
                </Card.Content>

                <Divider />

                <Card.Content style={{ flexWrap: 'wrap', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Paragraph > Key Status </Paragraph>
                    <Chip style={{
                        marginVertical: 5,
                        marginRight: 5,
                    }} icon="information"> {keydetails.entrytype}</Chip>
                </Card.Content>



            </Card>

            <Card style={ styles.cardstyle}>
                <Card.Actions style={{ justifyContent: 'space-between' }}>
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

                        <Card style={styles.cardstyle}>
                                <Card.Title
                                title={item.creation.toDate().toDateString()}
                            />

                            <Divider />

                            <Card.Content>
                                <List.Section >
                                    <List.Accordion
                                        title="More Info">
                                        <List.Item title={item.name} />
                                        <List.Item title={ item.company }/>
                                        <List.Item title={ item.entrytype}/>
                                        <List.Item title={ item.notes}/>
                                    </List.Accordion>
                                </List.Section>
                            </Card.Content>


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