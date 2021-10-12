import React, { Component } from 'react'
import { View, Text } from 'react-native'

import firebase from 'firebase'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { fetchUser, fetchUserPosts, fetchKeyInfo, fetchKeyInfoDetails } from '../redux/actions/index'

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { mdiKeyChain } from '@mdi/js'
import FeedScreen from './main/Feed'
import AddScreen from './main/Add'
import KeyScreen from './main/Keylist'
//import SearchScreen from './main/Search'
import AddkeyScreen from './main/Addkey'
import ProfileScreen from './main/Profile'

const Tab = createBottomTabNavigator();

const EmptyScreen = () => {
	return(null)
}

export class Main extends Component {
	componentDidMount() {
		this.props.fetchUser();
		this.props.fetchUserPosts();
		this.props.fetchKeyInfo();
		
	}
	render() {
		return (
			<Tab.Navigator initialRouteName="Key List">

				<Tab.Screen name='Photo' component={EmptyScreen}
					listeners={({ navigation }) => ({
						tabPress: event => {
							event.preventDefault();
							navigation.navigate("Add")
                        }
					})}

					options={{
						tabBarIcon: ({ color, size }) => (
							<MaterialCommunityIcons name="plus-circle" color={color} size={26} />
						),
					}} />

				<Tab.Screen name='Key List' component={KeyScreen} navigation={this.props.navigation}
					listeners={({ navigation }) => ({
						tabPress: event => {
							event.preventDefault();
							navigation.navigate("Key List", {uid: firebase.auth().currentUser.uid})
						}
					})}

					options={{
						tabBarIcon: ({ color, size }) => (
							<MaterialCommunityIcons name="key-variant" color={color} size={26}
							/>
						),
						headerShown: false
					}} />

				<Tab.Screen name='Profile' component={ProfileScreen}
					options={{
						tabBarIcon: ({ color, size }) => (
							<MaterialCommunityIcons name="account-circle" color={color} size={26} />
						),
						headerShown: false
					}} />

			</Tab.Navigator>

		)
	}
}

const mapStateToProps = (store) => ({
	currentUser: store.userState.currentUser
})

const mapDispatchToProps = (dispatch) => bindActionCreators({ fetchUser, fetchUserPosts, fetchKeyInfo }, dispatch);


export default connect(mapStateToProps, mapDispatchToProps)(Main)

/*
const { currentUser } = this.props;

console.log(currentUser)
if (currentUser === undefined) {
	return (
		<View>
		</View>
	)
}
*/