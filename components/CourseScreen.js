import React, { Component } from 'react'
import { View, Text, StyleSheet, FlatList, TouchableWithoutFeedback, Dimensions, Alert } from 'react-native';
import { Header } from 'react-native-elements';
import { filter } from 'lodash'
import { getStyles } from './AsyncManager'
import AsyncStorage from '@react-native-community/async-storage';
import CustomRightHeaderComponent from './headerComponent/CustomRightHeaderComponent';
import moment from 'moment'

export default class CourseScreen extends Component {
    static navigationOptions = { header: null }
    constructor(props) {
        super(props)
        this.state = {
            weekday: '',
            selectedWeekdayCourses: [],
            allCourses: [],
            style: {},
            infoContainerStyle: {}

        }
    }

    /**
    |--------------------------------------------------
    | Calliing function before rendering
    |--------------------------------------------------
    */
    componentWillMount() {
        this.setSortedCourses()
        this._getStyles()
    }

    /**
    |--------------------------------------------------
    | Function will get saved style object from asyncstorage
    | and then will set state
    |--------------------------------------------------
    */
    _getStyles = async () => {
        try {
            await getStyles().then(response => {
                this.setState({
                    style: response,
                    infoContainerStyle: {
                        borderColor: response.backgroundColor
                    }
                })
            })

        } catch (err) {
            console.log('Error: ', err)
        }
    }

    /**
    |--------------------------------------------------
    | Function will set state passed weekday String and course object array.
    | Selected weekday courses will be sorted as starting time order and set to the different state.
    |--------------------------------------------------
    */
    setSortedCourses = () => {
        const { navigation } = this.props
        let data = filter(navigation.getParam('courses'), { 'weekday': navigation.getParam('weekday') })
        data.sort(function (a, b) {
            return new Date(a.startingTime) - new Date(b.startingTime)
        })
        this.setState({
            weekday: navigation.getParam('weekday'),
            selectedWeekdayCourses: data,
            allCourses: navigation.getParam('courses')
        })
    }


    /**
    |--------------------------------------------------
    | Pressed course will alert to the used and ask if user wants to delete selected course
    | if user press yes it will call delete course function and if no it will just alert that action is cancelled
    | @param obj is selected course object with the data
    | @param value is selected course index position of the selectedWeekdayCourses array
    |--------------------------------------------------
    */
    handlePressIn = (obj, value) => {
        Alert.alert(
            'Warning',
            'Do you want delete selected course?',
            [
                { text: 'No', onPress: () => Alert.alert('Action cancelled') },
                { text: 'Yes', onPress: () => this.deleteCourse(obj, value) }
            ],
            { cancelable: false }
        )
    }

    /**
    |--------------------------------------------------
    | Delete course function will remove selected course @param value index 
    | from the selectedWeekdayCourses array list and pass @param obj course object
    | to the _updateDate function
    |--------------------------------------------------
    */
    deleteCourse = (obj, value) => {
        let newList = this.state.selectedWeekdayCourses.filter((course, index) => index !== value)
        this.setState({
            selectedWeekdayCourses: newList
        })
        this._updateData(obj)
    }


    /**
    |--------------------------------------------------
    | _updateData function will update overall course object array list and remove
    | selected @param obj course from the list and saves list to the AsyncStorage.
    | As callback it will call passed retrieveData function to get updated list
    |--------------------------------------------------
    */
    _updateData = async (obj) => {
        const { params } = this.props.navigation.state;

        const updatedList = this.state.allCourses.filter(course => {
            return course.courseName !== obj.courseName && course.weekday === obj.weekday
        })
        try {
            await AsyncStorage.setItem('COURSES', JSON.stringify(updatedList), () => {
                params.retrieveData()
            })
        } catch (err) {
            console.log('Error while setting updated list: ', err)
        }
    }

    render() {
        const { infoContainerStyle, style } = this.state
        return (
            <View style={{ flex: 1 }}>
                <Header
                    centerComponent={{ text: this.state.weekday, style: { fontSize: 25, fontWeight: 'bold', color: 'white', fontStyle: 'italic', paddingBottom: 25 } }}
                    rightComponent={<CustomRightHeaderComponent navigation={this.props.navigation}/>}
                    containerStyle={[styles.headerStyle, style]}
                />
                <View style={{ flex: 1 }}>
                    <FlatList
                        style={{ marginLeft: '10%' }}
                        data={this.state.selectedWeekdayCourses}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item, index }) => (
                            <TouchableWithoutFeedback
                                delayPressIn={300}
                                onPressIn={() => this.handlePressIn(item, index)}>
                                <View style={[styles.courseContainer, infoContainerStyle]}>
                                    <Text style={{ fontSize: 18, textAlign: 'center' }}>{moment(item.startingTime).format("HH:mm")} - {moment(item.endingTime).format("HH:mm")}</Text>
                                    <Text style={{ fontSize: 18, textAlign: 'center' }}>{item.courseName}</Text>
                                    <Text style={{ fontSize: 15, textAlign: 'center' }}>{item.courseId}</Text>
                                    <Text style={{ fontSize: 15, textAlign: 'center' }}>{item.classRoom}</Text>
                                </View>
                            </TouchableWithoutFeedback>
                        )}
                    />
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerStyle: {
        width: "100%",
        height: '10%',
    },
    courseContainer: {
        left: 30,
        width: '75%',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderRadius: 12,
        marginTop: 15,
    }
});