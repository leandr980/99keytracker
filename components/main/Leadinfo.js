import React, { useState, useEffect } from 'react'
import { View, Text, FlatList, StyleSheet, ImageBackground, RefreshControl, ScrollView, InteractionManager} from 'react-native'
import { Card, FAB, IconButton, Divider, Chip, DataTable, Searchbar, Caption} from 'react-native-paper'
import { format } from 'date-fns'
import formatDistanceToNow from 'date-fns/formatDistanceToNow'


import firebase from 'firebase'
require("firebase/firestore")

export default function Leadinfo(props) {

    const [leadinfo, setleadinfo] = useState([])
    const [leadinfodate, setleadinfodate] = useState([])

    useEffect(() => {

        console.log(props.route.params.LeadId)

            const subscribe = firebase.firestore()
                .collection("leadscollection")
                .doc(props.route.params.uid)
                .collection("leadslist")
                .doc(props.route.params.LeadId)
                .onSnapshot((docSnapshot) => {
                    if (!docSnapshot.metadata.hasPendingWrites) {  
                        setleadinfo(docSnapshot.data())
                        setleadinfodate(docSnapshot.data().creation.toDate().toString())
                    }
                })

                return () => {
                    subscribe()
                }
    }, [])

    const deletesingledoc = (historyid) =>{
        //delete
        firebase.firestore()
            .collection("leadscollection")
            .doc(props.route.params.uid)
            .collection("leadslist")
            .doc(props.route.params.LeadId)
            .delete()
            .then((function () {
                props.navigation.pop()}))
            console.log('deleted doc')
    }

    return (
        <View style={styles.container}>
            <ImageBackground 
            style={{flex: 1}}
            imageStyle={{resizeMode: 'repeat'}}
            source={require('../../assets/bg-image/99-whatsapp-bg-small.jpg')}>

                <Card style={styles.cardstyle}>
                    <Card.Content style={{alignItems: 'center', justifyContent: 'center'}}>
                    <Text style={{fontSize: 30}}>{leadinfo.name}</Text>
                    <Caption>{leadinfo.number}</Caption>
                    <Caption>Email</Caption>
                    <View style={{flexDirection: 'row', size: 30}}>
                        <IconButton icon='whatsapp'/>
                        <IconButton icon='phone-outline'/>
                        <IconButton icon='android-messages'/>
                        <IconButton icon='email'/>
                    </View>
                    </Card.Content>
                </Card>

                <Card style={styles.cardstyle}>
                    <Card.Content>
                        <View style={{flexDirection: 'row', justifyContent: 'space-between', marginVertical: 20}}>
                            <Text>Status</Text>
                            <Text>NOT CONTACTED</Text>
                        </View>
                        <View style={{flexDirection: 'row', justifyContent: 'space-between', marginVertical: 20}}>
                            <Text>Area</Text>
                            <Text>{leadinfo.area}</Text>
                        </View>
                        <View style={{flexDirection: 'row', justifyContent: 'space-between', marginVertical: 20}}>
                            <Text>Property Type</Text>
                            <Text>{leadinfo.propertytype}</Text>
                        </View>
                        <View style={{flexDirection: 'row', justifyContent: 'space-between', marginVertical: 20}}>
                            <Text>Number of Bedrooms</Text>
                            <Text>{leadinfo.bedrooms}</Text>
                        </View>
                        <View style={{flexDirection: 'row', justifyContent: 'space-between', marginVertical: 20}}>
                            <Text>Rent / Sale</Text>
                            <Text>{leadinfo.salerent}</Text>
                        </View>
                        <View style={{flexDirection: 'row', justifyContent: 'space-between', marginVertical: 20}}>
                            <Text>Budget</Text>
                            <Text>{leadinfo.budget}</Text>
                        </View>
                        <View style={{flexDirection: 'row', justifyContent: 'space-between', marginVertical: 20}}>
                            <Text>Property Status</Text>
                            <Text>{leadinfo.budget}</Text>
                        </View>
                        <View style={{flexDirection: 'row', justifyContent: 'space-between', marginVertical: 20}}>
                            <Text>Lead Source</Text>
                            <Text>{leadinfo.budget}</Text>
                        </View>

                    </Card.Content>
                </Card>
                <Card style={styles.cardstyle}>
                    <Text>notes</Text>
                </Card>
                <IconButton icon='delete-outline' onPress={()=>deletesingledoc()}/>
            </ImageBackground>
        </View>
        )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 30
    },
    containerInfo: {
        margin: 10,
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center'
    },
    containerGallery: {
        flex: 1,
        justifyContent: 'center',

    },
    keyliststyle: {
        flex: 1,
        fontSize: 15,
    },

    maincardstyle: {
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
        elevation: 5,
    },

    cardstyle: {
        margin: 5,
        elevation: 5
    },
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
    },
})