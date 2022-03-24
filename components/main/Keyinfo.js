import React, { useEffect, useState, useRef } from 'react'
import { View, Text, Image, FlatList, StyleSheet, TouchableOpacity, ImageBackground, ScrollView } from 'react-native'
import {Dimensions} from 'react-native'
import { Card, FAB, IconButton, Chip, Paragraph, Button, Divider, Caption, Provider, Portal, Dialog, RadioButton, TouchableRipple, List, Switch, Banner } from 'react-native-paper'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import {format } from 'date-fns'

import firebase from 'firebase'
import NewHistoryLandlord from './NewHistoryLandlord'
require("firebase/firestore")

export default function Keyinfo(props) {

    const [keydetails, setKeydetails] = useState([])
    const [keyHistory, setKeyHistory] = useState([])

    const mounted = useRef(false)

    useEffect(() => {

        mounted.current = true;

        console.log(props.route.params.keyId)

            firebase.firestore()
                .collection('keycollection')
                .doc(props.route.params.uid)
                .collection('keylist')
                .doc(props.route.params.keyId)
                .onSnapshot((docSnapshot) => {
                    if (!docSnapshot.metadata.hasPendingWrites) {  // <======
                        setKeydetails(docSnapshot.data())
                     }
                })

            firebase.firestore()
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
                    if (!docSnapshot.metadata.hasPendingWrites) {  // <======
                        setKeyHistory(keyHistory)
                     }  
                })

        return () => {
            mounted.current = false;
        }

    }, [props.route.params.keyId])

    const [visibleCategory, setVisibleCategory] = React.useState(false);
    const showModalCategory = () => setVisibleCategory(true);
    const hideModalCategory = () => setVisibleCategory(false);
    const [checked, setChecked] = React.useState();

    return (
        <Provider >

            <Portal >

                <Dialog visible={visibleCategory} onDismiss={hideModalCategory}>

                    <Dialog.Title>Choose an option</Dialog.Title>

                    <Dialog.Content>

                        <TouchableRipple onPress={() => setChecked('Landlord')}>
                            <View style={styles.row}>
                                <Paragraph>Landlord</Paragraph>
                                <View pointerEvents="none">
                                    <RadioButton
                                        value="Landlord"
                                        status={checked === 'Landlord' ? 'checked' : 'unchecked'}/>
                                </View>
                            </View>
                        </TouchableRipple>
                        
                        <TouchableRipple onPress={() => setChecked('Company')}>
                            <View style={styles.row}>
                                <Paragraph>Company</Paragraph>
                                <View pointerEvents="none">
                                    <RadioButton
                                        value="Company"
                                        status={checked === 'Company' ? 'checked' : 'unchecked'}/>
                                </View>
                            </View>
                        </TouchableRipple>

                        <TouchableRipple onPress={() => setChecked('Agent')}>
                            <View style={styles.row}>
                                <Paragraph>Agent</Paragraph>
                                <View pointerEvents="none">
                                    <RadioButton
                                        value="Agent"
                                        status={checked === 'Agent' ? 'checked' : 'unchecked'}/>
                                </View>
                            </View>
                        </TouchableRipple>

                        <TouchableRipple onPress={() => setChecked('Other')}>
                            <View style={styles.row}>
                                <Paragraph>Other</Paragraph>
                                <View pointerEvents="none">
                                    <RadioButton
                                        value="Other"
                                        status={checked === 'Other' ? 'checked' : 'unchecked'}/>
                                </View>
                            </View>
                        </TouchableRipple>

                    </Dialog.Content>
                    
                    <Dialog.Actions>
                        <Button onPress={ () => {
                            props.navigation.navigate(checked, { keyId: props.route.params.keyId, uid: firebase.auth().currentUser.uid }),
                            hideModalCategory()
                        } 
                    }
                        
                        >Done</Button>
                    </Dialog.Actions>
                </Dialog>                
            </Portal>

            <View style={styles.container}>

            <ImageBackground 
            style={{flex: 1}}
            imageStyle={{resizeMode: 'repeat'}}
            source={require('../../assets/bg-image/99-whatsapp-bg-small.jpg')}>

                <Card style={styles.maincardstyle}>

                    <Card.Title
                        left={() => <MaterialCommunityIcons name="file-key-outline" size={40} />}
                        style={{
                            fontSize: 30,
                            fontWeight: 'bold'
                        }}
                        title={keydetails.keyname}
                        subtitle={keydetails.keylocation}
                    />

                </Card>

                <View style={styles.containerGallery}>

                    <FlatList
                        numColumns={1}
                        horizontal={false}
                        data={keyHistory}

                        renderItem={({ item, index }) => 

                        {
                                switch(item.entrytype){
                                    case "LANDLORD" :
                                        return( 
                                            <Card style={styles.cardstyle}>
                                                <Card.Title
                                                    title={ format(new Date(item.creation.toDate().toString()), 'PP')}
                                                    right={()=><Chip style={{
                                                        marginRight: 10,
                                                        backgroundColor: (`#ffd60a`)
                                                    }} icon="information"> {item.entrytype}</Chip>}/>
                                                <Divider />
        
                                                <Card.Content>
                                                    <Caption> Name: {item.name} </Caption>
                                                    <Caption> Phone Number: {item.number} </Caption>
                                                    <Caption> Notes: {item.notes} </Caption>
                                                </Card.Content>
                
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
                                            </Card>
                                        )
                                    case "COMPANY" :
                                        return( 
                                            <Card style={styles.cardstyle}>
                                                <Card.Title
                                                    title={ format(new Date(item.creation.toDate().toString()), 'PP')}
                                                    right={()=><Chip style={{
                                                        marginRight: 10,
                                                        backgroundColor: (`#fb8500`)
                                                    }} icon="information"> {item.entrytype}</Chip>}/>
                                                <Divider />
        
                                                <Card.Content>
                
                                                    <Caption> Company Name: {item.companyname} </Caption>
                                                    <Caption> Phone Number: {item.number} </Caption>
                                                    <Caption> Supervisor Name: {item.supervisor} </Caption>
                                                    <Caption> Notes: {item.notes} </Caption>
                
                                                </Card.Content>
                
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
                                            </Card>
                                        )
                                    case "AGENT" :
                                        return( 
                                            <Card style={styles.cardstyle}>
                                                <Card.Title
                                                    title={ format(new Date(item.creation.toDate().toString()), 'PP')}
                                                    right={()=><Chip style={{
                                                        marginRight: 10,
                                                        backgroundColor: (`#a2d2ff`)
                                                    }} icon="information"> {item.entrytype}</Chip>}/>
                                                <Divider />
        
                                                <Card.Content>
                
                                                    <Caption> Name: {item.name} </Caption>
                                                    <Caption> Phone Number: {item.number} </Caption>
                                                    <Caption> Real Estate Agency: {item.agency} </Caption>
                                                    <Caption> Notes: {item.notes} </Caption>
                
                                                </Card.Content>
                
                                                <List.Section>
                                                    <List.Accordion title='View Media'>

                                                        <Divider/>
                                                        
                                                        <ScrollView horizontal style={{flex: 1}}>

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
                                                                <Card.Title title={"Signature"}/>
                                                            </Card>

                                                        </ScrollView>
                                                    </List.Accordion>                                    
                                                </List.Section>
                                            </Card>
                                        )
        
                                    case "NEW ENTRY" :
                                        return( 
        
                                            <Card style={styles.cardstyle}>
                                                <Card.Title
                                                    title={ format(new Date(item.creation.toDate().toString()), 'PP')}
                                                    right={()=><Chip style={{
                                                        marginRight: 10,
                                                        backgroundColor: (`#8eecf5`)
                                                    }} icon="information"> {item.entrytype}</Chip>}/>
                
                                                <Divider />
                
                                                <Card.Content>
                
                                                    <Caption> Name: {item.name} </Caption>
                                                    <Caption> Company: {item.company} </Caption>
                                                    <Caption> Notes: {item.notes} </Caption>
                
                                                </Card.Content>
                                            </Card>
                                        )
        
                                        
                                }
                            }
                        

                        }
                    />
                </View>

                <FAB
                    style={styles.fab}
                    theme={{ colors: { accent: 'white' } }}
                    color='blue'
                    large
                    icon="plus"
                    label="NEW LOG"

                    onPress={showModalCategory}
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