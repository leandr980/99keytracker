// JavaScript source code
import React, { useEffect, useState } from 'react'
import { View, Text, Image, FlatList, StyleSheet, Button, TouchableOpacity } from 'react-native'

import firebase from 'firebase'
require ("firebase/firestore")

import { connect } from 'react-redux'
    
function Profile(props) {

    const [userPost, setUserPosts] = useState([]);
    const [userKeys, setUserKeys ] = useState([]);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const { currentUser, posts, keyinfo } = props;
        //console.log({ currentUser, posts })

        if (props.route.params.uid === firebase.auth().currentUser.uid) {
            setUser(currentUser)
            setUserPosts(posts)
            setUserKeys(keyinfo)

            //console.log(keyinfo)
        }
        else {
            firebase.firestore()
                .collection("users")
                .doc(props.route.params.uid)
                .get()
                .then((snapshot) => {
                    if (snapshot.exists) {
                        //console.log(snapshot.data())
                        setUser(snapshot.data());
                        console.log(snapshot.data())
                         

                    }
                    else {
                        console.log('does not exit!')
                    }
                })

            firebase.firestore()
                .collection("posts")
                .doc(props.route.params.uid)
                .collection("userPosts")
                .orderBy("creation", "asc")
                .get()
                .then((snapshot) => {
                    let posts = snapshot.docs.map(doc => {
                        const data = doc.data();
                        const id = doc.id;
                        return { id, ...data }
                    })
                    setUserPosts(posts)
                })

            firebase.firestore()
                .collection("keycollection")
                .doc(props.route.params.uid)
                .collection("keylist")
                .orderBy("creation", "asc")
                .get()
                .then((snapshot) => {
                    let keyinfo = snapshot.docs.map(doc => {
                        const data = doc.data();
                        const id = doc.id;
                        return { id, ...data }
                    })
                    setUserKeys(keyinfo)
                })

        }

    }, [props.route.params.uid])

    const onLogout = () => {
        firebase.auth().signOut();
    }

    if (user === null) {
        return <View/>

    }

    const { currentUser, posts } = props;
    //console.log({currentUser, posts})
    return (
        <View style={ styles.container}>
            <View style={styles.containerInfo}>
                <Text> name: {user.name} </Text>
                <Text> email: {user.email} </Text>

                <Button title='logout' onPress={() =>onLogout()}/>
                <Button title='refresh' onPress={() => setUserKeys(keyinfo)}/>
            </View>

            <View style={styles.containerGallery}>

                <FlatList
                    numColumns={1}
                    horizontal={false}
                    data={userKeys}
                    renderItem={({ item }) => (
                        <View style={styles.containerKeylist}>
                            <TouchableOpacity
                                onPress={() => props.navigation.navigate("Keyinfo", { uid: item.id })}>
                                <Text> {item.keyname} {item.keylocation} </Text>
                            </TouchableOpacity>

                        </View>

                    )}
                />

            </View>
        </View>
    )
}



const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 40
    },
    containerInfo: {
        margin: 20,
    },
    containerGallery: {
        flex: 1,
    },
    image: {
        flex: 1,
        aspectRatio: 1/1
    },
    containerImage: {
        flex: 1/3
    },
    containerKeylist: {
        flex: 1,
        alignItems: "center",
    }
})

const mapStateToProps = (store) => ({
    currentUser: store.userState.currentUser,
    posts: store.userState.posts,
    keyinfo: store.userState.keyinfo
})

export default connect(mapStateToProps, null)(Profile)