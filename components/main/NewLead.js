import React, {useState, useRef} from 'react'
import { View, StyleSheet, ScrollView, ImageBackground, Alert, SafeAreaView, TextInput, Text, } from 'react-native'
import { Card, Button, Provider, Chip, Divider} from 'react-native-paper'

import {Picker} from '@react-native-picker/picker';
import DropDownPicker from 'react-native-dropdown-picker';

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
    const [email, setEmail] = useState("")
    const [area, setArea] = useState()
    const [budget, setBudget] = useState("")

    const [salerent, setSalerent] = useState("")
    const [bedroom, setBedroom] = useState("")
    const [propertytype, setPropertytype] = useState("")
    const [furnishing, setFurnishing] = useState("")
    const [leadsource, setLeadsource] = useState("")

    const status = 'NOT CONTACTED'

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
                    status,
                    creation
                }).then((function () {
                    props.navigation.pop()
                }))
        }
    }

    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(null);
    const [items, setItems] = useState([
      {label: 'Apartment', value: 'Apartment'},
      {label: 'Villa', value: 'Villa'},
      {label: 'Plot', value: 'Plot'},
      {label: 'Land', value: 'Land'},
      {label: 'Office', value: 'Office'},
    ]);

    const [selectedLanguage, setSelectedLanguage] = useState();
    const [selectedLanguage1, setSelectedLanguage1] = useState();

    return (
        <Provider>
            
            <ImageBackground 
            style={{flex: 1}}
            imageStyle={{resizeMode: 'repeat'}}
            source={require('../../assets/bg-image/99-whatsapp-bg-small.jpg')}>
                <SafeAreaView>
                <ScrollView >

                    <Card style={styles.cardstyle}>
                        <Card.Content>
                            <Text>Name</Text>
                            <TextInput
                            style={styles.textinputstyle}
                            type='outlined'
                            placeholder="Name . . ."
                            onChangeText={(name) => setName(name)}/>
                            <Text>Phone Number</Text>
                            <TextInput
                            style={styles.textinputstyle}
                            type='outlined'
                            placeholder="Phone Number . . ."
                            onChangeText={(name) => setName(name)}/>
                            <Text>Email</Text>
                            <TextInput
                            style={styles.textinputstyle}
                            type='outlined'
                            placeholder="E-mail . . ."
                            onChangeText={(name) => setName(name)}/>
                        </Card.Content>
                    </Card>

                    <Card style={styles.cardstyle}>
                        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                            <View style={{padding: 10}}>
                                <Text style={{marginVertical: 5}}>Property Type:</Text>
                            <DropDownPicker
                            containerStyle={{width: '50%'}}
                            listMode="SCROLLVIEW"
                            open={open}
                            value={value}
                            items={items}
                            setOpen={setOpen}
                            setValue={setValue}
                            setItems={setItems}
                            />
                            </View>

                        </View>

                        <View style={{flexDirection: 'row'}}>
                            <View>
                                <Picker
                                selectedValue={selectedLanguage}
                                onValueChange={(itemValue, itemIndex) =>
                                    setSelectedLanguage(itemValue)
                                }>
                                <Picker.Item label="Java" value="java" />
                                <Picker.Item label="JavaScript" value="js" />
                                </Picker>
                            </View>
                            <View>
                                <Picker
                                selectedValue={selectedLanguage}
                                onValueChange={(itemValue, itemIndex) =>
                                    setSelectedLanguage(itemValue)
                                }>
                                <Picker.Item label="Java" value="java" />
                                <Picker.Item label="JavaScript" value="js" />
                                </Picker>
                            </View>
                        </View>
                        <Card.Content>
                            <Text>Property Type</Text>



                            <Text>Area</Text>
                            <Text>Sale / Rent</Text>
                            <Text>Budget</Text>
                            <Text>No. of Bedrooms</Text>
                            <Text>Furnishing</Text>
                        </Card.Content>
                    </Card>

                    <Card style={styles.cardstyle}>
                        <Card.Content>
                            <Text>Lead Source</Text>
                            <Text>Notes</Text>
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
                </SafeAreaView>
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
        margin: 10,
        elevation: 5,
        justifyContent: 'space-between'
    },
    textinputstyle: {
        marginVertical: 10
    },
    pickerstyle: {
        marginVertical: 10
    },
    cardcontentstyle: {
        margin: 10
    }
})