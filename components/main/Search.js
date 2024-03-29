import React, { useState } from 'react'
import { View, TextInput, FlatList } from 'react-native'

import firebase from 'firebase'
import { Card, Divider, IconButton } from 'react-native-paper'
require('firebase/firestore')

export default function Search(props) {
    const [keydata, setkeydata] = useState([])

    const fetchUsers = (search) => {
        firebase.firestore()
            .collection("keycollection")
            .doc(firebase.auth().currentUser.uid)
            .collection("keylist")
            .where('keyname', '>=', search)
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
            <Card>
                <FlatList
                    numColumns={1}
                    horizontal={false}
                    data={keydata}
                    renderItem={({ item }) => (
                    <View style={{padding: 10}}>
                        <Card>
                            <Card.Title
                            title={item.keyname}
                            subtitle={item.keybuildingvilla + ', ' +item.keyarea}
                            right={()=> <IconButton icon="chevron-right" 
                            onPress={() => props.navigation.navigate("Keyinfo", { keyId: item.id, uid: firebase.auth().currentUser.uid })}/>}
                            />
                        </Card>
                        <Divider/>
                    </View>
                    )}
                />
            </Card>
            </View>
        )
}