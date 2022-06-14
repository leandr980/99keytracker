import React, {useState, useRef} from 'react'
import { View, StyleSheet, ScrollView, ImageBackground, Alert, SafeAreaView, TextInput, Text} from 'react-native'
import { Card, Button, Provider, Chip, Divider, Title, Switch, Caption} from 'react-native-paper'

import {Picker} from '@react-native-picker/picker';
import DropDownPicker from 'react-native-dropdown-picker';
import { Dropdown, MultiSelect} from 'react-native-element-dropdown';
import Slider from '@react-native-community/slider';

import {dubaiareadata, leadsourcedata} from './listofareas.js'

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
    
    const [name, setName] = useState("")
    const [number, setNumber] = useState("")
    const [email, setEmail] = useState("")

    const [salerent, setSalerent] = useState("Rent")
    const [propertystatus, setpropertystatus] = useState('Ready')
    const [propertytype, setPropertytype] = useState('Apartment')
    //const [area, setArea] = useState('')
    const [multiplearea, setmultiplearea] = useState([]);
    const [bedroom, setBedroom] = useState("Studio")
    const [builduparea, setbuilduparea] = useState("")
    const [buildupareatype, setbuildupareatype] = useState("SqFt")
    const [budget, setBudget] = useState("")
    const [minbudget, setMinbudget] = useState("")
    const [maxbudget, setMaxbudget] = useState("")
    const [furnishing, setFurnishing] = useState("Un-Furnished")
    
    const [leadsource, setLeadsource] = useState('Walk-In')
    //const [notes, setnotes] = useState('')
    const [isSwitchOn, setIsSwitchOn] = React.useState(false);
    const onToggleSwitch = () => setIsSwitchOn(!isSwitchOn);

    const date = ''
    
    const status = 'NOT CONTACTED'

    const creation = firebase.firestore.FieldValue.serverTimestamp()
    const creationupdate = creation

    const saveKeyData = () => {

        if (!name.trim() || !number.trim() ) {
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
                    propertystatus,
                    propertytype,
                    multiplearea,
                    bedroom,
                    builduparea,
                    buildupareatype,
                    //budgetrange,
                    budget,
                    minbudget,
                    maxbudget,
                    furnishing,

                    leadsource,

                    status,
                    date,
                    creation,
                    creationupdate
                }).then((function () {
                    props.navigation.pop()
                }))
        }
    }


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
                            keyboardType='numeric'
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
                        <Card.Content>
                            <Caption style={{flexWrap: 'wrap'}}>*Rent, Ready, Apartment, Studio, SqFt, Unfurnished and Walk-In are set as default selections, please change them accordingly</Caption>
                        </Card.Content>

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
                            <Title>Property Status</Title>
                            <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
                                <Chip selected={ propertystatus === 'Ready' ? true : false } 
                                style={{marginRight: 5, marginBottom: 5}} 
                                onPress={()=> setpropertystatus('Ready')}>Ready</Chip>

                                <Chip selected={ propertystatus === 'Off-Plan' ? true : false } 
                                style={{marginRight: 5, marginBottom: 5}} 
                                onPress={()=> setpropertystatus('Off-Plan')}>Off-Plan</Chip>
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
                        <Card.Content>
                            <Title>Build-Up Area</Title>
                            <TextInput
                            style={styles.textinputstyle}
                            placeholder="Build up area. . ."
                            onChangeText={(buildup) => setbuilduparea(buildup)}/>
                            <View style={{flexDirection: 'row'}}>
                                <Chip selected={ buildupareatype === 'SqFt' ? true : false } 
                                style={{marginRight: 5, marginBottom: 5}} 
                                onPress={()=> setbuildupareatype('SqFt')}>SqFt</Chip>

                                <Chip selected={ bedroom === 'SqM' ? true : false } 
                                style={{marginRight: 5, marginBottom: 5}} 
                                onPress={()=> setbuildupareatype('SqM')}>SqM</Chip>
                            </View>
                        </Card.Content>

                        <Divider style={{margin: 10}}/>
                        <Card.Content style={{marginVertical: 15}}>
                            <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                                <Title>Budget</Title>
                                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                    <Caption>Set Min and Max Budget</Caption>
                                    <Switch value={isSwitchOn} onValueChange={onToggleSwitch} />
                                </View>
                            </View>
                            {
                                isSwitchOn ? 
                                <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                                    <TextInput
                                    style={styles.textinputstylebudget}
                                    placeholder="Min Budget. . ."
                                    onChangeText={(minbudget) => setMinbudget(minbudget)}/>

                                    <TextInput
                                    style={styles.textinputstylebudget}
                                    placeholder="Max Budget . . ."
                                    onChangeText={(maxbudget) => setMaxbudget(maxbudget)}/>
                                </View>:
                                <View>
                                    <TextInput
                                    style={styles.textinputstyle}
                                    placeholder="Budget. . ."
                                    onChangeText={(budget) => setBudget(budget)}/>
                                </View>
                                
                            }
                            
                        </Card.Content>

                        <Divider style={{margin: 10}}/>
                        <Card.Content style={{marginVertical: 15}}>
                            <Title>Furnishing</Title>
                            <View style={{flexDirection: 'row'}}>
                                <Chip selected={ furnishing === 'Un-Furnished' ? true : false } 
                                onPress={()=> setFurnishing('Un-Furnished')}
                                style={{marginRight: 5, marginBottom: 5}}>Un-Furnished</Chip>

                                <Chip selected={ furnishing === 'Furnished' ? true : false } 
                                style={{marginRight: 5, marginBottom: 5}} 
                                onPress={()=> setFurnishing('Furnished')}>Furnished</Chip>

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
                            <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
                                <Chip selected={ leadsource === 'Walk-In' ? true : false } 
                                    style={{marginRight: 5, marginBottom: 5}} 
                                    onPress={()=> setLeadsource('Walk-In')}>Walk-In</Chip>

                                <Chip selected={ leadsource === 'Property Finder' ? true : false } 
                                    style={{marginRight: 5, marginBottom: 5}} 
                                    onPress={()=> setLeadsource('Property Finder')}>Properfinder</Chip>

                                <Chip selected={ leadsource === 'Bayut' ? true : false } 
                                    style={{marginRight: 5, marginBottom: 5}} 
                                    onPress={()=> setLeadsource('Bayut')}>Bayut</Chip>

                                <Chip selected={ leadsource === 'Dubizzle' ? true : false } 
                                    style={{marginRight: 5, marginBottom: 5}} 
                                    onPress={()=> setLeadsource('Dubizzle')}>Dubizzle</Chip>

                                <Chip selected={ leadsource === 'Cold Call' ? true : false } 
                                    style={{marginRight: 5, marginBottom: 5}} 
                                    onPress={()=> setLeadsource('Cold Call')}>Cold Call</Chip>

                                <Chip selected={ leadsource === 'Facebook/Instagram' ? true : false } 
                                    style={{marginRight: 5, marginBottom: 5}} 
                                    onPress={()=> setLeadsource('Facebook/Instagram')}>Facebook/Instagram</Chip>

                                <Chip selected={ leadsource === 'Google' ? true : false } 
                                    style={{marginRight: 5, marginBottom: 5}} 
                                    onPress={()=> setLeadsource('Google')}>Google</Chip>

                                <Chip selected={ leadsource === 'Website' ? true : false } 
                                    style={{marginRight: 5, marginBottom: 5}} 
                                    onPress={()=> setLeadsource('Website')}>Website</Chip>

                                <Chip selected={ leadsource === 'Referral' ? true : false } 
                                    style={{marginRight: 5, marginBottom: 5}} 
                                    onPress={()=> setLeadsource('Referral')}>Referral</Chip>
                            </View>
                        </Card.Content>
                    </Card>

                    <View style={{justifyContent: 'center', alignContent: 'center', alignItems: 'center', marginVertical: 20}}>
                        <Button style={{borderRadius: 300}} mode="contained" onPress={() => saveKeyData()}> SAVE </Button>
                    </View>
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
    textinputstylebudget: {
        marginVertical: 20,
        width: windowWidth/2.3,
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
    iconStyle: {
      width: 20,
      height: 20,
    },


    placeholderStyle: {
        fontSize: 16,
    },
    selectedTextStyle: {
        fontSize: 16,
    },
    inputSearchStyle: {
        height: 40,
        fontSize: 16,
    },
    selectedStyle: {
        borderRadius: 12,
    },
})