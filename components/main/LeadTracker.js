// JavaScript source code
import React, { useState } from 'react'
import { View, Text, FlatList, StyleSheet, RefreshControl, ScrollView} from 'react-native'
import { Card, FAB, IconButton, Divider, Chip, DataTable, Searchbar, Caption, Button} from 'react-native-paper'
import { format } from 'date-fns'
import formatDistanceToNow from 'date-fns/formatDistanceToNow'

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

    const { currentUser, keyinfo2, leadfiltersale} = props;

    if (currentUser === null) {
        return <View/>
    }

    const [ezfilter, setezfilter] = React.useState(keyinfo2)
    
    /*
    <Card style={{flex: 1,borderRadius: 10, margin: 10, elevation: 5}}>
                        <Card.Title
                        left={() => <MaterialCommunityIcons name="account" size={40} />}
                        title={item.name}
                        />
                        <Text style={{marginLeft: 20}}>Number: {item.number}</Text>
                        <Text style={{marginLeft: 20}}>Budget: {item.budget}</Text>
                        <Divider/>
                        <Card.Content style={{flexDirection: 'row', flexWrap: 'wrap'}}>
                            <Chip>{item.salerent} </Chip>
                            <Chip>{item.propertytype} </Chip>
                            <Chip>{item.bedroom} </Chip>
                            <Chip>{item.furnishing} </Chip> 
                        </Card.Content>
                    </Card>
    */
    

                    /*
                     <DataTable>
                            <DataTable.Header>
                            <DataTable.Cell>{item.name}</DataTable.Cell>
                            <DataTable.Cell numeric>{item.number}</DataTable.Cell>
                            <DataTable.Cell numeric>status</DataTable.Cell>
                            </DataTable.Header>
                        </DataTable>
                    */

                        /*
                        <Card style={{flex: 1,borderRadius: 10, margin: 10, elevation: 5}}>
                        <Card.Title 
                        title={item.name}
                        right={()=> <IconButton icon="chevron-right" />}/>
                            <Card.Content>
                                <Text>{item.number}</Text>
                                <Caption>{item.propertytype} • {item.salerent} • {item.bedroom} • {item.furnishing} • Added {datediff(item.creation.toDate())} ago</Caption>

                            </Card.Content>
                    </Card>
                        */


                    
    return (

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

            <View>
                <Button> notification test</Button>
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
})

export default connect(mapStateToProps, null)(LeadTracker)