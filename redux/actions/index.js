import {
    USER_STATE_CHANGE,
    USER_POSTS_STATE_CHANGE,
    USER_KEYINFO_STATE_CHANGE,
    USER_KEYINFO_DETAILS_STATE_CHANGE,
    USER_KEYINFO2_STATE_CHANGE,

    USER_LEADFILTER_SALE_CHANGE,

    USER_NOTIFICATION_STATE_CHANGE
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
            .orderBy("creation", "desc")
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
            .orderBy("creation", "desc")
            .onSnapshot((docSnapshot) => {
                let keyinfo = docSnapshot.docs.map(doc => {
                    const data = doc.data();
                    const id = doc.id;
                    return { id, ...data }

                })
                //console.log(keyinfo)
                if (!docSnapshot.metadata.hasPendingWrites) {  // <======
                    dispatch({ type: USER_KEYINFO_STATE_CHANGE, keyinfo })
                 }
            })
    })
}

export function fetchKeyInfoDetails() {
    return ((dispatch) => {
        firebase.firestore()
            .collection("keycollection")
            .doc(firebase.auth().currentUser.uid)
            .collection("keylist")
            .orderBy("creation", "desc")
            .onSnapshot((docSnapshot) => {
                let keyinfodetails = docSnapshot.docs.map(doc => {
                    const id = doc.id;
                    return { id }
                })
                //console.log(keyinfodetails)
                if (!docSnapshot.metadata.hasPendingWrites) {  
                   /* const arrayid = []
                    for (let i = 0; i < keyinfodetails.length; i++) {
                        arrayid.push(keyinfodetails[i].id)
                    }
                    console.log(arrayid, 'list of ids')
                    
                        const finalarr = []

                        console.log(finalarr, 'list of objects')
                        console.log(finalarr[0], 'list of objects')*/
                    
                    dispatch({ type: USER_KEYINFO_DETAILS_STATE_CHANGE, keyinfodetails })
                }
            })
    })
}
/*
async function loopshit (arrayid){
    const finalarr = []
    for (let i = 0; i < arrayid.length; i++) {
        await new Promise((resolve) => {
            firebase.firestore()
                .collection('keycollection')
                .doc(firebase.auth().currentUser.uid)
                .collection('keylist')
                .doc(arrayid[i])
                .collection('keyhistory')
                .orderBy("creation", "desc")
                .onSnapshot((docSnapshot) => {
                    let keyHistory = docSnapshot.docs.map(doc => {
                        const data = doc.data()
                        const id = doc.id
                        return { id, ...data }
                    })
                    if (!docSnapshot.metadata.hasPendingWrites) {
                        //console.log(keyHistory[0])
                        resolve(keyHistory[0])
                    }
                })
        }).then((result)=> finalarr.push(result))
    }
    return finalarr
}
*/

export function fetchKeyInfo2() {
    return ((dispatch) => {
        firebase.firestore()
            .collection("leadscollection")
            .doc(firebase.auth().currentUser.uid)
            .collection("leadslist")
            .orderBy("creation", "desc")
            .onSnapshot((docSnapshot) => {
                let keyinfo2 = docSnapshot.docs.map(doc => {
                    const data = doc.data();
                    const id = doc.id;
                    return { id, ...data }

                })
                //console.log(keyinfo2, 'fetchkeyinfo2')
                if (!docSnapshot.metadata.hasPendingWrites) {  // <======
                    dispatch({ type: USER_KEYINFO2_STATE_CHANGE, keyinfo2 })
                 }
            })
    })
}
export function leadfiltersale() {
    return ((dispatch) => {
        firebase.firestore()
            .collection("leadscollection")
            .doc(firebase.auth().currentUser.uid)
            .collection("leadslist")
            .where('salerent', '==', 'Sale')
            .onSnapshot((docSnapshot) => {
                let leadfiltersale = docSnapshot.docs.map(doc => {
                    const data = doc.data();
                    const id = doc.id;
                    return { id, ...data }

                })
                //console.log(keyinfo2, 'fetchkeyinfo2')
                if (!docSnapshot.metadata.hasPendingWrites) {  // <======
                    dispatch({ type: USER_LEADFILTER_SALE_CHANGE, leadfiltersale })
                 }
            })
    })
}
export function notificationlist() {
    return ((dispatch) => {
        firebase.firestore()
            .collection("notification-collection")
            .doc(firebase.auth().currentUser.uid)
            .collection("notificationlist")
            .onSnapshot((docSnapshot) => {
                let notificationlist = docSnapshot.docs.map(doc => {
                    const data = doc.data();
                    const id = doc.id;
                    return { id, ...data }

                })
                console.log(notificationlist, 'notificationlist')
                if (!docSnapshot.metadata.hasPendingWrites) {  // <======
                    dispatch({ type: USER_NOTIFICATION_STATE_CHANGE, notificationlist })
                 }
            })
    })
}