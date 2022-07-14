// JavaScript source code
import React, { useState, useEffect } from 'react'
import { View, Text, FlatList, StyleSheet, ImageBackground, RefreshControl} from 'react-native'
import { Card, FAB, IconButton, Divider, Chip, Caption, Button } from 'react-native-paper'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { format } from 'date-fns'
import differenceInDays from 'date-fns/differenceInDays'
import startOfDay from 'date-fns/startOfToday'

import firebase from 'firebase'
require ("firebase/firestore")

import { connect } from 'react-redux'

const wait = (timeout) => {
        return new Promise(resolve => setTimeout(resolve, timeout));
      }

function Keylist(props) {

    useEffect(() => {

            const subscribe2 = firebase.firestore()
                .collection('keycollection')
                .doc(firebase.auth().currentUser.uid)
                .collection('keylistentry')
                .orderBy('creation', 'desc')
                .onSnapshot((docSnapshot) => {
                    let keyHistory = docSnapshot.docs.map(doc => {
                        const data = doc.data();
                        const id = doc.id;
                        return { id, ...data }
                    })
                    if (!docSnapshot.metadata.hasPendingWrites) {  
                        setkeylistentry(keyHistory)
                    }  
                })

                return () => {
                    subscribe2()
                }
    }, [])

    const [keylistentry, setkeylistentry] = useState([])

    const [refreshing, setRefreshing] = React.useState(false);
    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        wait(2000).then(() => setRefreshing(false));}, []);

    const { currentUser, keyinfo, keyinfodetails} = props;

    if (currentUser === null) {
        return <View/>
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

        <View style={styles.container}>
            <ImageBackground 
            style={{flex: 1}}
            imageStyle={{resizeMode: 'repeat'}}
            source={require('../../assets/bg-image/99-whatsapp-bg-small.jpg')}>

            <Card style={styles.maincardstyle}>
                <View style={styles.containerInfo}>
                    <Caption style={{ fontSize: 20, margin: 5 }}> Welcome {currentUser.name} </Caption>
                    <IconButton icon={'magnify'} onPress={() => props.navigation.navigate('Search', {uid: firebase.auth().currentUser.uid})}/>
                </View>
            </Card>

            <Divider />

            <View style={styles.containerGallery}>
                <FlatList
                numColumns={1}
                horizontal={false}
                ListHeaderComponent={
                    <View>
                        <Text style={{ fontSize: 30, fontWeight: 'bold', marginLeft: 10 }}> Recent Entries </Text>
                    </View>
                }
                ListEmptyComponent={<View style={{alignItems: 'center'}}> 
                    <Caption style={{marginTop: 80, marginLeft: 10}}>List is empty</Caption> 
                    </View>}
                data={keyinfo}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>}
                renderItem={({ item }) => (

                    <Card style={styles.cardstyle}>

                        <Card.Title
                        left={() => <MaterialCommunityIcons name="folder-key-outline" size={40} />}
                        right={()=> <IconButton icon="eye" 
                        onPress={() => props.navigation.navigate("Keyinfo", { keyId: item.id, uid: firebase.auth().currentUser.uid, name: item.keyname })}/>}
                        title={item.keyname}
                        subtitle={item.keybuildingvilla + ', ' +item.keyarea}
                        />

                        <Card.Content>
                            <Caption style={{marginLeft: 55}}>
                            {checkdate(item.creation)}
                            </Caption>
                        </Card.Content>

                       
                    </Card>
                )}/>
            </View>

            <FAB
                style={styles.fab}
                theme={{ colors: { accent: 'white' } }}
                color = 'blue'
                large
                icon="key-plus"
                label="NEW KEY"
                onPress={() => props.navigation.navigate('AddKey')}
            />
            </ImageBackground>
        </View>)
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

const mapStateToProps = (store) => ({
    currentUser: store.userState.currentUser,
    posts: store.userState.posts,
    keyinfo: store.userState.keyinfo,
    keyinfodetails: store.userState.keyinfodetails
})

export default connect(mapStateToProps, null)(Keylist)