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

function LeadTracker(props) {

    const [refreshing, setRefreshing] = React.useState(false);
    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        wait(2000).then(() => setRefreshing(false));}, []);

    const { currentUser, keyinfo } = props;
    //console.log(leadlist, 'leadlist')

    if (currentUser === null) {
        return <View/>
    }
    
    return (

        <View style={styles.container}>
            <ImageBackground 
            style={{flex: 1}}
            imageStyle={{resizeMode: 'repeat'}}
            source={require('../../assets/bg-image/99-whatsapp-bg-small.jpg')}>

            <View style={styles.containerGallery}>
                <Text>hi</Text>
                <FlatList
                numColumns={1}
                horizontal={false}
                data={keyinfo}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>}
                renderItem={({ item }) => ( 

                    <Card style={styles.cardstyle}>
                        <Text>{item.id}id</Text>
                    </Card>
                )}/>                
            </View>

            <FAB
                style={styles.fab}
                theme={{ colors: { accent: 'white' } }}
                color = 'blue'
                large
                icon="key-plus"
                label="New Lead"
                onPress={() => props.navigation.navigate('New Lead')}
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
    keyinfo: store.userState.keyinfo,
})

export default connect(mapStateToProps, null)(LeadTracker)