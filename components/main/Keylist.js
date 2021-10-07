// JavaScript source code
import React, { useEffect, useState } from 'react'
import { View, Text, Image, FlatList, StyleSheet, Button, TouchableOpacity } from 'react-native'
import { Card, FAB, Searchbar, IconButton } from 'react-native-paper'

import firebase from 'firebase'
require ("firebase/firestore")

import { connect } from 'react-redux'
    
function Profile(props) {

    const { currentUser, keyinfo } = props;

    const [searchQuery, setSearchQuery] = React.useState('');
    const onChangeSearch = query => setSearchQuery(query);

    if (currentUser === null) {
        return <View/>
    }

    return (
        <View style={styles.container}>

            <View style={styles.containerInfo}>
                <Searchbar
                    placeholder="Search"
                    onChangeText={onChangeSearch}
                    value={searchQuery}
                />
                <Text style={{fontSize: 30, fontWeight: 'bold'}}> Welcome {currentUser.name} </Text>
            </View>

            <View style={styles.containerGallery}>

                <FlatList
                    numColumns={1}
                    horizontal={false}
                    data={keyinfo}
                    renderItem={({ item }) => (

                        <Card
                            style={styles.cardstyle}>

                            <View style={styles.containerKeylistinfo}>
                                <Card.Title
                                    right={() => <IconButton {...props} icon="chevron-right"
                                        onPress={() => props.navigation.navigate("Keyinfo", { keyId: item.id, uid: firebase.auth().currentUser.uid })} />}
                                    title={item.keyname}
                                    subtitle={item.keylocation} />
                            </View>

                        </Card>
                    )}
                />
            </View>

            <FAB
                style={styles.fab}
                theme={{ colors: { accent: 'white' } }}
                color = 'blue'
                large
                icon="plus"
                onPress={() => props.navigation.navigate('AddKey')}
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

const mapStateToProps = (store) => ({
    currentUser: store.userState.currentUser,
    posts: store.userState.posts,
    keyinfo: store.userState.keyinfo
})

export default connect(mapStateToProps, null)(Profile)