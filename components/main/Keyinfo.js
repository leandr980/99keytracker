import React, { useState, useEffect } from 'react'
import { View, Text, Flatlist, Button, TextInput } from 'react-native'

import firebase from 'firebase'
require("firebase/firestore")

export default function Keyinfo(props) {

    const [keydetails, setKeydetails] = useState([])
    const [keyHistory, setKeyHistory] = useState([])
    const [keyId, setKeyId] = useState("")
    const [text, setText] = useState("")

    //console.log(props.route.params.keyId)
    //console.log(props.route.params.uid)


    useEffect(() => {

        if (props.route.params.keyId !== keyId) {
            firebase.firestore()
                .collection('keycollection')
                .doc(props.route.params.uid)
                .collection('keylist')
                .doc(props.route.params.keyId)
                .get()
                .then((snapshot) => {
                    setKeydetails(snapshot.data())
                })
            setKeyId(props.route.params.keyId)

        }

    }, [props.route.params.keyId])

    //console.log(keydetails)

    return (

        <View>
            <Text> keyinfo screen </Text>
            <Text> key name: { keydetails.keyname} </Text>
            <Text> key location: {keydetails.keylocation} </Text>

            </View>
        )
}