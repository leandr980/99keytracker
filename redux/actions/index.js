import {
    USER_STATE_CHANGE,
    USER_POSTS_STATE_CHANGE,
    USER_KEYINFO_STATE_CHANGE,
    USER_KEYINFO_DETAILS_STATE_CHANGE,
} from '../constants/index'

import firebase from 'firebase'
import 'firebase/auth'
import 'firebase/firebase-firestore'
import 'firebase/firestore'

export function fetchUser() {
    return ((dispatch) => {
            firebase.firestore()
                .collection("users")
                .doc(firebase.auth().currentUser.uid)
                .get()
                .then((snapshot) => {
                    if (snapshot.exists) {
                        //console.log(snapshot.data())
                        dispatch({ type: USER_STATE_CHANGE, currentUser: snapshot.data() })

                    }
                    else {
                        console.log('does not exit!')
                    }
                })
    })
}

export function fetchUserPosts() {
    return ((dispatch) => {
        firebase.firestore()
            .collection("posts")
            .doc(firebase.auth().currentUser.uid)
            .collection("userPosts")
            .orderBy("creation", "asc")
            .get()
            .then((snapshot) => {
                let posts = snapshot.docs.map(doc => {
                    const data = doc.data();
                    const id = doc.id;
                    return {id, ...data}

                })
                //console.log(posts)
                dispatch({type: USER_POSTS_STATE_CHANGE, posts})
            })
    })
}

export function fetchKeyInfo() {
    return ((dispatch) => {
        firebase.firestore()
            .collection("keycollection")
            .doc(firebase.auth().currentUser.uid)
            .collection("keylist")
            .orderBy("creation", "asc")
            .onSnapshot((docSnapshot) => {
                let keyinfo = docSnapshot.docs.map(doc => {
                    const data = doc.data();
                    const id = doc.id;
                    return { id, ...data }

                })
                //console.log(keyinfo)
                dispatch({ type: USER_KEYINFO_STATE_CHANGE, keyinfo })
            })
    })
}
/*
export function fetchKeyInfo() {
    return ((dispatch) => {
        firebase.firestore()
            .collection("keycollection")
            .doc(firebase.auth().currentUser.uid)
            .collection("keylist")
            .orderBy("creation", "asc")
            .get()
            .then((snapshot) => {
                let keyinfo = snapshot.docs.map(doc => {
                    const data = doc.data();
                    const id = doc.id;
                    return { id, ...data }

                })
                //console.log(keyinfo)
                dispatch({ type: USER_KEYINFO_STATE_CHANGE, keyinfo })
            })
    })
}
*/

export function fetchKeyInfoDetailes() {
    return ((dispatch) => {
        firebase.firestore()
            .collection("keycollection")
            .doc(firebase.auth().currentUser.uid)
            .collection("keylist")
            .doc(props.route.params.uid)
            .get()
            .then((snapshot) => {
                let keyinfodetails = snapshot.data
                return keyinfodetails
                console.log(keyinfodetails , "redux actions")
                dispatch({ type: USER_KEYINFO_DETAILS_STATE_CHANGE, keyinfodetails })
            })
    })
}