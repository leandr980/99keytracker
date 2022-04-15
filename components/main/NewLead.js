import React, {useState } from 'react'
import { View, StyleSheet, ScrollView, ImageBackground, Alert} from 'react-native'
import { Card, Button, TextInput, Provider, Chip} from 'react-native-paper'

import firebase from 'firebase'
require("firebase/firestore")
require("firebase/firebase-storage")

const alerthandler = () =>{
    Alert.alert(
        "Alert",
        "Feilds must not be left empty",
        [
          { text: "OK" }
        ]
      );
}

export default function NewLead(props) {

    const [name, setName] = useState("")
    const [number, setNumber] = useState("")
    const [area, setArea] = useState("")
    const [budget, setBudget] = useState("")

    const [salerent, setSalerent] = useState("")
    const [bedroom, setBedroom] = useState("")
    const [propertytype, setPropertytype] = useState("")
    const [furnishing, setFurnishing] = useState("")

    const [propertytypeother, setpropertytypeother] = useState(false)

    const creation = firebase.firestore.FieldValue.serverTimestamp()
    const keyhistorycreation = creation

    const saveKeyData = () => {

        if (!name.trim() || !number.trim() || !area.trim() || !budget.trim() === "") {
            alerthandler()
        }
        else {
            firebase.firestore()
                .collection('leadscollection')
                .doc(firebase.auth().currentUser.uid)
                .collection("leadslist")
                .add({
                    name,
                    number,
                    area,
                    budget,
                    salerent,
                    bedroom,
                    propertytype,
                    furnishing,
                    creation
                })
        }
    }

    return (
        <Provider>
            
            <ImageBackground 
            style={{flex: 1}}
            imageStyle={{resizeMode: 'repeat'}}
            source={require('../../assets/bg-image/99-whatsapp-bg-small.jpg')}>

                <ScrollView>

                    <Card style={styles.cardstyle}>

                        <Card.Title title='New Lead' />

                        <Card.Content >
                            <TextInput
                            style={styles.textinputstyle}
                            type='outlined'
                            placeholder="Name . . ."
                            onChangeText={(name) => setName(name)}/>
                            
                            <TextInput
                            style={styles.textinputstyle}
                            type='outlined'
                            placeholder="Phone Number . . ."
                            onChangeText={(number) => setNumber(number)}
                            />

                            <TextInput
                            style={styles.textinputstyle}
                            type='outlined'
                            placeholder="Area/Community . . ."
                            onChangeText={(area) => setArea(area)}
                            />

                            <TextInput
                            style={styles.textinputstyle}
                            type='outlined'
                            placeholder="Budget . . ."
                            onChangeText={(budget) => setBudget(budget)}
                            />
                        </Card.Content>
                    </Card>

                    <View style={{flexDirection: 'row'}}>

                    <Card style={styles.cardstyle}>
                        <Card.Title title='Sale / Rent' />
                        <Card.Content style={{flexDirection: 'row', flexWrap: 'wrap', marginBottom: 10}}>
                            <Chip onPress={()=>setSalerent('Sale')}>Sale</Chip>
                            <Chip onPress={()=>setSalerent('Rent')}>Rent</Chip>
                        </Card.Content>
                    </Card>

                    <Card style={styles.cardstyle}>
                        <Card.Title title='Lease Period:'/>
                        <Card.Content style={{flexDirection: 'row', flexWrap: 'wrap', marginBottom: 10}}>
                            <Chip >Monthly</Chip>
                            <Chip >Yearly</Chip>
                        </Card.Content>
                    </Card>
                    </View>
                    <Card style={styles.cardstyle}>
                        <Card.Title title='Lead Source:'/>
                        <Card.Content style={{flexDirection: 'row', flexWrap: 'wrap', marginBottom: 10}}>
                            <Chip >Walk-in</Chip>
                            <Chip >Property Finder</Chip>
                            <Chip >Dubizzle</Chip>
                            <Chip >Bayut</Chip>
                            <Chip >Website</Chip>
                            <Chip >Cold Call</Chip>
                            <Chip >Facebook / Instagram</Chip>
                            <Chip >Other</Chip>
                        </Card.Content>
                    </Card>

                    
                    <Card style={styles.cardstyle}>
                        <Card.Title title='Property Type'/>
                        <Card.Content style={{flexDirection: 'row', flexWrap: 'wrap', marginBottom: 10}}>
                            <Chip onPress={()=>setPropertytype('Villa')}>Villa</Chip>
                            <Chip onPress={()=>setPropertytype('Apartment')}>Apartment</Chip>
                            <Chip onPress={()=>setPropertytype('Apartment')}>Plot</Chip>
                            <Chip onPress={()=>setPropertytype('Apartment')}>Retail</Chip>
                            <Chip onPress={()=>setPropertytype('Other')}>Other</Chip>
                        </Card.Content>
                        {
                            propertytypeother &&
                        <Card.Content>
                            <TextInput
                            style={styles.textinputstyle}
                            type='outlined'
                            placeholder=". . ."
                            onChangeText={(name) => setName(name)}/>
                        </Card.Content>
                        }
                    </Card>

                    <Card style={styles.cardstyle}>
                        <Card.Title title='Number of bedrooms:'/>
                        <Card.Content style={{flexDirection: 'row', flexWrap: 'wrap', marginBottom: 10}}>
                            <Chip onPress={()=>setBedroom('Studio')}>Studio</Chip>
                            <Chip onPress={()=>setBedroom('1 BR')}>1 BR</Chip>
                            <Chip onPress={()=>setBedroom('2 BR')}>2 BR</Chip>
                            <Chip onPress={()=>setBedroom('3 BR')}>3 BR</Chip>
                            <Chip onPress={()=>setBedroom('Other')}>Other</Chip>
                        </Card.Content>
                        <Card.Content>
                            <TextInput
                            style={styles.textinputstyle}
                            type='outlined'
                            placeholder=". . ."
                            onChangeText={(name) => setName(name)}/>
                        </Card.Content>
                    </Card>

                    <Card style={styles.cardstyle}>
                        <Card.Title title='Furnishing'/>
                        <Card.Content style={{flexDirection: 'row', flexWrap: 'wrap', marginBottom: 10}}>
                            <Chip onPress={()=>setFurnishing('Other')}>Furnished</Chip>
                            <Chip onPress={()=>setFurnishing('Other')}>Un-Furnished</Chip>
                            <Chip onPress={()=>setFurnishing('Other')}>Partially Furnished</Chip>
                            <Chip onPress={()=>setFurnishing('Other')}>Any</Chip>
                        </Card.Content>
                    </Card>

                    <Card style={styles.cardstyle}>
                        <Card.Title title='Notes'/>
                        <Card.Content>
                            <TextInput
                            style={styles.textinputstyle}
                            type='outlined'
                            placeholder=". . ."
                            onChangeText={(name) => setName(name)}/>
                        </Card.Content>
                    </Card>

                    <Card style={styles.cardstyle}>

                        <Card.Actions style={{ justifyContent: 'center' }}>

                            <Button
                                onPress={() => saveKeyData()}>
                                SAVE
                            </Button>

                        </Card.Actions>

                    </Card>
                </ScrollView>
            </ImageBackground>
        </Provider>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    keyliststyle: {
        flex: 1,
        fontSize: 15,
    },
    cardstyle: {
        borderRadius: 10,
        margin: 10,
        elevation: 5,
        justifyContent: 'space-between'
    },
    textinputstyle: {
        marginVertical: 10
    },
    cardcontentstyle: {
        margin: 10
    }
})