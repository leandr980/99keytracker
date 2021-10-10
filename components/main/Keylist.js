// JavaScript source code
import React, { useEffect, useState } from 'react'
import { View, Text, FlatList, StyleSheet, } from 'react-native'
import { Card, FAB, Searchbar, IconButton, Paragraph, Divider } from 'react-native-paper'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

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

            <Card style={styles.cardstyle}>
                <View style={styles.containerInfo}>
                    <Searchbar
                        style={{ elevation: 0 }}
                        placeholder="Search"
                        onChangeText={onChangeSearch}
                        value={searchQuery}
                    />
                    <Text style={{ fontSize: 30, fontWeight: 'bold' }}> Welcome {currentUser.name} </Text>
                </View>
            </Card>

            <Divider/>

            <View style={styles.containerGallery}>
                <FlatList
                    numColumns={1}
                    horizontal={false}
                    data={keyinfo}
                    renderItem={({ item }) => (

                        <Card style={styles.cardstyle}>
                            <Card.Title
                                left={() => <MaterialCommunityIcons name="folder-key-outline" size={40} />}
                                right={() => <IconButton {...props} icon="chevron-right"
                                    onPress={() => props.navigation.navigate("Keyinfo", { keyId: item.id, uid: firebase.auth().currentUser.uid })} />
                                }
                                title={item.keyname}
                            />
                            <Card.Content style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
                                <Paragraph> {item.keylocation} </Paragraph>
                                <Paragraph> Key Status </Paragraph>
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
            </View>
            )
}



const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 30,
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
        elevation: 10
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