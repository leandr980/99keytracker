import React, { useState, useEffect, cloneElement } from 'react'
import { View, Text, FlatList, StyleSheet, ImageBackground, TextInput, SafeAreaView, Image} from 'react-native'
import { Card, FAB, IconButton, Divider, Chip, DataTable, Searchbar, Caption, Title, Button, Switch, Banner} from 'react-native-paper'
import { format } from 'date-fns'
import formatDistanceToNow from 'date-fns/formatDistanceToNow'
import DateTimePicker from '@react-native-community/datetimepicker'


import firebase from 'firebase'
import { Icon } from 'react-native-elements'
require("firebase/firestore")

export default function Leadinfo(props) {

    const creation = firebase.firestore.FieldValue.serverTimestamp()

    const [leadinfo, setleadinfo] = useState([])
    const [leadinfodate, setleadinfodate] = useState([])
    const [leadnotes, setleadnotes] = useState([])

    const [isSwitchOn, setIsSwitchOn] = useState(false)

    const [notes, setnotes] = useState('') 

    
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
                
                const subscribe2 = firebase.firestore()
                .collection("leadscollection")
                    .doc(firebase.auth().currentUser.uid)
                    .collection("leadslist")
                    .doc(props.route.params.LeadId)
                    .collection('leadnotes')
                    .onSnapshot((docSnapshot) => {
                        if(docSnapshot.docs == undefined){
                            console.log('notes empty')
                        }
                        else{
                            let leadnotes = docSnapshot.docs.map(doc => {
                                const data = doc.data();
                                const id = doc.id;
                                return { id, ...data }
                                
                            })
                            //console.log(keyinfo2, 'fetchkeyinfo2')
                            if (!docSnapshot.metadata.hasPendingWrites) {  // <======
                                setleadnotes(leadnotes)
                            }
                        }
                    })
                    

                return () => {
                    subscribe()
                    subscribe2()
                }
            }, [])
    
    const budgetcheck = () =>{
        if (leadinfo.budget == ''){
            return true
        }
        else{
            return false
        }
    }
    
    const addnewnote = () => {
        firebase.firestore()
        .collection('leadscollection')
        .doc(firebase.auth().currentUser.uid)
        .collection("leadslist")
        .doc(props.route.params.LeadId)
        .collection('leadnotes')
        .add({
            notes,
            creation
        }).then(setIsSwitchOn(false))
    }

    return (
        <View style={styles.container}>
            <Divider/>
            <ImageBackground 
            style={{flex: 1}}
            imageStyle={{resizeMode: 'repeat'}}
            source={require('../../assets/bg-image/99-whatsapp-bg-small.jpg')}>
                <SafeAreaView>

                <FlatList
                numColumns={1}
                horizontal={false}
                removeClippedSubviews={false}
                ListHeaderComponent={
                    <View>
                        <Card style={styles.cardstyle}>
                            <Card.Content style={{alignItems: 'center', justifyContent: 'center'}}>
                            <Text style={{fontSize: 30}}>{leadinfo.name}</Text>
                            <Caption>{leadinfo.number}</Caption>
                            <Caption>{leadinfo.email}</Caption>
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
                                <View style={{flexDirection: 'row', justifyContent: 'space-between', marginVertical: 20, alignItems: 'center'}}>
                                    <Text>Status</Text>
                                    <Chip>NOT CONTACTED</Chip>
                                </View>
                                <View style={{flexDirection: 'row', justifyContent: 'space-between', marginVertical: 20, alignItems: 'center'}}>
                                    <Text>Sale / Rent</Text>
                                    <Chip>{leadinfo.salerent}</Chip>
                                </View>
                                <View style={{flexDirection: 'row', justifyContent: 'space-between', marginVertical: 20, alignItems: 'center'}}>
                                    <Text>Property Status</Text>
                                    <Chip>{leadinfo.propertystatus}</Chip>
                                </View>
                                <View style={{flexDirection: 'row', justifyContent: 'space-between', marginVertical: 20, alignItems: 'center'}}>
                                    <Text>Property Type</Text>
                                    <Chip>{leadinfo.propertytype}</Chip>
                                </View>
                                <View style={{flexDirection: 'row', justifyContent: 'space-between', marginVertical: 20, alignItems: 'center'}}>
                                    <Text>Area</Text>
                                    <Chip>{leadinfo.multiplearea}</Chip>
                                </View>
                                <View style={{flexDirection: 'row', justifyContent: 'space-between', marginVertical: 20, alignItems: 'center'}}>
                                    <Text>Number of Bedrooms</Text>
                                    <Chip>{leadinfo.bedroom}</Chip>
                                </View>
                                <View style={{flexDirection: 'row', justifyContent: 'space-between', marginVertical: 20, alignItems: 'center'}}>
                                    <Text>Build-Up Area</Text>
                                    <View style={{flexDirection: 'row'}}>
                                        <Chip>{leadinfo.builduparea}</Chip>
                                        <Chip>{leadinfo.buildupareatype}</Chip>
                                    </View>
                                </View>
                                <View style={{flexDirection: 'row', justifyContent: 'space-between', marginVertical: 20, alignItems: 'center'}}>
                                    <Text>Budget</Text>
                                    {
                                        budgetcheck() ?
                                        <View style={{flexDirection: 'row'}}>
                                            <Chip>Min Budget: {leadinfo.minbudget}</Chip>
                                            <Chip>Max Budget: {leadinfo.maxbudget}</Chip>
                                        </View>
                                            :
                                        <View style={{flexDirection: 'row'}}>
                                            <Chip>{leadinfo.budget}</Chip>
                                        </View>
                                    }
                                </View>
                                <View style={{flexDirection: 'row', justifyContent: 'space-between', marginVertical: 20, alignItems: 'center'}}>
                                    <Text>Furnishing</Text>
                                    <Chip>{leadinfo.furnishing}</Chip>
                                </View>
                                <View style={{flexDirection: 'row', justifyContent: 'space-between', marginVertical: 20, alignItems: 'center'}}>
                                    <Text>Lead Source</Text>
                                    <Chip>{leadinfo.leadsource}</Chip>
                                </View>
                                <View style={{flexDirection: 'row', justifyContent: 'space-between', marginVertical: 20, alignItems: 'center'}}>
                                    <Text>Creation</Text>
                                    <View style={{flexDirection: 'row'}}>
                                    </View>
                                </View>

                            </Card.Content>
                        </Card>

                    </View>
                }
                ListEmptyComponent={<></>}
                ListFooterComponent={
                    <View style={{flex: 1}}>
                        {
                            isSwitchOn ? 
                            <Card style={styles.cardstyle}>
                                <Card.Content>
                                    <Title>Add New Note</Title>
                                    <TextInput
                                    style={styles.textinputstyle}
                                    type='outlined'
                                    placeholder=". . . ."
                                    onChangeText={(item) => setnotes(item)}/>
                                </Card.Content>
                                <Card.Actions style={{justifyContent: 'space-between'}}>
                                    <Button onPress={()=> setIsSwitchOn(false)}>Cancel</Button>
                                    <Button onPress={()=> addnewnote()}>Ok</Button>
                                </Card.Actions>
                            </Card>: <></>
                        }

                        {
                            isSwitchOn ? 
                            <></> :
                            <View style={{justifyContent: 'center', alignContent: 'center', alignItems: 'center', marginVertical: 20}}>
                                <Button style={{borderRadius: 300}} icon="plus" mode="contained" onPress={()=> setIsSwitchOn(true)}> New Note </Button>
                            </View>
                        }
                    </View>
                }
                data={leadnotes}
                renderItem={({ item }) => (
                    <Card style={styles.cardstyle}>
                        <Card.Content>
                        <Title>Note added on {format(new Date(item.creation.toDate().toString()), 'PP')}</Title>
                        <Divider style={{margin: 10}}/>
                        <Text>{item.notes}</Text>
                        </Card.Content>
                    </Card>
                )}/>
                </SafeAreaView>
            </ImageBackground>
        </View>
        )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,

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
    textinputstyle: {
        marginVertical: 20,
        borderBottomWidth: 0.5,
        borderBottomColor: 'grey',
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