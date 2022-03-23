// JavaScript source code
import React, { useEffect, useState } from 'react'
import { View, Text, FlatList, StyleSheet, ImageBackground, ScrollView } from 'react-native'
import { Card, FAB, Searchbar, IconButton, Paragraph, Divider, Chip, Caption, Button, List } from 'react-native-paper'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { compareAsc, format } from 'date-fns'

import firebase from 'firebase'
require ("firebase/firestore")

import { connect } from 'react-redux'
    
//homepage

function Profile(props) {

    const { currentUser, keyinfo } = props;

    const [searchQuery, setSearchQuery] = React.useState('');
    const onChangeSearch = query => setSearchQuery(query);

    if (currentUser === null) {
        return <View/>
    }

    return (
        <View style={styles.container}>
            <ImageBackground 
            style={{flex: 1}}
            imageStyle={{resizeMode: 'repeat'}}
            source={require('../../assets/bg-image/99-whatsapp-bg-small.jpg')}>

            <Card style={styles.maincardstyle}>
                <View style={styles.containerInfo}>
                    <Searchbar
                        style={{ elevation: 0 }}
                        placeholder="Search"
                        onChangeText={onChangeSearch}
                        value={searchQuery}
                    />

                    <Divider style={{marginBottom: 10}}/>

                    <Caption style={{ fontSize: 20, margin: 5 }}> Welcome {currentUser.name} </Caption>
                </View>
            </Card>

            <Text style={{ fontSize: 30, fontWeight: 'bold', marginLeft: 20, marginBottom: 5 }}> Recent Items </Text>

            <Divider />

            <View style={styles.containerGallery}>
                <FlatList
                    numColumns={1}
                    horizontal={false}
                    data={keyinfo}
                    renderItem={({ item }) => 

                    {
                        switch(item.entrytype){
                            case "LANDLORD" :
                                return( 
                                <Card style={styles.cardstyle}>
                                    <Card.Title
                                    left={() => <MaterialCommunityIcons name="folder-key-outline" size={40} />}
                                    title={item.keyname}
                                    subtitle={item.keylocation}
                                    />
                                    
                                    <Divider style={{ marginBottom: 5 }} />
                                    
                                    <Card style={styles.cardstyle}>
                                        <Card.Title
                                            title={ format(new Date(item.creation.toDate().toString()), 'PP')}
                                            right={()=><Chip style={{
                                                marginTop: 5,
                                                marginRight: 5,
                                                backgroundColor: (`#ffd60a`)
                                            }} icon="information"> {item.entrytype}</Chip>}/>
                                        <Divider />

                                        <Card.Content>
        
                                            <Caption> Name: {item.name} </Caption>
                                            <Caption> Phone Number: {item.number} </Caption>
                                            <Caption> Notes: {item.notes} </Caption>
        
                                        </Card.Content>
        
                                        <List.Section>
                                            <List.Accordion title='View Media'>
                                                <Divider/>

                                                <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap'}}>

                                                    <Card style={{borderRadius: 10, margin: 10, elevation: 5, width: 300}}>
                                                        <Card.Cover source={{ uri: item.imageIDfrontURL}} 
                                                        defaultSource={require('../../assets/99nomedia.jpg')}
                                                        style={{margin: 10, aspectRatio: 4/3, alignSelf: "center",  width: 300}}/>
                                                        <Card.Title title={"Emirates ID Front"}/>
                                                    </Card>
        
                                                    <Card style={{borderRadius: 10, margin: 10, elevation: 5, width: 300}}>
                                                        <Card.Cover source={{ uri: item.imageIDbackURL }}
                                                        defaultSource={require('../../assets/99nomedia.jpg')}
                                                        style={{margin: 10, aspectRatio: 4/3, alignSelf: "center", width: 300}}/>
                                                        <Card.Title title={"Emirates ID Front"}/>
                                                    </Card>

                                                </View>
                                            </List.Accordion>                                    
                                        </List.Section>
                                    </Card>
                        
                                    <Card.Actions style={{ justifyContent: 'center' }}>
                                        <Button onPress={() => props.navigation.navigate("Keyinfo", { keyId: item.id, uid: firebase.auth().currentUser.uid })} >
                                            VIEW HISTORY
                                        </Button>
                                    </Card.Actions>
                                </Card>

                                    
                                )
                            case "COMPANY" :
                                return( 
                                <Card style={styles.cardstyle}>
                                    <Card.Title
                                    left={() => <MaterialCommunityIcons name="folder-key-outline" size={40} />}
                                    title={item.keyname}
                                    subtitle={item.keylocation}
                                    />
                                    
                                    <Divider style={{ marginBottom: 5 }} />
                                    <Card style={styles.cardstyle}>
                                        <Card.Title
                                            title={ format(new Date(item.creation.toDate().toString()), 'PP')}
                                            right={()=><Chip style={{
                                                marginTop: 5,
                                                marginRight: 5,
                                                backgroundColor: (`#fb8500`)
                                            }} icon="information"> {item.entrytype}</Chip>}/>
                                        <Divider />

                                        <Card.Content>
        
                                            <Caption> Company Name: {item.companyname} </Caption>
                                            <Caption> Phone Number: {item.number} </Caption>
                                            <Caption> Supervisor Name: {item.supervisor} </Caption>
                                            <Caption> Notes: {item.notes} </Caption>
        
                                        </Card.Content>
        
                                        <List.Section>
                                            <List.Accordion title='View Media'>
                                                <Divider/>

                                                <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap'}}>

                                                    <Card style={{borderRadius: 10, margin: 10, elevation: 5, width: 300}}>
                                                        <Card.Cover source={{ uri: item.imageIDfrontURL}} 
                                                        defaultSource={require('../../assets/99nomedia.jpg')}
                                                        style={{margin: 10, aspectRatio: 4/3, alignSelf: "center",  width: 300}}/>
                                                        <Card.Title title={"Emirates ID Front"}/>
                                                    </Card>
        
                                                    <Card style={{borderRadius: 10, margin: 10, elevation: 5, width: 300}}>
                                                        <Card.Cover source={{ uri: item.imageIDbackURL }}
                                                        defaultSource={require('../../assets/99nomedia.jpg')}
                                                        style={{margin: 10, aspectRatio: 4/3, alignSelf: "center", width: 300}}/>
                                                        <Card.Title title={"Emirates ID Front"}/>
                                                    </Card>

                                                </View>
                                            </List.Accordion>                                    
                                        </List.Section>
                                    </Card>
                                    <Card.Actions style={{ justifyContent: 'center' }}>
                                        <Button onPress={() => props.navigation.navigate("Keyinfo", { keyId: item.id, uid: firebase.auth().currentUser.uid })} >
                                            VIEW HISTORY
                                        </Button>
                                    </Card.Actions>
                                </Card>
                                )
                            case "AGENT" :
                                return( 
                                <Card style={styles.cardstyle}>
                                    <Card.Title
                                    left={() => <MaterialCommunityIcons name="folder-key-outline" size={40} />}
                                    title={item.keyname}
                                    subtitle={item.keylocation}
                                    />
                                    
                                    <Divider style={{ marginBottom: 5 }} />
                                    <Card style={styles.cardstyle}>
                                        <Card.Title
                                            title={ format(new Date(item.creation.toDate().toString()), 'PP')}
                                            right={()=><Chip style={{
                                                marginTop: 5,
                                                marginRight: 5,
                                                backgroundColor: (`#a2d2ff`)
                                            }} icon="information"> {item.entrytype}</Chip>}/>
                                        <Divider />

                                        <Card.Content>
        
                                            <Caption> Name: {item.name} </Caption>
                                            <Caption> Phone Number: {item.number} </Caption>
                                            <Caption> Real Estate Agency: {item.agency} </Caption>
                                            <Caption> Notes: {item.notes} </Caption>
        
                                        </Card.Content>
        
                                        <List.Section>
                                            <List.Accordion title='View Media'>

                                                <Divider/>
                                                
                                                <ScrollView horizontal style={{flex: 1}}>

                                                    <Card style={{borderRadius: 10, margin: 10, elevation: 5, width: 300}}>
                                                        <Card.Cover source={{ uri: item.imageIDfrontURL}} 
                                                        defaultSource={require('../../assets/99nomedia.jpg')}
                                                        style={{margin: 10, aspectRatio: 4/3, alignSelf: "center",  width: 300}}/>
                                                        <Card.Title title={"Emirates ID Front"}/>
                                                    </Card>
                                                    <Card style={{borderRadius: 10, margin: 10, elevation: 5, width: 300}}>
                                                        <Card.Cover source={{ uri: item.imageIDbackURL }}
                                                        defaultSource={require('../../assets/99nomedia.jpg')}
                                                        style={{margin: 10, aspectRatio: 4/3, alignSelf: "center", width: 300}}/>
                                                        <Card.Title title={"Emirates ID Front"}/>
                                                    </Card>


                                                    <Card style={{borderRadius: 10, margin: 10, elevation: 5, width: 300}}>
                                                        <Card.Cover source={{ uri: item.signatureURL }}
                                                        defaultSource={require('../../assets/99nomedia.jpg')}
                                                        style={{margin: 10, aspectRatio: 4/3, alignSelf: "center", width: 300}}/>
                                                        <Card.Title title={"Signature"}/>
                                                    </Card>

                                                </ScrollView>
                                            </List.Accordion>                                    
                                        </List.Section>
                                    </Card>
                                    <Card.Actions style={{ justifyContent: 'center' }}>
                                        <Button onPress={() => props.navigation.navigate("Keyinfo", { keyId: item.id, uid: firebase.auth().currentUser.uid })} >
                                            VIEW HISTORY
                                        </Button>
                                    </Card.Actions>
                                </Card>
                                )

                            case "NEW ENTRY" :
                                return( 
                                <Card style={styles.cardstyle}>
                                    <Card.Title
                                    left={() => <MaterialCommunityIcons name="folder-key-outline" size={40} />}
                                    title={item.keyname}
                                    subtitle={item.keylocation}
                                    />
                                    
                                    <Divider style={{ marginBottom: 5 }} />

                                    <Card style={styles.cardstyle}>
                                        <Card.Title
                                            title={ format(new Date(item.creation.toDate().toString()), 'PP')}
                                            right={()=><Chip style={{
                                                marginTop: 5,
                                                marginRight: 5,
                                                backgroundColor: (`#8eecf5`)
                                            }} icon="information"> {item.entrytype}</Chip>}/>
        
                                        <Divider />
        
                                        <Card.Content>
        
                                            <Caption> Name: {item.name} </Caption>
                                            <Caption> Company: {item.company} </Caption>
                                            <Caption> Notes: {item.notes} </Caption>
        
                                        </Card.Content>
                                    </Card>

                                    <Card.Actions style={{ justifyContent: 'center' }}>
                                        <Button onPress={() => props.navigation.navigate("Keyinfo", { keyId: item.id, uid: firebase.auth().currentUser.uid })} >
                                            VIEW HISTORY
                                        </Button>
                                    </Card.Actions>
                                </Card>
                                )
                            }
                        }
                    }/>
            </View>

            <FAB
                style={styles.fab}
                theme={{ colors: { accent: 'white' } }}
                color = 'blue'
                large
                icon="key-plus"
                label="NEW KEY"
                onPress={() => props.navigation.navigate('AddKey')}
            />
            </ImageBackground>
        </View>)
        }



const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 30
    },
    containerInfo: {
        margin: 10,
    },
    containerGallery: {
        flex: 1,
        justifyContent: 'center',

    },
    keyliststyle: {
        flex: 1,
        fontSize: 15,
    },

    maincardstyle: {
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
        elevation: 5,
    },

    cardstyle: {
        borderRadius: 10,
        margin: 10,
        elevation: 5
    },
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
    },
})

const mapStateToProps = (store) => ({
    currentUser: store.userState.currentUser,
    posts: store.userState.posts,
    keyinfo: store.userState.keyinfo
})

export default connect(mapStateToProps, null)(Profile)