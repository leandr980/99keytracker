// JavaScript source code
import React, { useState, useEffect, useRef } from 'react'
import { View, Text, FlatList, StyleSheet, RefreshControl, ScrollView, Alert, TouchableOpacity} from 'react-native'
import { Card, FAB, IconButton, Divider, Chip, DataTable, Searchbar, Caption, Button, Title, Provider, Avatar, } from 'react-native-paper'
import { format } from 'date-fns'
import differenceInSeconds from 'date-fns/differenceInSeconds'
import { MenuProvider, Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu'

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
        setezfilter(keyinfo2)
        wait(2000).then(() => setRefreshing(false));}, []);

    const { currentUser, keyinfo2, leadfiltersale, notificationlist} = props;

    if (currentUser === null) {
        return <View/>
    }

    const [ezfilter, setezfilter] = useState(keyinfo2)

    const deletereminder = (doctodelete) => {
        firebase.firestore()
        .collection('notification-collection')
        .doc(firebase.auth().currentUser.uid)
        .collection("notificationlist")
        .doc(doctodelete)
        .delete()    
    }

    const datetimedifference = (newdate) => {
        if (differenceInSeconds(new Date(newdate.toDate().toString()), new Date()) < 0) {
            return "alert-circle-outline"
        }
        else {
            return "clock-outline"
        }
    }
                    
    return (
        <MenuProvider>
        <View style={styles.container}>
            <View style={styles.containerGallery}>
                <Card>
                    <Searchbar placeholder="Search"/>
                    <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                        <ScrollView horizontal style={{margin: 5}}>
                            <Chip style={{margin: 2}} onPress={()=> setezfilter(keyinfo2)}>All</Chip>
                            <Chip style={{margin: 2}} onPress={()=> setezfilter('Other')}>Rent</Chip>
                            <Chip style={{margin: 2}} onPress={()=> setezfilter(leadfiltersale)}>Sale</Chip>
                            <Chip style={{margin: 2}} onPress={()=> setezfilter('Yearly')}>Yearly</Chip>
                            <Chip style={{margin: 2}} onPress={()=> setezfilter('Monthly')}>Monthly</Chip>
                            <Chip style={{margin: 2}} onPress={()=> setezfilter('Studio')}>Studio</Chip>
                            <Chip style={{margin: 2}} onPress={()=> setezfilter('Apartment')}>Apartment</Chip>
                            <Chip style={{margin: 2}} onPress={()=> setezfilter('Villa')}>Villa</Chip>
                            <Chip style={{margin: 2}} onPress={()=> setezfilter('Plot')}>Plot</Chip>
                            <Chip style={{margin: 2}} onPress={()=> setezfilter('Retail')}>Retail</Chip>
                            <Chip style={{margin: 2}} onPress={()=> setezfilter('1 BR')}>1 BR</Chip>
                            <Chip style={{margin: 2}} onPress={()=> setezfilter('2 BR')}>2 BR</Chip>
                            <Chip style={{margin: 2}} onPress={()=> setezfilter('3 BR')}>3 BR</Chip>
                            <Chip style={{margin: 2}} onPress={()=> setezfilter('4 BR')}>4 BR</Chip>
                            <Chip style={{margin: 2}} onPress={()=> setezfilter('Furnished')}>Furnished</Chip>
                            <Chip style={{margin: 2}} onPress={()=> setezfilter('Un-Furnished')}>Un-Furnished</Chip>
                        </ScrollView>
                        <IconButton icon='cog'/>
                    </View>
                </Card>

                <Card style={styles.cardstyle}>
                    <Card.Content>
                        <Title>Upcoming Reminders</Title>
                        <Divider/>
                        <FlatList
                        style={{height: 180}}
                        horizontal={true}
                        data={notificationlist}
                        renderItem={({ item }) => (
                            <Card style={{elevation: 5, margin: 5, width: 255}}>
                                    <Card.Title
                                        title={<Text style={{fontSize: 15}}>{format(new Date(item.date.toDate().toString()), 'PP')}</Text>}
                                        subtitle={<Text>{format(new Date(item.date.toDate().toString()), 'p')}</Text>}
                                        left={(props) => <Avatar.Icon {...props} icon={datetimedifference(item.date)} />}
                                        right={() => 
                                        <Menu>
                                            <MenuTrigger>
                                                <IconButton icon="dots-vertical" />
                                            </MenuTrigger>
                                            <MenuOptions>

                                                <MenuOption onSelect={() => 
                                                Alert.alert(
                                                    "This will change the lead status to *CONTACTED* and delete this reminder",
                                                    "Are you sure you want to do this?",
                                                    [
                                                        {
                                                            text: "YES"
                                                        },
                                                        { 
                                                            text: "NO"
                                                        }
                                                    ]
                                                )}>
                                                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                                        <IconButton icon='check'/>
                                                        <Text>CONTACTED</Text>
                                                    </View>
                                                </MenuOption>
                                                
                                                <MenuOption onSelect={() => props.navigation.navigate('Lead Info', { LeadId: item.leadid, uid: firebase.auth().currentUser.uid })}>
                                                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                                        <IconButton icon='eye'/>
                                                        <Text>VIEW LEAD</Text>
                                                    </View>
                                                </MenuOption>

                                                <Divider/>
                                                
                                                <MenuOption onSelect={() => 
                                                Alert.alert(
                                                    "Are you sure you want to delete this reminder?",
                                                    "",
                                                    [
                                                        {
                                                            text: "YES",
                                                            onPress: () => deletereminder(item.id)
                                                        },
                                                        { 
                                                            text: "NO"
                                                        }
                                                    ]
                                                )}>
                                                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                                        <IconButton icon='delete-outline'/>
                                                        <Text>DELETE</Text>
                                                    </View>
                                                   
                                                </MenuOption>
                                            </MenuOptions>
                                        </Menu>}
                                    />
                                    <Divider/>
                                <Card.Content style={{marginTop: 2}}>
                                    <Text>NOT CONTACTED</Text>
                                    <Text>{item.leadname}</Text>
                                    <Text>{item.leadnumber}</Text>
                                    <Caption>Created on {format(new Date(item.creation.toDate().toString()), 'PP')} {format(new Date(item.creation.toDate().toString()), 'p')}</Caption>
                                </Card.Content>
                            </Card>
                            
                        )}/>     
                    </Card.Content>
                </Card>
                
                <DataTable>
                    <DataTable.Header>
                        <DataTable.Cell ><IconButton icon='account'/></DataTable.Cell>
                        <DataTable.Cell ><IconButton icon='phone'/></DataTable.Cell>
                        <DataTable.Cell numeric><IconButton icon='key'/></DataTable.Cell>
                        <DataTable.Cell numeric><IconButton icon='domain'/></DataTable.Cell>
                        <DataTable.Cell numeric><IconButton icon='bed'/></DataTable.Cell>
                    </DataTable.Header>
                </DataTable>

                <FlatList
                numColumns={1}
                horizontal={false}
                data={ezfilter}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>}
                renderItem={({ item }) => (

                <DataTable>
                    <DataTable.Row>
                        <DataTable.Cell onPress={() => props.navigation.navigate('Lead Info', { LeadId: item.id, uid: firebase.auth().currentUser.uid })}>{item.name}</DataTable.Cell>
                        <DataTable.Cell>{item.number}</DataTable.Cell>
                        <DataTable.Cell numeric>{item.salerent}</DataTable.Cell>
                        <DataTable.Cell numeric>{item.propertytype}</DataTable.Cell>
                        <DataTable.Cell numeric>{item.bedroom}</DataTable.Cell>
                    </DataTable.Row>
                </DataTable>
                    
                )}/>                
            </View>

            <FAB
                style={styles.fab}
                theme={{ colors: { accent: 'white' } }}
                color = 'blue'
                large
                icon="account-edit-outline"
                label="New Lead"
                onPress={() => props.navigation.navigate('New Lead')}
            />
            
        </View>
        </MenuProvider>)
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

const mapStateToProps = (store) => ({
    currentUser: store.userState.currentUser,
    keyinfo2: store.userState.keyinfo2,
    leadfiltersale: store.userState.leadfiltersale,
    notificationlist: store.userState.notificationlist,
})

export default connect(mapStateToProps, null)(LeadTracker)