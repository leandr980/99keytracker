// JavaScript source code
import React, { useState } from 'react'
import { View, Text, FlatList, StyleSheet, ImageBackground, RefreshControl, ScrollView} from 'react-native'
import { Card, FAB, IconButton, Divider, Chip, DataTable, Searchbar, Caption, IconButton} from 'react-native-paper'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { format } from 'date-fns'
import differenceInDays from 'date-fns/differenceInDays'
import startOfDay from 'date-fns/startOfToday'

import firebase from 'firebase'
require ("firebase/firestore")

import { connect } from 'react-redux'
import { ScrollView } from 'react-native-gesture-handler'

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
    
    return (

        <View style={styles.container}>
            <ImageBackground 
            style={{flex: 1}}
            imageStyle={{resizeMode: 'repeat'}}
            source={require('../../assets/bg-image/99-whatsapp-bg-small.jpg')}>

            <View style={styles.containerGallery}>
                <Card>
                <Searchbar placeholder="Search"/>
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
                </Card>

                <FlatList
                numColumns={1}
                horizontal={false}
                data={ezfilter}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>}
                renderItem={({ item }) => (

                    <Card style={{flex: 1,borderRadius: 10, margin: 10, elevation: 5}}>
                        <View style={{flexDirection: 'row'}}>
                            <IconButton icon='magnify'/>
                            <View>
                        <DataTable>
                            <DataTable.Header>
                            <DataTable.Cell>{item.name}</DataTable.Cell>
                            <DataTable.Cell numeric>{item.number}</DataTable.Cell>
                            <DataTable.Cell numeric>status</DataTable.Cell>

                            </DataTable.Header>
                        </DataTable>

                        <Card.Content style={{flexDirection: 'row', flexWrap: 'wrap'}}>
                            <Chip style={{marginRight: 2, marginTop: 2}}>{Math.abs(differenceInDays(new Date(item.creation.toDate().toString()), startOfDay()))} days ago </Chip>
                            <Chip style={{marginRight: 2, marginTop: 2}}>{item.salerent} </Chip>
                            <Chip style={{marginRight: 2, marginTop: 2}}>{item.propertytype} </Chip>
                            <Chip style={{marginRight: 2, marginTop: 2}}>{item.bedroom} </Chip>
                            <Chip style={{marginRight: 2, marginTop: 2}}>{item.furnishing} </Chip> 
                        </Card.Content>

                            </View>



                        </View>
                    
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
    keyinfo2: store.userState.keyinfo2,
    leadfiltersale: store.userState.leadfiltersale,
})

export default connect(mapStateToProps, null)(LeadTracker)