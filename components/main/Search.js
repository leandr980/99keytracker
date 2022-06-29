import React, { useState } from 'react'
import { View, TextInput, FlatList, StyleSheet, ImageBackground, RefreshControl} from 'react-native'
import { Card, FAB, IconButton, Divider, Chip, Caption, Button, Title, Text } from 'react-native-paper'

import { format } from 'date-fns'
import differenceInDays from 'date-fns/differenceInDays'
import startOfDay from 'date-fns/startOfToday'

import firebase from 'firebase'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
require('firebase/firestore')

import { Dimensions } from 'react-native';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function Search(props) {
    const [keydata, setkeydata] = useState([])

    const fetchUsers = (search) => {
        firebase.firestore()
            .collection("keycollection")
            .doc(firebase.auth().currentUser.uid)
            .collection("keylist")
            .where('keyname', '>=', search)
            .get()
            .then((snapshot) => {
                let keydata = snapshot.docs.map(doc => {
                    const data = doc.data();
                    const id = doc.id;
                    return { id, ...data }
                    
                });
                setkeydata(keydata)
            })
    }

    

    const checkdate = (itemdate) => {
        const difindays = Math.abs(differenceInDays(new Date(itemdate.toDate().toString()), startOfDay()))

        switch(difindays){
            case 0:
                return 'Added today'
            case 1:
                return 'Added yesterday'
            default:
                return 'Added ' + difindays + ' days ago'
        }
    }

    return (
        <View style={{flex: 1}}>
            <Card >
                <View style={{flexDirection: 'row'}}>
                    <IconButton icon={'magnify'} size={30}/>
                    <View style={{flex:1, justifyContent: 'center'}}>
                        <TextInput style={{fontSize: 20}} placeholder="Search . . . . (Key Name)" onChangeText={(search) => fetchUsers(search)}/>
                    </View>
                    
                </View>
            </Card>

                <FlatList
                    numColumns={1}
                    horizontal={false}
                    data={keydata}
                    ListEmptyComponent={
                        <View style={{flex: 1, alignContent: 'center', justifyContent: 'center', alignItems: 'center', marginTop: windowHeight/4}}>
                            <View>
                                <Title>Quick Search</Title>
                                <Divider/>
                            </View>
                            <View style={{alignItems: 'center', marginVertical: 20}}>
                                <Text>Key Status</Text>
                                <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
                                    <Chip style={{margin: 2}}>Returned</Chip>
                                    <Chip style={{margin: 2}}>With Client</Chip>
                                </View>
                            </View>
                            <View style={{alignItems: 'center', marginVertical: 20}}>
                                <Text>Entry Type</Text>
                                <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
                                    <Chip style={{margin: 2}}>Landlord</Chip>
                                    <Chip style={{margin: 2}}>Company</Chip>
                                    <Chip style={{margin: 2}}>Agent</Chip>
                                    <Chip style={{margin: 2}}>Other</Chip>
                                </View>
                            </View>
                        </View>
                    }
                    renderItem={({ item }) => (
                        <Card style={styles.cardstyle}>

                        <Card.Title
                        left={() => <MaterialCommunityIcons name="folder-key-outline" size={40} />}
                        right={()=> <IconButton icon="eye" 
                        onPress={() => props.navigation.navigate("Keyinfo", { keyId: item.id, uid: firebase.auth().currentUser.uid })}/>}
                        title={item.keyname}
                        subtitle={item.keybuildingvilla + ', ' +item.keyarea}
                        />

                        <Card.Content>
                            <Caption style={{marginLeft: 55}}>
                            {checkdate(item.creation)}
                            </Caption>
                        </Card.Content>

                       
                    </Card>
                    )}
                />

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