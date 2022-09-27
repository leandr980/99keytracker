export const addnewnote = () => {
    firebase.firestore()
    .collection('leadscollection')
    .doc(firebase.auth().currentUser.uid)
    .collection("leadslist")
    .doc(props.route.params.LeadId)
    .collection('leadnotes')
    .add({
        notes,
        creation,
        creationupdate
    }).then(setnotes(''))
}

export const changeleadstatus = (leadid, notificationid) => {
    firebase.firestore()
    .collection("leadscollection")
    .doc(firebase.auth().currentUser.uid)
    .collection("leadslist")
    .doc(leadid)
    .update({
        status: status,
        creationupdate: creationupdate
    }).then(deletereminder(notificationid), addnewnotecontacted(leadid))
    
}

export const addnewnotecontacted = (leadid) => {
    firebase.firestore()
    .collection('leadscollection')
    .doc(firebase.auth().currentUser.uid)
    .collection("leadslist")
    .doc(leadid)
    .collection('leadnotes')
    .add({
        notes: 'This lead was contacted',
        creation,
        creationupdate
    })
}

export const deletereminder = (doctodelete) => {
    firebase.firestore()
    .collection('notification-collection')
    .doc(firebase.auth().currentUser.uid)
    .collection("notificationlist")
    .doc(doctodelete)
    .delete()    
}

export const deletenote = (doctodelete) => {
    firebase.firestore()
    .collection('leadscollection')
    .doc(firebase.auth().currentUser.uid)
    .collection("leadslist")
    .doc(props.route.params.LeadId)
    .collection("leadnotes")
    .doc(doctodelete)
    .delete()    
}

export const deletelead =()=> {

    setLoading(true)

    const refnotes = firebase.firestore() 
    .collection('leadscollection')
    .doc(firebase.auth().currentUser.uid)
    .collection("leadslist")
    .doc(props.route.params.LeadId)
    .collection("leadnotes")

    leadnotes.forEach((doc)=>{
        refnotes.doc(doc.id).delete()
        console.log('deleted notes doc with id: ', doc.id)
    })

    const refnotifs = firebase.firestore()
    .collection("notification-collection")
    .doc(firebase.auth().currentUser.uid)
    .collection("notificationlist")

    notificationlist.forEach((doc)=>{
        refnotifs.doc(doc.id).delete()
        console.log('deleted notifs doc with id: ', doc.id)
    })

    firebase.firestore()
    .collection("leadscollection")
    .doc(props.route.params.uid)
    .collection("leadslist")
    .doc(props.route.params.LeadId)
    .delete().then((function () {
        props.navigation.pop()
    }))
}