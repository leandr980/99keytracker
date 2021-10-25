import React, { Component } from 'react';
import { View, StyleSheet, Text } from 'react-native'
import { Card, FAB, Searchbar, IconButton, Paragraph, Divider, Chip, Button, TextInput } from 'react-native-paper'

import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firebase-firestore'

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
        const { email, password, name } = this.state;
        firebase.auth().createUserWithEmailAndPassword(email, password)
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
            })
    }

    render() {
        return (
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
                        />
                    </Card.Content>

                    <Card.Actions style={{ justifyContent: 'space-between' }}>
                        <Button onPress={() => this.onSignUp()}> SIGN UP </Button>
                        <Button onPress={() => { this.props.navigation.goBack() }}> GO BACK </Button>
                    </Card.Actions>

                </Card>
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