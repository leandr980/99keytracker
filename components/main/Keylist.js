// JavaScript source code
import React, { useEffect, useState } from 'react'
import { View, Text, FlatList, StyleSheet, ImageBackground, } from 'react-native'
import { Card, FAB, Searchbar, IconButton, Paragraph, Divider, Chip, Caption, Button } from 'react-native-paper'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

import firebase from 'firebase'
require ("firebase/firestore")

import { connect } from 'react-redux'
    
//homepage

function Profile(props) {

    const { currentUser, keyinfo } = props;

    const [searchQuery, setSearchQuery] = React.useState('');
    const onChangeSearch = query => setSearchQuery(query);

    if (currentUser === null) {
        return <View/>
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

            <Text style={{ fontSize: 30, fontWeight: 'bold', marginLeft: 20, marginBottom: 5 }}> Recent Items </Text>

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
                                title={item.keyname}
                                subtitle={item.keylocation}
                            />
                            <Divider style={{ marginBottom: 5 }} />

                            <Card.Content> 
                                <Text>Added: </Text>
                                </Card.Content>

                            <Card.Content style={{ flexWrap: 'wrap', flexDirection: 'row', alignItems: 'center' }}>
                                <Chip style={{
                                    marginTop: 5,
                                    marginRight: 5
                                }} icon="information"> {item.entrytype}</Chip>
                                <Chip style={{
                                    marginTop: 5,
                                    marginRight: 5
                                }} icon="account-star"> {item.name}</Chip>
                                <Chip style={{
                                    marginTop: 5,
                                    marginRight: 5
                                }} icon="domain"> {item.company}</Chip>
                            </Card.Content>
                            
                            <Card.Actions style={{ justifyContent: 'center' }}>
                                <Button onPress={() => props.navigation.navigate("Keyinfo", { keyId: item.id, uid: firebase.auth().currentUser.uid })} >
                                    VIEW HISTORY
                                </Button>
                            </Card.Actions>
                            
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
    keyinfo: store.userState.keyinfo
})

export default connect(mapStateToProps, null)(Profile)