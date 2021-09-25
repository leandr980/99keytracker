import React, { Component } from 'react'
import { View, Text } from 'react-native'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { fetchUser } from '../redux/actions/index'

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

import FeedScreen from './main/Feed'
import AddScreen from './main/Add'
import ProfileScreen from './main/Profile'

const Tab = createBottomTabNavigator();

const EmptyScreen = () => {
	return(null)
}

export class Main extends Component {
	componentDidMount() {
		this.props.fetchUser();
	}
	render() {
		return (
			<Tab.Navigator initialRouteName="Feed">
				<Tab.Screen name='Feed' component={FeedScreen}
					options={{
						tabBarIcon: ({ color, size }) => (
							<MaterialCommunityIcons name="home-circle" color={color} size={26} />
						),
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
				<Tab.Screen name='Profile' component={ProfileScreen}
					options={{
						tabBarIcon: ({ color, size }) => (
							<MaterialCommunityIcons name="account-circle" color={color} size={26} />
						),
					}} />
			</Tab.Navigator>

		)
	}
}

const mapStateToProps = (store) => ({
	currentUser: store.userState.currentUser
})

const mapDispatchToProps = (dispatch) => bindActionCreators({ fetchUser }, dispatch);


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