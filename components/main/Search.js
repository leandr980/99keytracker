import React, { useState } from 'react'
import { View, Text, TextInput, FlatList } from 'react-native'

import firebase from 'firebase'
import { Card, Divider, IconButton } from 'react-native-paper'
import { Icon } from 'react-native-elements'
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
                    <IconButton icon={'magnify'}/>
                    <TextInput placeholder="Search . . . ." onChangeText={(search) => fetchUsers(search)} />
                </View>
            </Card>
            <Card>
                <FlatList
                    numColumns={1}
                    horizontal={false}
                    data={keydata}
                    renderItem={({ item }) => (
                    <View style={{padding: 10}}>
                        <Text onPress={() => props.navigation.navigate("Keyinfo", { keyId: item.id, uid: firebase.auth().currentUser.uid })}> {item.keyname} </Text>
                        <Divider/>
                    </View>
                    )}
                />
            </Card>
            </View>
        )
}