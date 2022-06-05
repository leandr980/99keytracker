import React, { useEffect, useState, useRef } from 'react'
import { View, Text, Image, FlatList, StyleSheet, ImageBackground, ScrollView } from 'react-native'
import { Card, FAB, IconButton, Chip, Divider, Caption, Provider, List, Menu, Switch} from 'react-native-paper'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import {format } from 'date-fns'

import firebase from 'firebase'
require("firebase/firestore")

export default function Keyinfo(props) {

    const creation = firebase.firestore.FieldValue.serverTimestamp()

    const [keydetails, setKeydetails] = useState([])
    const [keyHistory, setKeyHistory] = useState([])
    const [keyHistorydate, setKeyHistorydate] = useState('')

    useEffect(() => {

        console.log(props.route.params.keyId)

            const subscribe1 = firebase.firestore()
                .collection('keycollection')
                .doc(props.route.params.uid)
                .collection('keylist')
                .doc(props.route.params.keyId)
                .onSnapshot((docSnapshot) => {
                    if (!docSnapshot.metadata.hasPendingWrites) {  
                        setKeydetails(docSnapshot.data())
                        setKeyHistorydate(docSnapshot.data().creation.toDate().toString())
                    }
                })

            const subscribe2 = firebase.firestore()
                .collection('keycollection')
                .doc(props.route.params.uid)
                .collection('keylistentry')
                .where('keyid', '==', props.route.params.keyId)
                .onSnapshot((docSnapshot) => {
                    let keyHistory = docSnapshot.docs.map(doc => {
                        const data = doc.data();
                        const id = doc.id;
                        return { id, ...data }
                    })
                    if (!docSnapshot.metadata.hasPendingWrites) {  
                        setKeyHistory(keyHistory)
                    }  
                })

                return () => {
                    subscribe1()
                    subscribe2()
                }
    }, [])

    const changechipcolor =(itementry)=> {
        switch(itementry){
            case 'LANDLORD':
                return{
                    backgroundColor: (`#ffd60a`), margin: 10
                }
            case 'COMPANY':
                return{
                    backgroundColor: (`#fb8500`), margin: 10
                }
            case 'AGENT':
                return{
                    backgroundColor: (`#a2d2ff`), margin: 10
                }
            case 'OTHER':
                return{
                    backgroundColor: (`#bdb2ff`), margin: 10
                }
            case 'NEW ENTRY':
                return{
                    backgroundColor: (`#8eecf5`), margin: 10
                }

            case 'NOT RETURNED':
                return{
                    backgroundColor: (`#ff002b`), marginRight: 10, marginLeft: 5
                }
            case 'RETURNED':
                return{
                    backgroundColor: (`#70e000`), marginRight: 10, marginLeft: 5
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

            case 'NOT RETURNED':
                return "close"
            case 'RETURNED':
                return "check"
        }
    }

    const [state, setState] = React.useState({ open: false });
    const onStateChange = ({ open }) => setState({ open });
    const { open } = state;

    const [visible, setVisible] = React.useState(false);
    const openMenu = () => setVisible(true);
    const closeMenu = () => setVisible(false);

    const [visiblesettings, setVisiblesettings ] = React.useState('');

    //<IconButton icon={'pencil-outline'} onPress={()=> props.navigation.navigate( 'Edit Key', { keyId: props.route.params.keyId, uid: firebase.auth().currentUser.uid })}/>

    const [updatedata, setupdatedata] = useState([])

    const deletesingledoc = (historyid) =>{
        //delete
        firebase.firestore()
            .collection('keycollection')
            .doc(props.route.params.uid)
            .collection('keylist')
            .doc(props.route.params.keyId)
            .collection('keyhistory')
            .doc(historyid)
            .delete()
            console.log('deleted doc')

            //set array with new data after
            /*
            const task = firebase.firestore()
                .collection('keycollection')
                .doc(props.route.params.uid)
                .collection('keylist')
                .doc(props.route.params.keyId)
                .collection('keyhistory')
                .orderBy("creation", "desc")
                .onSnapshot((docSnapshot) => {
                    let keyHistory = docSnapshot.docs.map(doc => {
                        const data = doc.data();
                        const id = doc.id;
                        return { id, ...data }
                    })
                    if (!docSnapshot.metadata.hasPendingWrites) {  
                        setupdatedata(keyHistory)
                        console.log(keyHistory)
                    }  
                })
                
                //update db
               const taskCompleted = firebase.firestore()
                    .collection('keycollection')
                    .doc(firebase.auth().currentUser.uid)
                    .collection("keylist")
                    .doc(props.route.params.keyId)
                    .update({
                        name: updatedata.name,
                        entrytype: updatedata.entrytype,
                        number: updatedata.number,
                        keyhistorycreation: updatedata.keyhistorycreation
                    },
                        function (error) {
                            if (error) {
                                console.log("Data could not be saved." + error);
                            } else {
                                console.log("Data saved successfully.");
                            }
                        }
                    )

                    task.on("state_changed", taskCompleted)
                    */
    }

    const returnedstatus =(status,historyid)=>{
        console.log(historyid)
        if(status == 'RETURNED'){
            const finstatus = 'NOT RETURNED'
            firebase.firestore()
            .collection('keycollection')
            .doc(props.route.params.uid)
            .collection('keylist')
            .doc(props.route.params.keyId)
            .collection('keyhistory')
            .doc(historyid)
            .update({
                returnedstatus: finstatus,
                creation: creation
            })
        }
        else if (status == 'NOT RETURNED'){
            const finstatus = 'RETURNED'
            firebase.firestore()
            .collection('keycollection')
            .doc(props.route.params.uid)
            .collection('keylist')
            .doc(props.route.params.keyId)
            .collection('keyhistory')
            .doc(historyid)
            .update({
                returnedstatus: finstatus,
                creation: creation
            })
        }

    }

    const setdisablechip =(index, historyid,returnedstatus)=>{
        if(index > 0) {
            if(returnedstatus == 'NOT RETURNED' && index != 0) {
                const finstatus = 'RETURNED'
                firebase.firestore()
                .collection('keycollection')
                .doc(props.route.params.uid)
                .collection('keylist')
                .doc(props.route.params.keyId)
                .collection('keyhistory')
                .doc(historyid)
                .update({
                    returnedstatus: finstatus,
                    creation: creation
                })
            }
            return true
        }
    }

    const deletecollection = async()=>{

        for (let i = 0; i < keyHistory.length; i++) {
            if(keyHistory[i].entrytype != 'NEW ENTRY'){
                firebase.firestore()
                .collection('keycollection')
                .doc(props.route.params.uid)
                .collection('keylist')
                .doc(props.route.params.keyId)
                .collection('keyhistory')
                .doc(keyHistory[i].id)
                .delete()
            }
            
        }

    }

    return (
        <Provider>
            <View style={styles.container}>

            <ImageBackground 
            style={{flex: 1}}
            imageStyle={{resizeMode: 'repeat'}}
            source={require('../../assets/bg-image/99-whatsapp-bg-small.jpg')}>

                        <Card style={styles.maincardstyle}>

                            <Card.Title
                                left={() => <MaterialCommunityIcons name="file-key-outline" size={40} />}
                                right={()=> 
                                <Menu visible={visible} onDismiss={closeMenu} anchor={<IconButton icon={'cog'} onPress={openMenu}/>}>
                                <Menu.Item onPress={() => setVisiblesettings('edit')} title="EDIT" />
                                <Menu.Item onPress={() => setVisiblesettings('delete')} title="DELETE" />
                                <Divider/>
                                <Menu.Item onPress={() => setVisiblesettings('')} title="CANCEL" />
                                </Menu>
                                }
                                style={{
                                    fontSize: 30,
                                    fontWeight: 'bold'
                                }}
                                title={keydetails.keyname}
                                subtitle={keydetails.keybuildingvilla + ', ' + keydetails.keyarea}
                            />
                            
                            <Card.Content style={{flexDirection: 'row'}}>
                                <Caption style={{marginLeft: 55}}>{'Added: '+keyHistorydate.substring(4, 15) }</Caption>
                                {
                                visiblesettings == 'edit' &&
                                <IconButton style={{position: 'absolute', bottom: 10, left: 13}} icon={'pencil-outline'} onPress={()=> props.navigation.navigate( 'Edit Key', { keyId: props.route.params.keyId, uid: firebase.auth().currentUser.uid })}/>
                                }
                                {
                                visiblesettings == 'delete' &&
                                <IconButton style={{position: 'absolute', bottom: 10, left: 13}} icon={'delete-outline'} onPress={()=> deletecollection()}/>
                                }
                            </Card.Content>
                        </Card>

                        

                            <View style={styles.containerGallery}>

                            <FlatList
                                numColumns={1}
                                horizontal={false}
                                data={keyHistory}

                                renderItem={({ item, index }) => 

                                ( 
                                    <View style={{flex: 1, flexDirection: 'row'}}>

                                       


                                    <Card style={styles.cardstyle}>
                                        <Card.Title
                                            title={'Added ' + format(new Date(item.creation.toDate().toString()), 'PP')}
                                            subtitle={format(new Date(item.creation.toDate().toString()), 'p')}
                                            right={()=>
                                            <Chip 
                                            style={ changechipcolor(item.entrytype)} 
                                            icon={changechipicon(item.entrytype)}
                                            > {item.entrytype}</Chip>}/>
                                            
                                        <Divider />
                                        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>

                                        <View>
                                        {
                                        item.entrytype == 'LANDLORD' &&
                                            <Card.Content>
                                                <Caption> Name: {item.name} </Caption>
                                                <Caption> Phone Number: {item.number} </Caption>
                                                <Caption> Notes: {item.notes} </Caption>
                                            </Card.Content>
                                        }
                                        {
                                        item.entrytype == 'AGENT' &&
                                            <Card.Content>
                                                <Caption> Name: {item.name} </Caption>
                                                <Caption> Phone Number: {item.number} </Caption>
                                                <Caption> Agency: {item.agency} </Caption>
                                                <Caption> Notes: {item.notes} </Caption>
                                            </Card.Content>
                                        }
                                        {
                                        item.entrytype == 'COMPANY' &&
                                            <Card.Content>
                                                <Caption> Name: {item.name} </Caption>
                                                <Caption> Phone Number: {item.number} </Caption>
                                                <Caption> Notes: {item.notes} </Caption>
                                            </Card.Content>
                                        }
                                        {
                                        item.entrytype == 'OTHER' &&
                                            <Card.Content>
                                                <Caption> Name: {item.name} </Caption>
                                                <Caption> Phone Number: {item.number} </Caption>
                                                <Caption> Notes: {item.notes} </Caption>
                                            </Card.Content>
                                        }
                                        </View>
                                        {
                                            item.entrytype != 'NEW ENTRY' &&
                                        <View style={{alignItems: 'center', flexDirection: 'row'}}>
                                            <Caption>Key status</Caption>
                                            <Chip 
                                            icon={changechipicon(item.returnedstatus)} 
                                            style={changechipcolor(item.returnedstatus)} 
                                            onPress={()=>returnedstatus(item.returnedstatus, item.id)}
                                            disabled={setdisablechip(index, item.id, item.returnedstatus)}
                                            >{item.returnedstatus}</Chip>
                                            
                                        </View>
                                        
                                        }
                                        </View>

                                        {
                                            {
                                                'AGENT' :
                                                <List.Section>
                                                    <List.Accordion title='View Media'>
                                                        <Divider/>
                                                        <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap'}}>
                                                            <ScrollView horizontal>
                                                                <Card style={{borderRadius: 10, margin: 10, elevation: 5, width: 300}}>
                                                                    <Card.Cover source={{ uri: item.imageIDfrontURL}} 
                                                                    defaultSource={require('../../assets/99nomedia.jpg')}
                                                                    style={{alignSelf: "center",  width: 300}}/>
                                                                    <Card.Title title={"Emirates ID Front"}/>
                                                                </Card>

                                                                <Card style={{borderRadius: 10, margin: 10, elevation: 5, width: 300}}>
                                                                    <Card.Cover source={{ uri: item.imageIDbackURL }}
                                                                    defaultSource={require('../../assets/99nomedia.jpg')}
                                                                    style={{alignSelf: "center", width: 300}}/>
                                                                    <Card.Title title={"Emirates ID Front"}/>
                                                                </Card>
                                                                <Card style={{borderRadius: 10, margin: 10, elevation: 5, width: 300}}>
                                                                    <Card.Cover source={{ uri: item.signatureURL }}
                                                                    defaultSource={require('../../assets/99nomedia.jpg')}
                                                                    style={{alignSelf: "center", width: 300}}/>
                                                                    <Card.Title title={"Agent Signature"}/>
                                                                </Card>
                                                            </ScrollView>                                                            
                                                        </View>
                                                    </List.Accordion>                                    
                                                </List.Section>,

                                                'NEW ENTRY' :
                                                <></>

                                            } [item.entrytype]||

                                            <List.Section>
                                                <List.Accordion title='View Media'>
                                                    <Divider/>

                                                    <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap'}}>

                                                        <Card style={{borderRadius: 10, margin: 10, elevation: 5, width: 300}}>
                                                            <Card.Cover source={{ uri: item.imageIDfrontURL}} 
                                                            defaultSource={require('../../assets/99nomedia.jpg')}
                                                            style={{alignSelf: "center",  width: 300}}/>
                                                            <Card.Title title={"Emirates ID Front"}/>
                                                        </Card>

                                                        <Card style={{borderRadius: 10, margin: 10, elevation: 5, width: 300}}>
                                                            <Card.Cover source={{ uri: item.imageIDbackURL }}
                                                            defaultSource={require('../../assets/99nomedia.jpg')}
                                                            style={{alignSelf: "center", width: 300}}/>
                                                            <Card.Title title={"Emirates ID Front"}/>
                                                        </Card>

                                                    </View>
                                                </List.Accordion>                                    
                                            </List.Section>
                                        }
                                    </Card>
                                    </View>
                                    
                                )
                            }/>
                            
                            </View>
                            <FAB.Group
                            open={open}
                            icon={open ? 'help-box' : 'plus'}
                            theme={{ colors: { accent: 'white' } }}
                            actions={[
                                    {
                                    icon: 'account-star',
                                    label: 'LANDLORD',
                                    onPress: () => props.navigation.navigate('Landlord', { keyId: props.route.params.keyId, uid: firebase.auth().currentUser.uid }),
                                    small: false,
                                    },
                                    {
                                    icon: 'domain',
                                    label: 'COMPANY',
                                    onPress: () => props.navigation.navigate('Company', { keyId: props.route.params.keyId, uid: firebase.auth().currentUser.uid }),
                                    small: false,
                                    },
                                    {
                                    icon: 'account-tie',
                                    label: 'AGENT',
                                    onPress: () => props.navigation.navigate('Agent', { keyId: props.route.params.keyId, uid: firebase.auth().currentUser.uid }),
                                    small: false,
                                    },
                                    {
                                    icon: 'account-question-outline',
                                    label: 'OTHER',
                                    onPress: () => props.navigation.navigate('Other', { keyId: props.route.params.keyId, uid: firebase.auth().currentUser.uid }),
                                    small: false,
                                    },
                                ]}
                                onStateChange={onStateChange}
                                onPress={() => {
                                    if (open) {
                                    // do something if the speed dial is open
                                    }
                                }}
                                />
                </ImageBackground>
            </View>
        </Provider>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
        flex: 1,
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
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 8,
        paddingHorizontal: 16,
      },
})