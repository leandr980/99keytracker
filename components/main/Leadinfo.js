import React, { useState, useEffect, useRef } from 'react'
import { View, Text, FlatList, StyleSheet, ImageBackground, TextInput, SafeAreaView} from 'react-native'
import { Card, FAB, IconButton, Divider, Chip, Caption, Title, Button, Switch, Banner, Snackbar} from 'react-native-paper'
import { format } from 'date-fns'
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import formatDistanceToNow from 'date-fns/formatDistanceToNow'
import DateTimePicker from '@react-native-community/datetimepicker'

import firebase from 'firebase'
require("firebase/firestore")

Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });

export default function Leadinfo(props) {

    console.log(props.route.params.LeadId)

    const creation = firebase.firestore.FieldValue.serverTimestamp()
    const creationupdate = creation

    const [expoPushToken, setExpoPushToken] = useState('');
    const [notification, setNotification] = useState(false);
    const notificationListener = useRef();
    const responseListener = useRef();

    const [leadinfo, setleadinfo] = useState([])
    const [leadinfodate, setleadinfodate] = useState('')
    const [leadinfoupdate, setleadinfoupdate] = useState('')
    const [leadnotes, setleadnotes] = useState([])

    const [isSwitchOn, setIsSwitchOn] = useState(false)

    const [notes, setnotes] = useState('') 

    const [notifseconds, setnotifseconds] = useState(0)

    
    useEffect(() => {
        
        console.log(props.route.params.LeadId)
        
        const subscribe = firebase.firestore()
        .collection("leadscollection")
        .doc(props.route.params.uid)
                .collection("leadslist")
                .doc(props.route.params.LeadId)
                .onSnapshot((docSnapshot) => {
                    if (!docSnapshot.metadata.hasPendingWrites) {  
                        setleadinfo(docSnapshot.data())
                        setleadinfodate(format(new Date(docSnapshot.data().creation.toDate().toString()), 'PPpp'))
                        setleadinfoupdate(format(new Date(docSnapshot.data().creationupdate.toDate().toString()), 'PPpp'))
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
                            //console.log(keyinfo2, 'fetchkeyinfo2')
                            if (!docSnapshot.metadata.hasPendingWrites) {  // <======
                                setleadnotes(leadnotes)
                            }
                        }
                    })

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
                    Notifications.removeNotificationSubscription(notificationListener.current);
                    Notifications.removeNotificationSubscription(responseListener.current);
                }
            }, [])
    
    const budgetcheck = () =>{
        if (leadinfo.budget == ''){
            return true
        }
        else{
            return false
        }
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
        }).then(setIsSwitchOn(false))
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

    const [visible, setVisible] = React.useState(false);

    const onToggleSnackBar = () => setVisible(!visible);
  
    const onDismissSnackBar = () => setVisible(false);

    return (
        <View style={styles.container}>
            <Divider/>
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
                <FlatList
                numColumns={1}
                horizontal={false}
                removeClippedSubviews={false}
                ListHeaderComponent={
                    <View>
                        <Card style={styles.cardstyle}>
                            <Card.Content style={{alignItems: 'center', justifyContent: 'center'}}>
                            <Text style={{fontSize: 30}}>{leadinfo.name}</Text>
                            <Caption>{leadinfo.number}</Caption>
                            <Caption>{leadinfo.email}</Caption>
                            <View style={{flexDirection: 'row', size: 30}}>
                                <IconButton icon='whatsapp'/>
                                <IconButton icon='phone-outline'/>
                                <IconButton icon='android-messages'/>
                                <IconButton icon='email'/>
                            </View>
                            </Card.Content>
                        </Card>

                        <Card style={styles.cardstyle}>
                            <Card.Content>
                            <View>
                                <Button onPress={showDatepicker}>Show date picker!</Button>
                            </View>
                            <View>
                                <Button onPress={showTimepicker}>Show time picker!</Button>
                            </View>
                            <Text>selected: {date.toLocaleString()}</Text>
                            <Button mode='contained' 
                            onPress={async () => {
                                await schedulePushNotification();}}>set time</Button>
                            </Card.Content>
                        </Card>

                        <Card style={styles.cardstyle}>
                            <Card.Content>
                                <View style={{flexDirection: 'row', justifyContent: 'space-between', marginVertical: 15, alignItems: 'center'}}>
                                    <Text>Status</Text>
                                    <Chip>{leadinfo.status}</Chip>
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
                                    <Chip>{leadinfo.multiplearea}</Chip>
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
                                    <Text>Creation</Text>
                                    <Chip>{leadinfodate}</Chip>
                                </View>
                            <Caption>Last updated on: {leadinfoupdate}</Caption>

                            </Card.Content>

                        </Card>
                    </View>
                }
                ListEmptyComponent={<></>}
                ListFooterComponent={
                    <View style={{flex: 1}}>
                        {
                            isSwitchOn ? 
                            <Card style={styles.cardstyle}>
                                <Card.Content>
                                    <Title>Add New Note</Title>
                                    <TextInput
                                    style={styles.textinputstyle}
                                    type='outlined'
                                    placeholder=". . . ."
                                    onChangeText={(item) => setnotes(item)}/>
                                </Card.Content>
                                <Card.Actions style={{justifyContent: 'space-between'}}>
                                    <Button onPress={()=> setIsSwitchOn(false)}>Cancel</Button>
                                    <Button onPress={()=> addnewnote()}>Ok</Button>
                                </Card.Actions>
                            </Card>: <></>
                        }

                        {
                            isSwitchOn ? 
                            <></> :
                            <View style={{justifyContent: 'center', alignContent: 'center', alignItems: 'center', marginVertical: 20}}>
                                <Button style={{borderRadius: 300}} icon="plus" mode="contained" onPress={()=> setIsSwitchOn(true)}> New Note </Button>
                            </View>
                        }
                    </View>
                }
                data={leadnotes}
                renderItem={({ item }) => (
                    <Card style={styles.cardstyle}>
                        <Card.Content>
                        <Title>Note added on {format(new Date(item.creation.toDate().toString()), 'PP')}</Title>
                        <Divider style={{margin: 10}}/>
                        <Text>{item.notes}</Text>
                        </Card.Content>
                    </Card>
                )}/>
            </ImageBackground>
        </View>
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
      console.log(token);
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
        marginVertical: 20,
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