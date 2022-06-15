import React, { useState } from 'react'
import { View, TextInput, FlatList, Text, ScrollView} from 'react-native'

import firebase from 'firebase'
import { Card, Divider, IconButton, DataTable, Chip, Title, Snackbar, Button, Caption} from 'react-native-paper'
require('firebase/firestore')

import { Dimensions } from 'react-native';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function Search(props) {
    const [keydata, setkeydata] = useState([])
    const [selectedfilter, setselectedfilter] = useState('')

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

    const fetchleadlist =(filtervalue, filterfield )=> {
        firebase.firestore()
            .collection("leadscollection")
            .doc(firebase.auth().currentUser.uid)
            .collection("leadslist")
            .where(filterfield, '==', filtervalue)
            .get()
            .then((snapshot) => {
                let keydata = snapshot.docs.map(doc => {
                    const data = doc.data();
                    const id = doc.id;
                    return { id, ...data }
                    
                });

                if (snapshot.empty){
                    //console.log('empty search result')
                    onToggleSnackBar()
                    setfilterfield(filtervalue)
                }
                else{
                    setselectedfilter(filtervalue)
                    setkeydata(keydata)
                }
            })
    }

    const [visible, setVisible] = React.useState(false);
    const onToggleSnackBar = () => {
        setVisible(!visible);
        setTimeout(() => {
            setVisible(false)
        }, 4000);
    }
    
    const [filterfield, setfilterfield] = useState('')
    const onDismissSnackBar = () => (setVisible(false), setfilterfield(''));

    return (
        <View style={{flex: 1}}>
            <Card >
                <View style={{flexDirection: 'row'}}>
                    <IconButton icon={'magnify'} size={30}/>
                    <View style={{flex:1, justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center', marginHorizontal: 5}}>
                        {selectedfilter == '' ?
                        <TextInput style={{fontSize: 20, width: windowWidth/1.2}} placeholder="Search . . . ." onChangeText={(search) => fetchUsers(search)}/>
                        :
                        <View>
                        <Chip style={{marginRight: 10}} icon={'close-circle'} onPress={()=> (setkeydata([]), setselectedfilter(''))}>{selectedfilter}</Chip>
                        </View>
                        }
                    </View>
                    
                </View>

                <Divider/>

                <View style={{flexDirection: 'row', alignItems: 'center', margin: 5}}>
                <Title style={{marginLeft: 5}}>Filters</Title>

                    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            
                            <Card style={{elevation: 5, margin: 5}}>
                                <View style={{flexDirection: 'row', alignItems: 'center', margin: 10}}>
                                    <Caption style={{marginRight: 2}}> Lead Details: </Caption>
                                    <Chip style={{marginRight: 2}}>Name</Chip>
                                    <Chip style={{marginRight: 2}}>Email</Chip>
                                    <Chip style={{marginRight: 2}}>Mobile Number</Chip>
                                    <Chip style={{marginRight: 2}}>Lead Status</Chip>
                                </View>
                            </Card>

                            <Card style={{elevation: 5, margin: 5}}>
                                <View style={{flexDirection: 'row', alignItems: 'center', margin: 10}}>
                                    <Caption style={{marginRight: 2}}> Property Details: </Caption>
                                    <Chip style={{marginRight: 2}}>Sale/Rent</Chip>
                                    <Chip style={{marginRight: 2}}>Property Status</Chip>
                                    <Chip style={{marginRight: 2}}>Property Type</Chip>
                                    <Chip style={{marginRight: 2}}>location</Chip>
                                    <Chip style={{marginRight: 2}}>Bedroom</Chip>
                                    <Chip style={{marginRight: 2}}>Build-Up</Chip>
                                    <Chip style={{marginRight: 2}}>Budget</Chip>
                                    <Chip style={{marginRight: 2}}>Furnishing</Chip>
                                </View>
                            </Card>

                            <Card style={{elevation: 5, margin: 5}}>
                                <View style={{flexDirection: 'row', alignItems: 'center', margin: 10}}>
                                    <Caption style={{marginRight: 2}}> Other Details: </Caption>
                                    <Chip style={{marginRight: 2}}>Lead Source</Chip>
                                    <Chip style={{marginRight: 2}}>Date</Chip>
                                </View>
                            </Card>
                        </View>
                    </ScrollView>
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
                        <Title>Quick Search</Title>
                        <Divider/>
                    </View>
                    <View style={{alignItems: 'center', marginVertical: 20}}>
                        <View style={{flexDirection: 'row'}}>
                            <Chip style={{margin: 2}} onPress={() => fetchleadlist('Sale', 'salerent')}>Sale</Chip>
                            <Chip onPress={() => fetchleadlist('Rent', 'salerent')}>Rent</Chip>
                        </View>
                    </View>
                    <View style={{alignItems: 'center', marginVertical: 20}}>
                        <Text>Property Type</Text>
                        <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
                            <Chip style={{margin: 2}} onPress={()=> fetchleadlist('Apartment', 'propertytype')}>Apartment</Chip>
                            <Chip style={{margin: 2}} onPress={()=> fetchleadlist('Villa', 'propertytype')}>Villa</Chip>
                            <Chip style={{margin: 2}} onPress={()=> fetchleadlist('Plot', 'propertytype')}>Plot</Chip>
                            <Chip style={{margin: 2}} onPress={()=> fetchleadlist('Land', 'propertytype')}>Land</Chip>
                            <Chip onPress={()=> fetchleadlist('Office', 'propertytype')}>Office</Chip>
                        </View>
                    </View>
                    <View style={{alignItems: 'center', marginVertical: 20}}>
                        <Text>No. of bedrooms</Text>
                        <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
                            <Chip style={{margin: 2}} onPress={()=> fetchleadlist('Studio', 'bedroom')}>Studio</Chip>
                            <Chip style={{margin: 2}} onPress={()=> fetchleadlist('1 Bedroom', 'bedroom')}>1 Bedroom</Chip>
                            <Chip style={{margin: 2}} onPress={()=> fetchleadlist('2 Bedrooms', 'bedroom')}>2 Bedroom</Chip>
                            <Chip style={{margin: 2}} onPress={()=> fetchleadlist('3 Bedrooms', 'bedroom')}>3 Bedroom</Chip>
                            <Chip style={{margin: 2}} onPress={()=> fetchleadlist('4 Bedrooms', 'bedroom')}>4 Bedroom</Chip>
                            <Chip style={{margin: 2}} onPress={()=> fetchleadlist('5 Bedrooms', 'bedroom')}>5 Bedroom</Chip>
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
                <Snackbar
                    visible={visible}
                    onDismiss={onDismissSnackBar}>
                    Quick Search: No leads found for *{filterfield}*
                </Snackbar>
            </View>
        )
}