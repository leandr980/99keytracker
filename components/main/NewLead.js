import React, {useState, useRef} from 'react'
import { View, StyleSheet, ScrollView, ImageBackground, Alert, SafeAreaView, TextInput, Text, } from 'react-native'
import { Card, Button, Provider, Chip, Divider} from 'react-native-paper'

import {Picker} from '@react-native-picker/picker';
import DropDownPicker from 'react-native-dropdown-picker';
import { Dropdown } from 'react-native-element-dropdown';

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

    const [value, setValue] = useState(null);
    const [value2, setValue2] = useState(null);
    
    const [name, setName] = useState("")
    const [number, setNumber] = useState("")
    const [email, setEmail] = useState("")

    const [salerent, setSalerent] = useState("")
    const [propertytype, setPropertytype] = useState('')
    const [area, setArea] = useState('')
    const [bedroom, setBedroom] = useState("")
    const [budget, setBudget] = useState("")
    const [furnishing, setFurnishing] = useState("")
    
    const [leadsource, setLeadsource] = useState('')
    
    const [propertytypeother, setpropertytypeother] = useState(false)
    
    const status = 'NOT CONTACTED'

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

    const leadsourcedata = [
        { label: 'Property Finder', value: 'Property Finder' },
        { label: 'Bayut', value: 'Bayut' },
        { label: 'Dubizzle', value: 'Dubizzle' },
        { label: 'Walk-In', value: 'Walk-In' },
        { label: 'Cold Calling', value: 'Cold Calling' },
        { label: 'Facebook / Instagram', value: 'Facebook / Instagram' },
        { label: 'Google', value: 'Google' },
        { label: 'Website', value: 'Website' },
        { label: 'Referral', value: 'Referral' },
    ];

    const dubaiareadata = [
        { label: 'Al Barsha', value: 'Al Barsha' }
    ];

    const propertytypedata = [
        { label: 'Apartment', value: 'Apartment' },
        { label: 'Villa', value: 'Villa' },
        { label: 'Office', value: 'Office' },
        { label: 'Plot', value: 'Plot' },
        { label: 'Land', value: 'Land' },
    ];

    

    return (
        <Provider>
            
            <ImageBackground 
            style={{flex: 1}}
            imageStyle={{resizeMode: 'repeat'}}
            source={require('../../assets/bg-image/99-whatsapp-bg-small.jpg')}>
                <ScrollView >

                    <Card style={styles.cardstyle}>
                        <Card.Content>
                            
                            <TextInput
                            style={styles.textinputstyle}
                            type='outlined'
                            placeholder="Name . . ."
                            onChangeText={(name) => setName(name)}/>
                            
                            <TextInput
                            style={styles.textinputstyle}
                            type='outlined'
                            placeholder="Phone Number . . ."
                            onChangeText={(name) => setName(name)}/>

                            <TextInput
                            style={styles.textinputstyle}
                            type='outlined'
                            placeholder="E-mail . . ."
                            onChangeText={(name) => setName(name)}/>
                        </Card.Content>
                    </Card>

                    <Card style={styles.cardstyle}>
                        <Card.Content>
                            <Text>Sale / Rent</Text>
                            <View style={{flexDirection: 'row'}}>
                                <Chip>Sale</Chip>
                                <Chip>Rent</Chip>
                            </View>
                        </Card.Content>
                        <View>
                            <Text>{value}</Text>
                            <Dropdown
                                style={styles.dropdown}
                                placeholderStyle={styles.placeholderStyle}
                                selectedTextStyle={styles.selectedTextStyle}
                                inputSearchStyle={styles.inputSearchStyle}
                                iconStyle={styles.iconStyle}
                                data={leadsourcedata}
                                search
                                maxHeight={300}
                                labelField="label"
                                valueField="value"
                                placeholder="Select item"
                                searchPlaceholder="Search..."
                                value={value}
                                onChange={item => {
                                setValue(item.value);
                                }}
                            />
                            <Text>{value2}</Text>
                            <Dropdown
                                style={styles.dropdown}
                                placeholderStyle={styles.placeholderStyle}
                                selectedTextStyle={styles.selectedTextStyle}
                                inputSearchStyle={styles.inputSearchStyle}
                                iconStyle={styles.iconStyle}
                                data={leadsourcedata}
                                search
                                maxHeight={300}
                                labelField="label"
                                valueField="value"
                                placeholder="Select item"
                                searchPlaceholder="Search..."
                                value={value2}
                                onChange={item => {
                                setValue2(item.value2);
                                }}
                            />
                        </View>
                        <Card.Content>
                            <Text>No. of Bedrooms</Text>
                            <View style={{flexDirection: 'row'}}>
                                <Chip>Studio</Chip>
                                <Chip>1 Bedroom</Chip>
                                <Chip>2 Bedroom</Chip>
                                <Chip>3 Bedroom</Chip>
                                <Chip>4 Bedroom</Chip>
                                <Chip>5 Bedroom</Chip>
                            </View>
                        </Card.Content>
                            <Text>Budget</Text>

                        <Card.Content>
                            <Text>Furnishing</Text>
                            <View style={{flexDirection: 'row'}}>
                                <Chip>Furnished</Chip>
                                <Chip>Un-Furnished</Chip>
                                <Chip>Any</Chip>
                            </View>
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
                            <Button onPress={() => saveKeyData()}> SAVE </Button>
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
        margin: 10,
        elevation: 5,
        justifyContent: 'space-between'
    },
    textinputstyle: {
        marginVertical: 20,
        borderBottomWidth: 0.5,
        borderBottomColor: 'grey',
    },
    pickerstyle: {
        marginVertical: 10
    },
    cardcontentstyle: {
        margin: 10
    },
    dropdown: {
        margin: 16,
        height: 50,
        borderBottomColor: 'gray',
        borderBottomWidth: 0.5,
      },
      icon: {
        marginRight: 5,
      },
      placeholderStyle: {
        fontSize: 16,
      },
      selectedTextStyle: {
        fontSize: 16,
      },
      iconStyle: {
        width: 20,
        height: 20,
      },
      inputSearchStyle: {
        height: 40,
        fontSize: 16,
      },
})