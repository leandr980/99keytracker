// JavaScript source code
import React, { useState } from 'react'
import { View, Text, FlatList, StyleSheet, ImageBackground, RefreshControl} from 'react-native'
import { Card, FAB, IconButton, Divider, Chip, Caption, Button } from 'react-native-paper'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { format } from 'date-fns'

import firebase from 'firebase'
require ("firebase/firestore")

import { connect } from 'react-redux'

const wait = (timeout) => {
        return new Promise(resolve => setTimeout(resolve, timeout));
      }

function Keylist(props) {

    const [refreshing, setRefreshing] = React.useState(false);
    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        wait(2000).then(() => setRefreshing(false));}, []);

    const { currentUser, keyinfo, keyinfodetails} = props;

    if (currentUser === null) {
        return <View/>
    }

    const changechipcolor =(itementry)=> {
        switch(itementry){
            case 'LANDLORD':
                return{
                    backgroundColor: (`#ffd60a`), margin: 2
                }
            case 'COMPANY':
                return{
                    backgroundColor: (`#fb8500`), margin: 2
                }
            case 'AGENT':
                return{
                    backgroundColor: (`#a2d2ff`), margin: 2
                }
            case 'OTHER':
                return{
                    backgroundColor: (`#bdb2ff`), margin: 2
                }
            case 'NEW ENTRY':
                return{
                    backgroundColor: (`#8eecf5`), margin: 2
                }
        }
    }

    const changechipicon =(itementry)=> {
        switch(itementry){
            case 'LANDLORD':
                return "account-star"
            case 'COMPANY':
                return "domain"
            case 'AGENT':
                return "account-tie"
            case 'OTHER':
                return "account-question-outline"
            case 'NEW ENTRY':
                return "folder-plus"
        }
    }
    const testredux =(id)=> {
        const arrayid = []
        for (let i = 0; i < keyinfodetails.length; i++) {
            if (id == keyinfodetails[i].id){
                return keyinfodetails[i].id
            }
            //arrayid.push(keyinfodetails[i].id)
        }
        //return arrayid
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

            <Text style={{ fontSize: 30, fontWeight: 'bold', marginLeft: 20, marginBottom: 5 }}> Recent Entries </Text>
            <Text onPress={()=> console.log(keyinfodetails)}> test</Text>

            <Divider />

            <View style={styles.containerGallery}>
                <FlatList
                numColumns={1}
                horizontal={false}
                data={keyinfo}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>}
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
                                {'Added: '+format(new Date(item.creation.toDate().toString()), 'PP') + 
                                ' ' + 
                                format(new Date(item.creation.toDate().toString()), 'p') }
                            </Caption>
                        </Card.Content>

                        <Text>
                            {testredux(item.id)}
                        </Text>

                        <Divider/>  
                        <Text style={{marginLeft: 5, marginLeft: 15}}>Most recent log:</Text>
                        <View style={{flex: 1, flexDirection: 'row', flexWrap: 'wrap', marginBottom: 10, marginLeft: 10, marginRight: 10, alignItems: 'center'}}>
                            <Chip style={{margin: 2}}>{format(new Date(item.keyhistorycreation.toDate().toString()), 'PP')}</Chip>
                            <Chip style={{margin: 2}}>{format(new Date(item.keyhistorycreation.toDate().toString()), 'p')}</Chip>
                            {
                                item.entrytype == 'NEW ENTRY' ? 
                                <></>
                                : 
                                <>
                                <Chip style={{margin: 2}}>{item.number}</Chip>
                                <Chip style={{margin: 2}}>{item.name}</Chip>
                                </>
                            }
                                    
                            <Chip 
                            style={changechipcolor(item.entrytype)} 
                            icon={changechipicon(item.entrytype)}
                            >{item.entrytype}</Chip>
                        </View>


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