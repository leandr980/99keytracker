import React, { Component } from 'react'
import { View, Text } from 'react-native'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { fetchUser } from '../redux/actions/index'

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'

import FeedScreen from './main/Feed'

const Tab = createBottomTabNavigator();

export class Main extends Component {
	componentDidMount() {
		this.props.fetchUser();
	}
	render() {

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

		return (
			<Tab.Navigator>
				<Tab.Navigator name='feed' component={FeedScreen}/>
				</Tab.Navigator>

		)
	}
}

const mapStateToProps = (store) => ({
	currentUser: store.userState.currentUser
})

const mapDispatchToProps = (dispatch) => bindActionCreators({ fetchUser }, dispatch);


export default connect(mapStateToProps, mapDispatchToProps)(Main)