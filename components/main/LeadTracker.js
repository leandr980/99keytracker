// JavaScript source code
import React, { useState, useEffect, useRef } from 'react'
import { View, Text, FlatList, StyleSheet, RefreshControl, Alert} from 'react-native'
import { Card, FAB, IconButton, Divider, Chip, DataTable, Caption, Button, Title, Avatar, } from 'react-native-paper'
import { format } from 'date-fns'
import differenceInSeconds from 'date-fns/differenceInSeconds'
import { MenuProvider, Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu'

import firebase from 'firebase'
require ("firebase/firestore")

import { connect } from 'react-redux'

const wait = (timeout) => {
        return new Promise(resolve => setTimeout(resolve, timeout));
      }

      const useExpired = (time)=>{
        const [expired, setExpired] = useState(false);
        const timoutRef = useRef();
        useEffect(()=>{
          timoutRef.current = setTimeout(()=>{
            setExpired(true);
          }, time);
          return ()=>{
            clearTimeout(timoutRef.current);
          }
        },[time]);
        return expired;
      }

function LeadTracker(props) {

    const creation = firebase.firestore.FieldValue.serverTimestamp()
    const creationupdate = creation
    
    const [refreshing, setRefreshing] = React.useState(false);
    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        wait(2000).then(() => setRefreshing(false));}, []);

    const { currentUser, keyinfo2, leadfiltersale, notificationlist} = props;

    if (currentUser === null) {
        return <View/>
    }

    const status = 'CONTACTED'
    
    const changeleadstatus = (leadid, notificationid) => {
        firebase.firestore()
        .collection("leadscollection")
        .doc(firebase.auth().currentUser.uid)
        .collection("leadslist")
        .doc(leadid)
        .update({
            status: status,
            creationupdate: creationupdate
        }).then(deletereminder(notificationid), addnewnote(leadid))
        
    }

    const deletereminder = (doctodelete) => {
        firebase.firestore()
        .collection('notification-collection')
        .doc(firebase.auth().currentUser.uid)
        .collection("notificationlist")
        .doc(doctodelete)
        .delete()    
    }
    
    const addnewnote = (leadid) => {
        firebase.firestore()
        .collection('leadscollection')
        .doc(firebase.auth().currentUser.uid)
        .collection("leadslist")
        .doc(leadid)
        .collection('leadnotes')
        .add({
            notes: 'This lead was contacted',
            creation,
            creationupdate
        })
    }

    const datetimedifference = (newdate) => {
        if (differenceInSeconds(new Date(newdate.toDate().toString()), new Date()) < 0) {
            return "alert-circle-outline"
        }
        else {
            return "clock-outline"
        }
    }

    const remindericonbgcolor =(newdate)=> {
        if (differenceInSeconds(new Date(newdate.toDate().toString()), new Date()) < 0) {
            return {backgroundColor: "red", borderRadius: 300}
        }
        else {
            return {backgroundColor: "green", borderRadius: 300}
        }
    }
    
    const isexpired =(enddate)=> {
        const expired = useExpired(enddate - new Date().getTime());
        return expired
    }

    //console.log(isexpired(new Date().getTime() + 5000))
    const [initiallist, setintiallist] = useState(keyinfo2.slice(0,5))
    //console.log(initiallist)
         
    return (
        <MenuProvider>
        <View style={styles.container}>
            <View style={styles.containerGallery}>

            <Card style={styles.maincardstyle}>
                <View style={styles.containerInfo}>
                    <Caption style={{ fontSize: 20, margin: 5 }}> Welcome {currentUser.name} </Caption>
                    <IconButton icon={'magnify'} onPress={() => props.navigation.navigate('Lead Search', {uid: firebase.auth().currentUser.uid})}/>
                </View>
            </Card>

                <Card style={styles.cardstyle}>
                    <Card.Content>
                        <Title>Upcoming Reminders</Title>
                        <Divider/>
                        <FlatList
                        style={{height: 180}}
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                        data={notificationlist}
                        ListEmptyComponent={<View> 
                            <Caption style={{marginTop: 80, marginLeft: 10}}>List is empty</Caption> 
                            </View>}
                        renderItem={({ item }) => (
                            <Card style={{elevation: 5, margin: 5, width: 255}}>
                                    <Card.Title
                                        title={<Text style={{fontSize: 15}}>{format(new Date(item.date.toDate().toString()), 'PP')}</Text>}
                                        subtitle={<Text>{format(new Date(item.date.toDate().toString()), 'p')}</Text>}
                                        left={(props) => <Avatar.Icon {...props} style={remindericonbgcolor(item.date)} icon={datetimedifference(item.date)} />}
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
                                                            text: "YES",
                                                            onPress: () => changeleadstatus(item.leadid, item.id)
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
                                    <Text>{item.leadname}</Text>
                                    <Text>{item.leadnumber}</Text>
                                    <Text>{item.status}</Text>
                                    <Caption>Created {format(new Date(item.creation.toDate().toString()), 'PPpp')}</Caption>
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
                data={keyinfo2}
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