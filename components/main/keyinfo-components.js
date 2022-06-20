import React from 'react'
import { View, Text, Image, FlatList, StyleSheet, ImageBackground, ScrollView, Alert} from 'react-native'
import { Card, FAB, IconButton, Chip, Divider, Caption, Provider, List, Menu, Switch, ActivityIndicator, Colors} from 'react-native-paper'
import {format } from 'date-fns'

export function Main_keyenty_component ({keydetails}) {
    return (
        <Card style={styles.cardstyle}>
            <Card.Title
            title={'Added ' + format(new Date(keydetails.creation.toDate().toString()), 'PP')}
            subtitle={format(new Date(keydetails.creation.toDate().toString()), 'p')}
            right={()=>
            <Chip 
            style={changechipcolor(keydetails.entrytype)} 
            icon={changechipicon(keydetails.entrytype)}>
                {keydetails.entrytype}</Chip>}/> 
            <Divider/>
            {entryswitch(keydetails.entrytype, keydetails)}
            {mediafileswitch(keydetails)}
        </Card>
    )
}

const entryswitch =(entrytype, keydetails)=> {
    switch(entrytype){
        case 'LANDLORD':
            return landlordentry_component(keydetails)
        case 'COMPANY':
            return companyentry_component(keydetails)
        case 'AGENT':
            return agententry_component(keydetails)
        case 'OTHER':
            return otherentry_component(keydetails)
        case 'NEW ENTRY':
            return newentry_component()
    }
}

const mediafileswitch =(keydetails)=>{
    if (keydetails.entrytype == 'AGENT'){
        return mediafiles_agent_component(keydetails)
    }
    else {
        if (keydetails.entrytype != 'NEW ENTRY'){
            return mediafiles_component(keydetails)
        }
    }
}

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

const agententry_component =(item)=> {
    return(
    <Card.Content>
        <Caption> Name: {item.name} </Caption>
        <Caption> Phone Number: {item.number} </Caption>
        <Caption> Agency: {item.agency} </Caption>
        <Caption> Notes: {item.notes} </Caption>
    </Card.Content>
    )
}

const newentry_component =()=> {
    return(
    <Card.Content>
        <Caption> This key was added </Caption>
    </Card.Content>
    )
}

const companyentry_component =(item)=> {
    return(
    <Card.Content>
        <Caption> Name: {item.name} </Caption>
        <Caption> Phone Number: {item.number} </Caption>
        <Caption> Notes: {item.notes} </Caption>
    </Card.Content>
    )
}

const landlordentry_component =(item)=> {
    return(
    <Card.Content>
        <Caption> Name: {item.name} </Caption>
        <Caption> Phone Number: {item.number} </Caption>
        <Caption> Notes: {item.notes} </Caption>
    </Card.Content>
    )
}

const otherentry_component =(item)=> {
    return(
    <Card.Content>
        <Caption> Name: {item.name} </Caption>
        <Caption> Phone Number: {item.number} </Caption>
        <Caption> Notes: {item.notes} </Caption>
    </Card.Content>
    )
}

const mediafiles_agent_component =(item)=>{
    return(
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
    )
}


const mediafiles_component =(item)=> {
    return(
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