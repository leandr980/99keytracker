import React from 'react'
import { View, Text, Image, FlatList, StyleSheet, ImageBackground, ScrollView, Alert} from 'react-native'
import { Card, FAB, IconButton, Chip, Divider, Caption, Provider, List, Menu, Switch, ActivityIndicator, Colors} from 'react-native-paper'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import {format } from 'date-fns'

export function Main_keyenty_component ({keydetails}) {
    switch(keydetails.entrytype){
        case 'LANDLORD':
            landlordentry_component()
        case 'COMPANY':
            companyentry_component()
        case 'AGENT':
            agententry_component()
        case 'OTHER':
            otherentry_component()
        case 'NEW ENTRY':
            newentry_component()
    }
}

const newentry_component =()=> {
    return(
        <Card>
            <Card.Title
            title={'Added ' + format(new Date(item.creation.toDate().toString()), 'PP')}
            subtitle={format(new Date(item.creation.toDate().toString()), 'p')}
            right={()=>
            <Chip 
            style={ changechipcolor(item.entrytype)} 
            icon={changechipicon(item.entrytype)}
            > {item.entrytype}</Chip>}/> 
            <Divider />
            <Card.Content>
                <Caption> Name: {item.name} </Caption>
                <Caption> Phone Number: {item.number} </Caption>
                <Caption> Notes: {item.notes} </Caption>
            </Card.Content>
        </Card>
    )
}

const landlordentry_component =()=> {
    return(
        <Card.Content>
        <Caption> Name: {item.name} </Caption>
        <Caption> Phone Number: {item.number} </Caption>
        <Caption> Agency: {item.agency} </Caption>
        <Caption> Notes: {item.notes} </Caption>
    </Card.Content>
    )
}

const companyentry_component =()=> {
    return(
        <Card.Content>
        <Caption> Name: {item.name} </Caption>
        <Caption> Phone Number: {item.number} </Caption>
        <Caption> Notes: {item.notes} </Caption>
    </Card.Content>
    )
}

const agententry_component =()=> {
    return(
        <Card.Content>
            <Caption> Name: {item.name} </Caption>
            <Caption> Phone Number: {item.number} </Caption>
            <Caption> Notes: {item.notes} </Caption>
        </Card.Content>
    )
}

const otherentry_component =()=> {}

const mediafiles_agent_component =()=>{}

/*
const mediafiles_component =()=> {
    return(
        
            <View>
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
                </List.Section>

     
   

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
            <View/>
        
    )
}
*/


/*
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
                                            <View>
                                                <Chip 
                                                icon={changechipicon(item.returnedstatus)} 
                                                style={changechipcolor(item.returnedstatus)} 
                                                disabled={setdisablechip(index, item.id, item.returnedstatus)}
                                                >{item.returnedstatus}</Chip>
                                            </View>
                                        </View>
                                        }
                                        </View>

                                        
                                    </Card>
                                    </View>
*/