import React, { Component } from 'react'
import { View, Text } from 'react-native'

import firebase from 'firebase'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { fetchUser, fetchUserPosts, fetchKeyInfo } from '../redux/actions/index'

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

import FeedScreen from './main/Feed'
import AddScreen from './main/Add'
import ProfileScreen from './main/Profile'
import SearchScreen from './main/Search'
import KeyScreen from './main/Addkey'

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
			<Tab.Navigator initialRouteName="Feed">

				<Tab.Screen name='Feed' component={FeedScreen}
					options={{
						tabBarIcon: ({ color, size }) => (
							<MaterialCommunityIcons name="home-circle" color={color} size={26} />
						),
						headerShown: false
					}} />

				<Tab.Screen name='Search' component={SearchScreen} navigation={this.props.navigation}
					options={{
						tabBarIcon: ({ color, size }) => (
							<MaterialCommunityIcons name="magnify" color={color} size={26} />
						),
						headerShown: false
					}} />

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

				<Tab.Screen name='Key' component={KeyScreen} 
					options={{
						tabBarIcon: ({ color, size }) => (
							<MaterialCommunityIcons name="magnify" color={color} size={26} />
						),
						headerShown: false
					}} />

				<Tab.Screen name='Profile' component={ProfileScreen} navigation={this.props.navigation}
					listeners={({ navigation }) => ({
						tabPress: event => {
							event.preventDefault();
							navigation.navigate("Profile", {uid: firebase.auth().currentUser.uid})
						}
					})}

					options={{
						tabBarIcon: ({ color, size }) => (
							<MaterialCommunityIcons name="account-circle" color={color} size={26}
							/>
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