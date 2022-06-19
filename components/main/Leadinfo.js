import React, { useState, useEffect, useRef } from 'react'
import { View, Text, FlatList, StyleSheet, ImageBackground, TextInput, SafeAreaView, Alert, ScrollView} from 'react-native'
import { Card, FAB, IconButton, Divider, Chip, Caption, Title, Button, Avatar, ActivityIndicator, Colors} from 'react-native-paper'
import { format } from 'date-fns'
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import formatDistanceToNow from 'date-fns/formatDistanceToNow'
import DateTimePicker from '@react-native-community/datetimepicker'
import differenceInSeconds from 'date-fns/differenceInSeconds'

import { MenuProvider, Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu'

import { Dimensions } from 'react-native';

import firebase from 'firebase'
require("firebase/firestore")

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });

export default function Leadinfo(props) {

    //console.log(props.route.params.LeadId)

    const [loading, setLoading] = useState(true)

    const creation = firebase.firestore.FieldValue.serverTimestamp()
    const creationupdate = creation

    const [expoPushToken, setExpoPushToken] = useState('');
    const [notification, setNotification] = useState(false);
    const notificationListener = useRef();
    const responseListener = useRef();

    const [leadinfo, setleadinfo] = useState([])
    const [leadnotes, setleadnotes] = useState([])
    
    const [notes, setnotes] = useState('') 

    const [notificationlist, setnotificationlist] = useState([])
    
    useEffect(() => {
        
        //console.log(props.route.params.LeadId)
        
        setTimeout(() => {
            setLoading(false);
          }, 2000);

        const subscribe = firebase.firestore()
        .collection("leadscollection")
        .doc(props.route.params.uid)
        .collection("leadslist")
        .doc(props.route.params.LeadId)
        .onSnapshot((docSnapshot) => {
            if (!docSnapshot.metadata.hasPendingWrites) {  
                setleadinfo(docSnapshot.data())
                    }
                })
                
        const subscribe2 = firebase.firestore()
        .collection("leadscollection")
        .doc(firebase.auth().currentUser.uid)
        .collection("leadslist")
        .doc(props.route.params.LeadId)
        .collection('leadnotes')
        .onSnapshot((docSnapshot) => {
            if(docSnapshot.docs == undefined){
                console.log('notes empty')
            }
            else{
                let leadnotes = docSnapshot.docs.map(doc => {
                    const data = doc.data();
                    const id = doc.id;
                    return { id, ...data }
                })
                if (!docSnapshot.metadata.hasPendingWrites) {  // <======
                    setleadnotes(leadnotes.sort())
                }
            }})
            
        const subscribe3 = firebase.firestore()
        .collection("notification-collection")
        .doc(firebase.auth().currentUser.uid)
        .collection("notificationlist")
        .where("leadid", "==", props.route.params.LeadId)
        .onSnapshot((docSnapshot) => {
            let notificationlist = docSnapshot.docs.map(doc => {
                const data = doc.data();
                const id = doc.id;
                return { id, ...data }
            })
            if (!docSnapshot.metadata.hasPendingWrites) {  // <======
                setnotificationlist(notificationlist)
             }})
             
        registerForPushNotificationsAsync().then(token => setExpoPushToken(token));
        notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
            setNotification(notification);
        });
        
        responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
            console.log(response);
        });
        
        return () => {
            subscribe()
            subscribe2()
            subscribe3()
            registerForPushNotificationsAsync()
            Notifications.removeNotificationSubscription(notificationListener.current);
            Notifications.removeNotificationSubscription(responseListener.current);
        }

    }, [])
    
    const budgetcheck = () =>{
        if (leadinfo.budget == ''){return true}
    else{return false}
    }
    
    const addnewnote = () => {
        firebase.firestore()
        .collection('leadscollection')
        .doc(firebase.auth().currentUser.uid)
        .collection("leadslist")
        .doc(props.route.params.LeadId)
        .collection('leadnotes')
        .add({
            notes,
            creation,
            creationupdate
        }).then(setnotes(''))
    }
    
    const [date, setDate] = useState(new Date());
    const [mode, setMode] = useState('date');
    const [show, setShow] = useState(false);
    
    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate;
        setShow(false);
        setDate(currentDate);
    };
    
    const showMode = (currentMode) => {
      setShow(true);
      setMode(currentMode);
    };
    
    const showDatepicker = () => {
        showMode('date');
    };
    
    const showTimepicker = () => {
        showMode('time');
    };
    
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
        }).then(deletereminder(notificationid), addnewnotecontacted(leadid))
        
    }

    const addnewnotecontacted = (leadid) => {
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

    const deletereminder = (doctodelete) => {
        firebase.firestore()
        .collection('notification-collection')
        .doc(firebase.auth().currentUser.uid)
        .collection("notificationlist")
        .doc(doctodelete)
        .delete()    
    }

    const deletenote = (doctodelete) => {
        firebase.firestore()
        .collection('leadscollection')
        .doc(firebase.auth().currentUser.uid)
        .collection("leadslist")
        .doc(props.route.params.LeadId)
        .collection("leadnotes")
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

    const remindericonbgcolor =(newdate)=> {
        if (differenceInSeconds(new Date(newdate.toDate().toString()), new Date()) < 0) {
            return {backgroundColor: "red", borderRadius: 300}
        }
        else {
            return {backgroundColor: "green", borderRadius: 300}
        }
    }
    const deletelead =()=> {

        setLoading(true)

        const refnotes = firebase.firestore() 
        .collection('leadscollection')
        .doc(firebase.auth().currentUser.uid)
        .collection("leadslist")
        .doc(props.route.params.LeadId)
        .collection("leadnotes")

        leadnotes.forEach((doc)=>{
            refnotes.doc(doc.id).delete()
            console.log('deleted notes doc with id: ', doc.id)
        })

        const refnotifs = firebase.firestore()
        .collection("notification-collection")
        .doc(firebase.auth().currentUser.uid)
        .collection("notificationlist")

        notificationlist.forEach((doc)=>{
            refnotifs.doc(doc.id).delete()
            console.log('deleted notifs doc with id: ', doc.id)
        })

        firebase.firestore()
        .collection("leadscollection")
        .doc(props.route.params.uid)
        .collection("leadslist")
        .doc(props.route.params.LeadId)
        .delete().then((function () {
            props.navigation.pop()
        }))
    }
    
    const arealist = (list) => {
        const renderList = list.map((item, index) => <Chip style={{marginRight: 2}} key={index}>{item}</Chip>);
        return renderList
    }
    
    return (
        <MenuProvider skipInstanceCheck={true}>
        <View style={styles.container}>
            {loading ? 
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
                {show && (
                    <DateTimePicker
                    testID="dateTimePicker"
                    value={date}
                    mode={mode}
                    is24Hour={true}
                    onChange={onChange}
                    />
                )}
                <ScrollView>
                    <Card style={styles.cardstyle}>
                        <IconButton icon={'arrow-left'} onPress={function () {props.navigation.pop()}}/>
                                <Card.Content style={{alignItems: 'center', justifyContent: 'center'}}>
                                <Text style={{fontSize: 30}}>{leadinfo.name}</Text>
                                <Caption>{leadinfo.number}</Caption>
                                <Caption>{leadinfo.email}</Caption>
                                <View style={{flexDirection: 'row', size: 30}}>
                                    <IconButton icon='whatsapp' disabled='true'/>
                                    <IconButton icon='phone-outline' disabled='true'/>
                                    <IconButton icon='android-messages' disabled='true'/>
                                    <IconButton icon='email' disabled='true'/>
                                    <Menu>
                                                <MenuTrigger>
                                                    <IconButton icon="cog" />
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
                                                            <IconButton icon='account'/>
                                                            <Text>EDIT DETAILS</Text>
                                                        </View>
                                                    </MenuOption>
                                                    
                                                    <Divider/>
                                                    
                                                    <MenuOption onSelect={() => 
                                                    Alert.alert(
                                                        "Are you sure you want to delete this Lead?",
                                                        "This will also delete all notes and reminders for this lead",
                                                        [
                                                            {
                                                                text: "YES",
                                                                onPress: () => deletelead()
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
                                            </Menu>
                                </View>
                                </Card.Content>
                            </Card>

                    <Card style={styles.cardstyle}>
                        <Card.Content>
                            <Title>Upcoming Reminders for {leadinfo.name}</Title>
                            <Divider/>
                            <FlatList
                            style={{height: 180}}
                            horizontal={true}
                            showsHorizontalScrollIndicator={false}
                            data={notificationlist}
                            ListEmptyComponent={<View> 
                                <Caption style={{marginTop: 80, marginLeft: 10}}>List is empty</Caption> 
                                </View>}
                            ListHeaderComponent={
                                <View style={{borderRightWidth: 0.5, borderRightColor: '#dbdbdb'}}>
                                    <Card style={{elevation: 5, margin: 5, height: 170, width: 310}}>
                                        <Card.Title
                                            title={<Text style={{fontSize: 15}}>Set A Reminder</Text>}/>
                                            <Divider/>
                                            <Card.Content>
                                                <View style={{justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center'}}>
                                                    <Button icon={'calendar'} onPress={() => showDatepicker()}>Change Date</Button>
                                                    <Text>{format(new Date(date.toLocaleString()), 'PP')}</Text>
                                                </View>
                                                <View style={{justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center'}}>
                                                    <Button icon={'clock'} onPress={() => showTimepicker()}>Change Time</Button>
                                                    <Text>{format(new Date(date.toLocaleString()), 'pp')}</Text>
                                                </View>
                                            </Card.Content>
                                            <Divider/>
                                            <Button onPress={async () => {await schedulePushNotification();}} > Set Reminder</Button>
                                    </Card>
                                </View>
                                    }
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

                    <Card style={styles.cardstyle}>
                        <Card.Content>
                            <View style={{flexDirection: 'row', justifyContent: 'space-between', marginVertical: 15, alignItems: 'center'}}>
                                <Text>Status</Text>
                                <Chip icon={'check'} >{leadinfo.status}</Chip>
                            </View>
                            <View style={{flexDirection: 'row', justifyContent: 'space-between', marginVertical: 15, alignItems: 'center'}}>
                                <Text>Sale / Rent</Text>
                                <Chip>{leadinfo.salerent}</Chip>
                            </View>
                            <View style={{flexDirection: 'row', justifyContent: 'space-between', marginVertical: 15, alignItems: 'center'}}>
                                <Text>Property Status</Text>
                                <Chip>{leadinfo.propertystatus}</Chip>
                            </View>
                            <View style={{flexDirection: 'row', justifyContent: 'space-between', marginVertical: 15, alignItems: 'center'}}>
                                <Text>Property Type</Text>
                                <Chip>{leadinfo.propertytype}</Chip>
                            </View>
                            <View style={{flexDirection: 'row', justifyContent: 'space-between', marginVertical: 15, alignItems: 'center'}}>
                                <Text>Area</Text>
                                <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
                                {arealist(leadinfo.multiplearea)}
                                </View>
                            </View>
                            <View style={{flexDirection: 'row', justifyContent: 'space-between', marginVertical: 15, alignItems: 'center'}}>
                                <Text>Number of Bedrooms</Text>
                                <Chip>{leadinfo.bedroom}</Chip>
                            </View>
                            <View style={{flexDirection: 'row', justifyContent: 'space-between', marginVertical: 15, alignItems: 'center'}}>
                                <Text>Build-Up Area</Text>
                                <View style={{flexDirection: 'row'}}>
                                    <Chip style={{marginRight: 2}}>{leadinfo.builduparea}</Chip>
                                    <Chip>{leadinfo.buildupareatype}</Chip>
                                </View>
                            </View>
                            <View style={{flexDirection: 'row', justifyContent: 'space-between', marginVertical: 15, alignItems: 'center'}}>
                                <Text>Budget</Text>
                                {
                                    budgetcheck() ?
                                    <View style={{flexDirection: 'row'}}>
                                        <Chip style={{marginRight: 2}}>Min Budget: {leadinfo.minbudget}</Chip>
                                        <Chip>Max Budget: {leadinfo.maxbudget}</Chip>
                                    </View>
                                        :
                                    <View style={{flexDirection: 'row'}}>
                                        <Chip>{leadinfo.budget}</Chip>
                                    </View>
                                }
                            </View>
                            <View style={{flexDirection: 'row', justifyContent: 'space-between', marginVertical: 15, alignItems: 'center'}}>
                                <Text>Furnishing</Text>
                                <Chip>{leadinfo.furnishing}</Chip>
                            </View>
                            <View style={{flexDirection: 'row', justifyContent: 'space-between', marginVertical: 15, alignItems: 'center'}}>
                                <Text>Lead Source</Text>
                                <Chip>{leadinfo.leadsource}</Chip>
                            </View>
                            <View style={{flexDirection: 'row', justifyContent: 'space-between', marginVertical: 15, alignItems: 'center'}}>
                                <Text>Created</Text>
                                <Chip>{format(new Date(leadinfo.creation.toDate().toString()), 'PPpp')}</Chip>
                            </View>
                        <Caption>Last updated on: {format(new Date(leadinfo.creationupdate.toDate().toString()), 'PPpp')}</Caption>
                        </Card.Content>
                    </Card> 

                    <Card style={styles.cardstyle}>
                        <Card.Content>
                            <Title>Notes</Title>
                            <Divider/>
                            <FlatList
                            style={{height: 180}}
                            horizontal={true}
                            data={leadnotes}
                            showsHorizontalScrollIndicator={false}
                            ListEmptyComponent={<View>
                                <Caption style={{marginTop: 80, marginLeft: 10}}>List is empty</Caption>
                            </View>}
                            ListHeaderComponent={
                                <View style={{borderRightWidth: 0.5, borderRightColor: '#dbdbdb'}}>
                                    <Card style={{elevation: 5, margin: 5, width: 310, height: 170}}>
                                        <Card.Content>
                                            <Title>Add New Note</Title>
                                            <TextInput
                                            style={styles.textinputstyle}
                                            type='outlined'
                                            placeholder=". . . ."
                                            onChangeText={(item) => setnotes(item)}/>
                                        </Card.Content>
                                        <Card.Actions style={{justifyContent: 'space-between'}}>
                                            <Button onPress={()=> addnewnote()}>Ok</Button>
                                        </Card.Actions>
                                    </Card>
                                </View>
                            }
                            renderItem={({ item }) => (
                                <Card style={{elevation: 5, margin: 5, width: 255}}>
                                    <Card.Title
                                    title={<Text style={{fontSize: 15}}>Note added on </Text>}
                                    subtitle={<Caption>{format(new Date(item.creation.toDate().toString()), 'PPpp')}</Caption>}
                                    right={() => 
                                        <IconButton icon={'delete'}
                                            onPress={()=> Alert.alert(
                                                "Are you sure you want to delete this note?",
                                                "",
                                                [
                                                    {
                                                        text: "YES",
                                                        onPress: () => deletenote(item.id)
                                                    },
                                                    { 
                                                        text: "NO"
                                                    }
                                                ]
                                            )}/>
                                                    }/>
                                        <Card.Content>
                                        <Divider />
                                        <Text style={{flexWrap: 'wrap'}}>{item.notes}</Text>
                                        </Card.Content>
                                    </Card>
                                )}
                                />
                        </Card.Content>
                    </Card>
                </ScrollView>

            </ImageBackground>
            
            }
        </View>
        </MenuProvider>
        )

        async function schedulePushNotification() {
            const getdate = new Date(date)
            const year = getdate.getFullYear()
            const month = getdate.getMonth()
            const day = getdate.getDay()
            const minutes = getdate.getMinutes()
            const seconds = date.getSeconds()

            console.log(
                day, ' ',
                month, ' ',
                year, ' ',
                minutes, ' ',
                seconds, ' ',
            )

            const trigger = date
            trigger.setMinutes(minutes);
            trigger.setSeconds(seconds);

            const notifidentifier = await Notifications.scheduleNotificationAsync({
              content: {
                title: "Reminder to Contact " + leadinfo.name,
                body: 'Phone number: ' + leadinfo.number,
                data: { data: leadinfo.name },
              },
              trigger
            })

            firebase.firestore()
            .collection('notification-collection')
            .doc(firebase.auth().currentUser.uid)
            .collection("notificationlist")
            .add({
                leadname: leadinfo.name,
                leadnumber: leadinfo.number,
                date,
                notifidentifier,
                leadid: props.route.params.LeadId,
                status: leadinfo.status,
                creation
            })
            
            return notifidentifier
        }
}

async function registerForPushNotificationsAsync() {
    let token;
    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!');
        return;
      }
      token = (await Notifications.getExpoPushTokenAsync()).data;
      //console.log(token);
    } else {
      alert('Must use physical device for Push Notifications');
    }
  
    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }
  
    return token;
  }

const styles = StyleSheet.create({
    container: {
        flex: 1,

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
    textinputstyle: {
        flexWrap: 'wrap',
        borderBottomWidth: 0.5,
        borderBottomColor: 'grey',
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