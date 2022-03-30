import React, { useState } from 'react'
import { View, Text, TextInput, FlatList, TouchableOpacity } from 'react-native'

import firebase from 'firebase'
require('firebase/firestore')

export default function Search(props) {
    const [keydata, setkeydata] = useState([])

    const fetchUsers = (search) => {
        firebase.firestore()
            .collection('users')
            .where('name', '>=', search)
            .get()
            .then((snapshot) => {
                let keydata = snapshot.docs.map(doc => {
                    const data = doc.data();
                    const id = doc.id;
                    return { id, ...data }
                });
                setkeydata(keydata);
            })
    }

    return (
        <View>
            <TextInput placeholder="Search . . . ." onChangeText={(search) => fetchUsers(search)} />

            <FlatList
                numColumns={1}
                horizontal={false}
                data={keydata}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        onPress={() => props.navigation.navigate("Profile")}
                    >
                        <Text> {item.name} </Text>
                    </TouchableOpacity>

                    )}
            />
            </View>
        )
}