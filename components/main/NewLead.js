import React, {useState, useRef} from 'react'
import { View, StyleSheet, ScrollView, ImageBackground, Alert, SafeAreaView, TextInput, Text} from 'react-native'
import { Card, Button, Provider, Chip, Divider, Title, RadioButton, TouchableRipple} from 'react-native-paper'

import {Picker} from '@react-native-picker/picker';
import DropDownPicker from 'react-native-dropdown-picker';
import { Dropdown, MultiSelect} from 'react-native-element-dropdown';
import Slider from '@react-native-community/slider';

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

import { Dimensions } from 'react-native';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function NewLead(props) {

    const [value, setValue] = useState(null);
    const [value2, setValue2] = useState('first');
    
    const [name, setName] = useState("")
    const [number, setNumber] = useState("")
    const [email, setEmail] = useState("")

    const [salerent, setSalerent] = useState("")
    const [propertytype, setPropertytype] = useState('')
    //const [area, setArea] = useState('')
    const [multiplearea, setmultiplearea] = useState([]);
    const [bedroom, setBedroom] = useState("")
    const [budget, setBudget] = useState("")
    const [furnishing, setFurnishing] = useState("")
    
    const [leadsource, setLeadsource] = useState('')
    const [notes, setnotes] = useState('')
    
    const [propertytypeother, setpropertytypeother] = useState(false)
    
    const status = 'NOT CONTACTED'

    const creation = firebase.firestore.FieldValue.serverTimestamp()
    const keyhistorycreation = creation

    const [selectedsalerent ,setSelectedsalerent] = useState(false)

    const saveKeyData = () => {

        if (!name.trim() || !number.trim() || !budget.trim() === "") {
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
                    email,

                    salerent,
                    propertytype,
                    multiplearea,
                    bedroom,
                    budget,
                    furnishing,

                    leadsource,
                    notes,

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
        { label: 'Al Barsha', value: 'Al Barsha' },
        { label: 'Emirates Hills', value: 'Emirates Hills' },
        { label: 'Downtown Dubai', value: 'Downtown Dubai' },
        { label: 'Jebal Ali', value: 'Jebal Ali' },
        { label: 'Jumeirah Village Circle', value: 'Jumeirah Village Circle' },
        { label: 'Jumeirah Village Triangle', value: 'Jumeirah Village Triangle' },
    ];

    const [budgetrange, setbudgetrange] = useState(0)
    const [budgetrange1, setbudgetrange1] = useState(0)

    const [checked, setChecked] = React.useState('');

    return (
        <Provider>
            
            <ImageBackground 
            style={{flex: 1}}
            imageStyle={{resizeMode: 'repeat'}}
            source={require('../../assets/bg-image/99-whatsapp-bg-small.jpg')}>
                <Divider/>
                <ScrollView >
                    <Text style={{
                        marginHorizontal: 20,
                        fontSize: 30, 
                        fontWeight: 'bold'}}> New Client Entry </Text>

                    <Card style={styles.cardstyle}>

                        <Card.Title title='Client Info'/>

                        <Divider style={{margin: 10}}/>
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
                            onChangeText={(name) => setNumber(name)}/>

                            <TextInput
                            style={styles.textinputstyle}
                            type='outlined'
                            placeholder="E-mail . . ."
                            onChangeText={(email) => setEmail(email)}/>
                        </Card.Content>
                    </Card>

                    <Card style={styles.cardstyle}>

                        <Card.Title title='Property Details'/>

                        <Divider style={{margin: 10}}/>
                        <Card.Content style={{marginVertical: 15}}>
                            <Title>Sale / Rent</Title>
                            <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
                                <Chip selected={ salerent === 'Rent' ? true : false } 
                                style={{marginRight: 5, marginBottom: 5}} 
                                onPress={()=> setSalerent('Rent')}>Rent</Chip>

                                <Chip selected={ salerent === 'Sale' ? true : false } 
                                style={{marginRight: 5, marginBottom: 5}} 
                                onPress={()=> setSalerent('Sale')}>Sale</Chip>
                            </View>
                        </Card.Content>

                        <Divider style={{margin: 10}}/>
                        <Card.Content style={{marginVertical: 15}}>
                            <Title>Property Type</Title>
                            <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
                                <Chip selected={ propertytype === 'Apartment' ? true : false } 
                                style={{marginRight: 5, marginBottom: 5}} 
                                onPress={()=> setPropertytype('Apartment')}>Apartment</Chip>
                                
                                <Chip selected={ propertytype === 'Villa' ? true : false } 
                                style={{marginRight: 5, marginBottom: 5}} 
                                onPress={()=> setPropertytype('Villa')}>Villa</Chip>

                                <Chip selected={ propertytype === 'Office' ? true : false } 
                                style={{marginRight: 5, marginBottom: 5}} 
                                onPress={()=> setPropertytype('Office')}>Office</Chip>

                                <Chip selected={ propertytype === 'Plot' ? true : false } 
                                style={{marginRight: 5, marginBottom: 5}} 
                                onPress={()=> setPropertytype('Plot')}>Plot</Chip>

                                <Chip selected={ propertytype === 'Land' ? true : false } 
                                style={{marginRight: 5, marginBottom: 5}} 
                                onPress={()=> setPropertytype('Land')}>Land</Chip>
                            </View>
                        </Card.Content>

                        <Divider style={{margin: 10}}/>
                        <Card.Content style={{marginVertical: 15}}>
                            <Title>Preferred Area</Title>
                            <MultiSelect
                            style={styles.dropdown}
                            placeholderStyle={styles.placeholderStyle}
                            selectedTextStyle={styles.selectedTextStyle}
                            inputSearchStyle={styles.inputSearchStyle}
                            iconStyle={styles.iconStyle}
                            search
                            data={dubaiareadata}
                            labelField="label"
                            valueField="value"
                            placeholder="Select An Area"
                            searchPlaceholder="Search..."
                            value={multiplearea}
                            onChange={item => {
                                setmultiplearea(item);
                            }}
                            selectedStyle={styles.selectedStyle}
                            />
                        </Card.Content>

                        <Divider style={{margin: 10}}/>
                        <Card.Content style={{marginVertical: 15}}>
                            <Title>No. of Bedrooms</Title>
                            <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
                                <Chip selected={ bedroom === 'Studio' ? true : false } 
                                style={{marginRight: 5, marginBottom: 5}} 
                                onPress={()=> setBedroom('Studio')}>Studio</Chip>

                                <Chip selected={ bedroom === '1 Bedroom' ? true : false } 
                                style={{marginRight: 5, marginBottom: 5}} 
                                onPress={()=> setBedroom('1 Bedroom')}>1 Bedroom</Chip>

                                <Chip selected={ bedroom === '2 Bedrooms' ? true : false } 
                                style={{marginRight: 5, marginBottom: 5}} 
                                onPress={()=> setBedroom('2 Bedrooms')}>2 Bedrooms</Chip>

                                <Chip selected={ bedroom === '3 Bedrooms' ? true : false } 
                                style={{marginRight: 5, marginBottom: 5}} 
                                onPress={()=> setBedroom('3 Bedrooms')}>3 Bedrooms</Chip>

                                <Chip selected={ bedroom === '4 Bedrooms' ? true : false } 
                                style={{marginRight: 5, marginBottom: 5}} 
                                onPress={()=> setBedroom('4 Bedrooms')}>4 Bedrooms</Chip>

                                <Chip selected={ bedroom === '5 Bedrooms' ? true : false } 
                                style={{marginRight: 5, marginBottom: 5}} 
                                onPress={()=> setBedroom('5 Bedrooms')}>5 Bedrooms</Chip>

                                <Chip selected={ bedroom === 'Other' ? true : false } 
                                style={{marginRight: 5, marginBottom: 5}} 
                                onPress={()=> setBedroom('Other')}>Other</Chip>

                            </View>
                        </Card.Content>

                        <Divider style={{margin: 10}}/>
                        <Card.Content style={{marginVertical: 15}}>
                            <Title>Budget</Title>
                            <View style={{flexDirection: 'row', alignContent: 'center'}}>
                                <Slider
                                style={{height: 40, width: windowWidth/1.2}}
                                onValueChange={(value)=> setbudgetrange(value)}
                                minimumValue={0.1}
                                maximumValue={2}
                                minimumTrackTintColor="#d6d6d6"
                                maximumTrackTintColor="#000000"
                                />
                                <Text>{Math.floor(budgetrange*10)*10000}</Text>
                            </View>
                        </Card.Content>

                        <Divider style={{margin: 10}}/>
                        <Card.Content style={{marginVertical: 15}}>
                            <Title>Furnishing</Title>
                            <View style={{flexDirection: 'row'}}>
                                <Chip selected={ furnishing === 'Furnished' ? true : false } 
                                style={{marginRight: 5, marginBottom: 5}} 
                                onPress={()=> setFurnishing('Furnished')}>Furnished</Chip>

                                <Chip selected={ furnishing === 'Un-Furnished' ? true : false } 
                                onPress={()=> setFurnishing('Un-Furnished')}
                                style={{marginRight: 5, marginBottom: 5}}>Un-Furnished</Chip>

                                <Chip selected={ furnishing === 'Any' ? true : false } 
                                onPress={()=> setFurnishing('Any')}
                                style={{marginRight: 5, marginBottom: 5}}>Any</Chip>

                                <Chip selected={ furnishing === 'Other' ? true : false } 
                                onPress={()=> setFurnishing('Other')}
                                style={{marginRight: 5, marginBottom: 5}}>Other</Chip>
                            </View>
                        </Card.Content>
                    </Card>

                    <Card style={styles.cardstyle}>

                        <Card.Title title='Agency'/>

                        <Divider style={{margin: 10}}/>
                        <Card.Content style={{marginVertical: 15}}>
                            <Title>Lead Source</Title>
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
                                placeholder="Select a Lead Source"
                                searchPlaceholder="Search..."
                                value={value}
                                onChange={item1 => {
                                setValue(item1.value);
                                }}
                            />
                        </Card.Content>

                        <Divider style={{margin: 10}}/>
                        <Card.Content style={{marginVertical: 15}}>
                            <Title>Notes</Title>
                            <TextInput
                            style={styles.textinputstyle}
                            type='outlined'
                            placeholder=". . ."
                            onChangeText={(notes) => setnotes(notes)}/>
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
      selectedStyle: {
        borderRadius: 12,
      },
})