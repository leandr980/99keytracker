import React, {useState, useRef} from 'react'
import { View, StyleSheet, ScrollView, ImageBackground, Alert, SafeAreaView, FlatList, Text, } from 'react-native'
import { Card, Button, TextInput, Provider, Chip} from 'react-native-paper'
import {Picker} from '@react-native-picker/picker';

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
    const [leadsource, setLeadsource] = useState("")

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
                }).then((function () {
                    props.navigation.pop()
                }))
        }
    }

    const [selectedLanguage, setSelectedLanguage] = useState();
    const [selectedLanguage1, setSelectedLanguage1] = useState();

    const pickerRef = useRef();

function open() {
  pickerRef.current.focus();
}

function close() {
  pickerRef.current.blur();
}

/*
                            <TextInput
                            style={styles.textinputstyle}
                            type='outlined'
                            placeholder="Area/Community . . ."
                            onChangeText={(area) => setArea(area)}
                            />




                            <Card.Content style={{flexDirection: 'row', flexWrap: 'wrap', marginBottom: 10}}>
                            <Chip onPress={()=> setLeadsource('Walk-in')}>Walk-in</Chip>
                            <Chip onPress={()=> setLeadsource('Property Finder')}>Property Finder</Chip>
                            <Chip onPress={()=> setLeadsource('Dubizzle')}>Dubizzle</Chip>
                            <Chip onPress={()=> setLeadsource('Bayut')}>Bayut</Chip>
                            <Chip onPress={()=> setLeadsource('Wbsite')}>Website</Chip>
                            <Chip onPress={()=> setLeadsource('Cold Call')}>Cold Call</Chip>
                            <Chip onPress={()=> setLeadsource('Facebook / Instagram')}>Facebook / Instagram</Chip>
                            <Chip onPress={()=> setLeadsource('Other')}>Other</Chip>
                        </Card.Content>
*/



    return (
        <Provider>
            
            <ImageBackground 
            style={{flex: 1}}
            imageStyle={{resizeMode: 'repeat'}}
            source={require('../../assets/bg-image/99-whatsapp-bg-small.jpg')}>
                <SafeAreaView>
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

                            <Picker
                            style={styles.pickerstyle}
                            mode='dropdown'
                            ref={pickerRef}
                            selectedValue={selectedLanguage}
                            onValueChange={(itemValue, itemIndex) =>
                                setSelectedLanguage(itemValue)
                            }>
                            <Picker.Item label="Pick An Area" value="Pick An Area" />
                            <Picker.Item label="Al Barsha" value="Al Barsha" />
                            <Picker.Item label="Arabian Ranches" value="Arabian Ranches" />
                            <Picker.Item label="Downtown Dubai" value="Downtown Dubai" />
                            <Picker.Item label="Dubai Marina" value="Dubai Marina" />
                            <Picker.Item label="Emirates Hills" value="Emirates Hills" />
                            <Picker.Item label="Jumeirah Village Circle" value="Jumeirah Village Circle" />
                            <Picker.Item label="Jumeirah Lake Towers" value="Jumeirah Lake Towers" />
                            <Picker.Item label="Jumeirah Village Triangle" value="Jumeirah Village Triangle" />
                            <Picker.Item label="Nad Al Sheba" value="Nad Al Sheba" />
                            <Picker.Item label="Other" value="Other" />
                            </Picker>

                            <TextInput
                            style={styles.textinputstyle}
                            type='outlined'
                            placeholder="Budget . . ."
                            onChangeText={(budget) => setBudget(budget)}
                            />
                        </Card.Content>
                    </Card>

                    <View style={{flex: 1, flexDirection: 'row'}}>

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

                    <Card style={styles.cardstyle}>
                        <Card.Title title='Lead Source:'/>
                        <Card.Content>
                        <Picker
                            style={styles.pickerstyle}
                            mode='dropdown'
                            ref={pickerRef}
                            selectedValue={selectedLanguage}
                            onValueChange={(itemValue, itemIndex) =>
                                setSelectedLanguage(itemValue)
                            }>
                            <Picker.Item label="Pick A Lead Source" value="Pick A Lead Source" />
                            <Picker.Item label="Walk-In" value="Walk-In" />
                            <Picker.Item label="Property Finder" value="Property Finder" />
                            <Picker.Item label="Dubizzle" value="Dubizzle" />
                            <Picker.Item label="Bayut" value="Bayut" />
                            <Picker.Item label="Website" value="Website" />
                            <Picker.Item label="Cold Calling" value="Cold Calling" />
                            <Picker.Item label="Facebook / Instagram" value="Facebook / Instagram" />
                            <Picker.Item label="Other" value="Other" />
                            </Picker>
                        </Card.Content>
                    </Card>

                    </View>

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
                        propertytype == 'Other' ?
                        <Card.Content>
                            <TextInput
                            style={styles.textinputstyle}
                            type='outlined'
                            placeholder=". . ."
                            onChangeText={(name) => setOther(name)}/>
                        </Card.Content>:
                        <></>
                        }
                        
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
        borderRadius: 10,
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