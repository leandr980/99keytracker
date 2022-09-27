import React, { useEffect, useState, useRef } from 'react'
import { View, Text, Image, FlatList, StyleSheet, ImageBackground, ScrollView, Alert} from 'react-native'
import { Card, FAB, IconButton, Chip, Divider, Caption, Provider, List, Menu, Switch, ActivityIndicator, Colors} from 'react-native-paper'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import {format } from 'date-fns'

import firebase from 'firebase'
require("firebase/firestore")

import { Main_keyenty_component } from './keyinfo-components'

export default function Keyinfo(props) {

    const creation = firebase.firestore.FieldValue.serverTimestamp()

    const [keydetails, setKeydetails] = useState([])
    const [keyHistory, setKeyHistory] = useState([])


    const [loading, setLoading] = useState(true)

    useEffect(() => {

        setTimeout(() => {
            setLoading(false);
          }, 2000);

        console.log(props.route.params.keyId)

            const subscribe1 = firebase.firestore()
                .collection('keycollection')
                .doc(props.route.params.uid)
                .collection('keylist')
                .doc(props.route.params.keyId)
                .onSnapshot((docSnapshot) => {
                    if (!docSnapshot.metadata.hasPendingWrites) {  
                        setKeydetails(docSnapshot.data())
                        
                    }
                })

            const subscribe2 = firebase.firestore()
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
                    if (!docSnapshot.metadata.hasPendingWrites) {  
                        setKeyHistory(keyHistory)
                    }  
                })

                return () => {
                    subscribe1()
                    subscribe2()
                }
    }, [])

    const [state, setState] = React.useState({ open: false });
    const onStateChange = ({ open }) => setState({ open });
    const { open } = state;

    const [visible, setVisible] = React.useState(false);
    const openMenu = () => setVisible(true);
    const closeMenu = () => setVisible(false);

    const [visiblesettings, setVisiblesettings ] = React.useState('');

    const [updatedata, setupdatedata] = useState([])

    const deletesingledoc = (historyid) =>{
        //delete
        firebase.firestore()
            .collection('keycollection')
            .doc(props.route.params.uid)
            .collection('keylist')
            .doc(props.route.params.keyId)
            .collection('keyhistory')
            .doc(historyid)
            .delete()
            console.log('deleted doc')

    }

    const deletecollection =()=> {

        setLoading(true)

        const refnotes = firebase.firestore() 
        .collection('keycollection')
        .doc(props.route.params.uid)
        .collection('keylist')
        .doc(props.route.params.keyId)
        .collection('keyhistory')

        keyHistory.forEach((doc)=>{
            refnotes.doc(doc.id).delete()
            console.log('deleted notes doc with id: ', doc.id)
        })

        firebase.firestore()
        .collection('keycollection')
        .doc(props.route.params.uid)
        .collection('keylist')
        .doc(props.route.params.keyId)
        .delete().then((function () {
            props.navigation.pop()
        }))
    }

    return (
        <Provider>
            <View style={styles.container}>
                {
                    loading ? 
                    <ImageBackground 
                    style={{flex: 1, justifyContent: 'center'}}
                    imageStyle={{resizeMode: 'repeat'}}
                    source={require('../../assets/bg-image/99-whatsapp-bg-small.jpg')}>
                        <ActivityIndicator animating={true} color={Colors.red800} />
                    </ImageBackground>
                    : 
            <ImageBackground 
            style={{flex: 1}}
            imageStyle={{resizeMode: 'repeat'}}
            source={require('../../assets/bg-image/99-whatsapp-bg-small.jpg')}>

                        <Card style={styles.maincardstyle}>

                        <Divider/>

                            <Card.Title
                                left={() => <MaterialCommunityIcons name="file-key-outline" size={40} />}
                                right={()=> 
                                <Menu visible={visible} onDismiss={closeMenu} anchor={<IconButton icon={'cog'} onPress={openMenu}/>}>
                                <Menu.Item onPress={()=> props.navigation.navigate( 'Edit Key', { keyId: props.route.params.keyId, uid: firebase.auth().currentUser.uid })} title="EDIT" />
                                <Menu.Item onPress={()=> Alert.alert(
                                                        "Are you sure you want to delete this Key?",
                                                        "This will also delete all history items",
                                                        [
                                                            {
                                                                text: "YES",
                                                                onPress: () => deletecollection()
                                                            },
                                                            { 
                                                                text: "NO"
                                                            }
                                                        ]
                                                    )} title="DELETE" />
                                </Menu>
                                }
                                style={{
                                    fontSize: 30,
                                    fontWeight: 'bold'
                                }}
                                title={keydetails.keyname}
                                subtitle={keydetails.keybuildingvilla + ', ' + keydetails.keyarea}
                            />
                            
                            <Card.Content style={{flexDirection: 'row'}}>
                                <Caption style={{marginLeft: 55}}>{format(new Date(keydetails.creation.toDate().toString()), 'PPpp')}</Caption>
                            </Card.Content>
                        </Card>

                            <View style={styles.containerGallery}>

                            <FlatList
                                numColumns={1}
                                horizontal={false}
                                data={keyHistory}
                                renderItem={({ item }) => (
                                    <View>
                                        <Main_keyenty_component keydetails={item}/>
                                    </View>
                                )}/>
                            
                            </View>
                            <FAB.Group
                            open={open}
                            icon={open ? 'help' : 'plus'}
                            theme={{ colors: { accent: 'white' } }}
                            actions={[
                                    {
                                    icon: 'account-star',
                                    label: 'LANDLORD',
                                    onPress: () => props.navigation.navigate('Landlord', { keyId: props.route.params.keyId, uid: firebase.auth().currentUser.uid }),
                                    small: false,
                                    },
                                    {
                                    icon: 'domain',
                                    label: 'COMPANY',
                                    onPress: () => props.navigation.navigate('Company', { keyId: props.route.params.keyId, uid: firebase.auth().currentUser.uid }),
                                    small: false,
                                    },
                                    {
                                    icon: 'account-tie',
                                    label: 'AGENT',
                                    onPress: () => props.navigation.navigate('Agent', { keyId: props.route.params.keyId, uid: firebase.auth().currentUser.uid }),
                                    small: false,
                                    },
                                    {
                                    icon: 'account-question-outline',
                                    label: 'OTHER',
                                    onPress: () => props.navigation.navigate('Other', { keyId: props.route.params.keyId, uid: firebase.auth().currentUser.uid }),
                                    small: false,
                                    },
                                ]}
                                onStateChange={onStateChange}
                                onPress={() => {
                                    if (open) {
                                    // do something if the speed dial is open
                                    }
                                }}
                                />
                </ImageBackground>
                }
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

    maincardstyle: {
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
        elevation: 5,
    },

    cardstyle: {
        flex: 1,
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
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 8,
        paddingHorizontal: 16,
      },
})