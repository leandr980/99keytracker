import React, { useState } from 'react'
import { View, TextInput, FlatList, Text } from 'react-native'

import firebase from 'firebase'
import { Card, Divider, IconButton, DataTable, Chip, Title } from 'react-native-paper'
require('firebase/firestore')

import { Dimensions } from 'react-native';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function Search(props) {
    const [keydata, setkeydata] = useState([])

    const fetchUsers = (search) => {
        firebase.firestore()
            .collection("leadscollection")
            .doc(firebase.auth().currentUser.uid)
            .collection("leadslist")
            .where('name', '>=', search)
            .get()
            .then((snapshot) => {
                let keydata = snapshot.docs.map(doc => {
                    const data = doc.data();
                    const id = doc.id;
                    return { id, ...data }
                    
                });
                setkeydata(keydata)
            })
    }

    const fetchSale = (search) => {
        firebase.firestore()
            .collection("leadscollection")
            .doc(firebase.auth().currentUser.uid)
            .collection("leadslist")
            .where('name', '>=', search)
            .get()
            .then((snapshot) => {
                let keydata = snapshot.docs.map(doc => {
                    const data = doc.data();
                    const id = doc.id;
                    return { id, ...data }
                    
                });
                setkeydata(keydata)
            })
    }

    return (
        <View style={{flex: 1}}>
            <Card >
                <View style={{flexDirection: 'row'}}>
                    <IconButton icon={'magnify'} size={30}/>
                    <View style={{flex:1, justifyContent: 'center'}}>
                        <TextInput style={{fontSize: 20}} placeholder="Search . . . ." onChangeText={(search) => fetchUsers(search)}/>
                    </View>
                    
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
                ListEmptyComponent={
                <View style={{flex: 1, alignContent: 'center', justifyContent: 'center', alignItems: 'center', marginTop: windowHeight/4}}>
                    <View>
                        <Title>Filters</Title>
                        <Divider/>
                    </View>
                    <View style={{alignItems: 'center', marginVertical: 20}}>
                        <View style={{flexDirection: 'row'}}>
                            <Chip style={{margin: 2}}>Sale</Chip>
                            <Chip>Rent</Chip>
                        </View>
                    </View>
                    <View style={{alignItems: 'center', marginVertical: 20}}>
                        <Text>Property Type</Text>
                        <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
                            <Chip style={{margin: 2}}>Apartment</Chip>
                            <Chip style={{margin: 2}}>Villa</Chip>
                            <Chip style={{margin: 2}}>Plot</Chip>
                            <Chip style={{margin: 2}}>Retail</Chip>
                            <Chip>Office</Chip>
                        </View>
                    </View>
                    <View style={{alignItems: 'center', marginVertical: 20}}>
                        <Text>No. of bedrooms</Text>
                        <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
                            <Chip style={{margin: 2}}>Studio</Chip>
                            <Chip style={{margin: 2}}>1 Bedroom</Chip>
                            <Chip style={{margin: 2}}>2 Bedroom</Chip>
                            <Chip style={{margin: 2}}>3 Bedroom</Chip>
                            <Chip style={{margin: 2}}>4 Bedroom</Chip>
                            <Chip style={{margin: 2}}>5 Bedroom</Chip>
                            <Chip>Other</Chip>
                        </View>
                    </View>
                </View>}
                numColumns={1}
                horizontal={false}
                data={keydata}
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
        )
}