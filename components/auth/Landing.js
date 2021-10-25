// JavaScript source code
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Card, FAB, Searchbar, IconButton, Paragraph, Divider, Chip, Button } from 'react-native-paper'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'



export default function Landing({ navigation }) {

    return (
        <View style={{ flex: 1, justifyContent: 'center' }}>
            <Card style={styles.cardstyle}>
                <Card.Content style={{alignItems: 'center', marginBottom: 20}}>
                    <Text style={{fontSize: 30, fontWeight: 'bold'}}> 99 Key Tracker </Text>
                </Card.Content>

                <Card.Content>
                    <Button onPress={() => navigation.navigate("Register")}> Register </Button>
                    <Button onPress={() => navigation.navigate("Login")}> Login </Button>
                </Card.Content>
            </Card>
        </View>
        )
}

const styles = StyleSheet.create({
    cardstyle: {
        borderRadius: 10,
        margin: 10,
        elevation: 10
    },

})

