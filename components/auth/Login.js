import React, { Component } from 'react';
import { View, StyleSheet, Text, ImageBackground, Alert} from 'react-native'
import { Card, Button, TextInput} from 'react-native-paper'

import firebase from 'firebase/app'
import 'firebase/auth'

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
    else{
        console.log(error)
    }
}

    

export class Login extends Component {

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
        const { email, password } = this.state;
        const emailfinal = email.trim()
        firebase.auth().signInWithEmailAndPassword(emailfinal, password)
            .then((result) => {
                console.log(result)
            })
            .catch((error) => {
                alerthandler(error)
            })
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
                                <Text style={{ fontSize: 30, fontWeight: 'bold' }}> Login </Text>
                            </Card.Content>

                            <Card.Content>
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
                            </Card.Content>

                            <Card.Actions style={{justifyContent: 'space-between'}}>
                                <Button onPress={() => { this.props.navigation.goBack() }}> GO BACK </Button>
                                <Button onPress={() => this.onSignUp()}> SIGN IN </Button>
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

export default Login;