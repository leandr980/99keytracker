// JavaScript source code
import React, { useEffect, useState } from 'react'
import { View, Text, FlatList, StyleSheet, ImageBackground, ScrollView } from 'react-native'
import { Card, FAB, Searchbar, IconButton, Paragraph, Divider, Chip, Caption, Button, List } from 'react-native-paper'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { format } from 'date-fns'

import firebase from 'firebase'
require ("firebase/firestore")

import { connect } from 'react-redux'

function Profile(props) {

    const { currentUser, keyinfo, keyinfodetails } = props;

    const [searchQuery, setSearchQuery] = React.useState('');
    const onChangeSearch = query => setSearchQuery(query);

    if (currentUser === null) {
        return <View/>
    }

    const changechipcolor =(itementry)=> {
        switch(itementry){
            case 'LANDLORD':
                return{
                    backgroundColor: (`#ffd60a`)
                }
            case 'COMPANY':
                return{
                    backgroundColor: (`#fb8500`)
                }
            case 'AGENT':
                return{
                    backgroundColor: (`#a2d2ff`)
                }
            case 'OTHER':
                return{
                    backgroundColor: (`#ffd60a`)
                }
            case 'NEW ENTRY':
                return{
                    backgroundColor: (`#8eecf5`)
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
                return "help-box"
            case 'NEW ENTRY':
                return "folder-plus"
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
                    <Searchbar
                        style={{ elevation: 0 }}
                        placeholder="Search"
                        onChangeText={onChangeSearch}
                        value={searchQuery}
                    />

                    <Divider style={{marginBottom: 10}}/>

                    <Caption style={{ fontSize: 20, margin: 5 }}> Welcome {currentUser.name} </Caption>
                </View>
            </Card>

            <Text style={{ fontSize: 30, fontWeight: 'bold', marginLeft: 20, marginBottom: 5 }}> Recent Entries </Text>

            <Divider />

            <View style={styles.containerGallery}>
                <FlatList
                    numColumns={1}
                    horizontal={false}
                    data={keyinfo}
                    renderItem={({ item }) => (

                        <Card style={styles.cardstyle}>
                            <Card.Title
                            left={() => <MaterialCommunityIcons name="folder-key-outline" size={40} />}
                            right={()=> <IconButton icon="eye" 
                            onPress={() => props.navigation.navigate("Keyinfo", { keyId: item.id, uid: firebase.auth().currentUser.uid })}/>}
                            title={item.keyname}
                            subtitle={item.keylocation}
                            />
                            <Divider/>

                            <Card >
                                <View style={{flex: 1, flexDirection: 'row', flexWrap: 'wrap', margin: 10}}>

                                <Chip >Name: {item.name}</Chip>

                                {
                                    item.entrytype == 'NEW ENTRY' ? 
                                    <></> 
                                    : 
                                    <Chip>{item.number}</Chip>
                                }
                                
                                <Chip 
                                style={changechipcolor(item.entrytype)} 
                                icon={changechipicon(item.entrytype)}
                                >{item.entrytype}</Chip>
                            
                                </View>
                            </Card>

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

export default connect(mapStateToProps, null)(Profile)