import React, { Component } from 'react';
import { View, StyleSheet, Text, ImageBackground, Alert } from 'react-native'
import { Card, Button, TextInput } from 'react-native-paper'

import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firebase-firestore'

const alerthandler = (error) =>{
    
    if(error == 'Error: The email address is badly formatted.'){
        Alert.alert(
            "Alert",
            "The email address is badly formatted or missing",
            [{ text: "OK" }]);
    }
    else if(error == 'Error: The password is invalid or the user does not have a password.'){
        Alert.alert(
            "Alert",
            "The password is invalid or the user does not have a password.",
            [{ text: "OK" }]);
    }
    else if (error == 'Error: There is no user record corresponding to this identifier. The user may have been deleted.'){
        Alert.alert(
            "Alert",
            "This user does not exit",
            [{ text: "OK" }]);
    }
    else if (error == 'repassdoesnotmatch'){
        Alert.alert(
            "Alert",
            "Passwords must be the same",
            [{ text: "OK" }]);
    }
    else if (error == 'Error: The email address is already in use by another account.'){
        Alert.alert(
            "Alert",
            "The email address is already in use by another account",
            [{ text: "OK" }]);
    }
    else{
        console.log(error)
    }
}

export class Register extends Component {

    constructor(props) {
        super(props);

        this.state = {
            email: '',
            password: '',
            name: ''
        }

        this.onSignUp = this.onSignUp.bind(this)
    }

    onSignUp() {
        const { email, password, name,repassword } = this.state;
        if(password != repassword){
            alerthandler('repassdoesnotmatch')
        }
        else{

            const emailfinal = email.trim()
            firebase.auth().createUserWithEmailAndPassword(emailfinal, password)
                .then((result) => {
                    firebase.firestore().collection("users")
                        .doc(firebase.auth().currentUser.uid)
                        .set({
                            name,
                            email
                        })
    
                    console.log(result)
                })
                .catch((error) => {
                    console.log(error)
                    alerthandler
                })
        }
    }

    

    render() {
        return (
            <View style={{ flex: 1}}>
                <ImageBackground 
                style={{flex: 1}}
                imageStyle={{resizeMode: 'repeat'}}
                source={require('../../assets/bg-image/99-whatsapp-bg-small.jpg')}>
                    <View style={{ flex: 1, justifyContent: 'center', marginTop: 30 }}>

                        <Card style={styles.cardstyle}>
                            <Card.Content style={{ alignItems: 'center', marginBottom: 20 }}>
                                <Text style={{ fontSize: 30, fontWeight: 'bold' }}> Register </Text>
                            </Card.Content>

                            <Card.Content>
                                <TextInput
                                    style={styles.textinputstyle}
                                    type='outlined'
                                    label="Name . . ."
                                    onChangeText={(name) => this.setState({ name })}
                                />

                                <TextInput
                                    style={styles.textinputstyle}
                                    type='outlined'
                                    label="Email . . ."
                                    onChangeText={(email) => this.setState({ email })}
                                />

                                <TextInput
                                    style={styles.textinputstyle}
                                    type='outlined'
                                    label="Password . . ."
                                    onChangeText={(password) => this.setState({ password })}
                                    secureTextEntry={true}
                                />

                                <TextInput
                                    style={styles.textinputstyle}
                                    type='outlined'
                                    label="Reconfirm Password . . ."
                                    onChangeText={(repassword) => this.setState({ repassword })}
                                />
                            </Card.Content>

                            <Card.Actions style={{ justifyContent: 'space-between' }}>
                                <Button onPress={() => { this.props.navigation.goBack() }}> GO BACK </Button>
                                <Button onPress={() => this.onSignUp()}> SIGN UP </Button>
                            </Card.Actions>

                        </Card>
                    </View>

                </ImageBackground>

            </View>
        )
    }
}

const styles = StyleSheet.create({
    cardstyle: {
        borderRadius: 10,
        margin: 20,
        elevation: 10
    },
    textinputstyle: {
        marginVertical: 5
    },
})

export default Register;