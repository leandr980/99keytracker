// JavaScript source code
import React from 'react';
import { StyleSheet, Text, View, ImageBackground } from 'react-native';
import { Card, FAB, Searchbar, IconButton, Paragraph, Divider, Chip, Button } from 'react-native-paper'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'



export default function Landing({ navigation }) {

    return (
        <View style={{ flex: 1}}>
            <ImageBackground 
            style={{flex: 1}}
            imageStyle={{resizeMode: 'repeat'}}
            source={require('../../assets/bg-image/99-whatsapp-bg-small.jpg')}>
                <View style={{flex: 1, justifyContent: 'center', alignSelf: 'center', marginTop: 30, width: 350}}>

                    <Card style={styles.cardstyle}>
                        <Card.Cover source={require('../../assets/99frontlogo.gif')} 
                        style={{alignSelf: "center", aspectRatio: 1/1, width: 200}}/>

                        <Card.Content style={{alignItems: 'center', marginBottom: 20}}>
                            <Text style={{fontSize: 30, fontWeight: 'bold'}}> 99 KEY TRACKER </Text>
                        </Card.Content>

                        <Card.Content >
                            <Button onPress={() => navigation.navigate("Register")}> Register </Button>
                            <Button onPress={() => navigation.navigate("Login")}> Login </Button>
                        </Card.Content>
                    </Card>
                </View>

            </ImageBackground>
        </View>
        )
}

const styles = StyleSheet.create({
    cardstyle: {

        borderRadius: 20,
        margin: 20,
        elevation: 10,

    },

})

