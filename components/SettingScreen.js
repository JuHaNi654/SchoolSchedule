import React, { Component } from 'react'
import { View, StyleSheet, Dimensions, Text, AsyncStorage, Alert } from 'react-native'
import { Button, Header } from 'react-native-elements'
import Slider from '@react-native-community/slider';
import { getStyles } from './AsyncManager'

export default class SettingScreen extends Component {
    static navigationOptions = { header: null }
    constructor(props) {
        super(props)
        this.state = {
            redColor: 0,
            greenColor: 0,
            blueColor: 0,
            style: {}
        }
    }

    /**
    |--------------------------------------------------
    | Calling functions before rendering
    |--------------------------------------------------
    */
    componentDidMount() {
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
                this.setState({ style: response })
            })

        } catch (err) {
            console.log('Error: ', err)
        }
    }

    /**
    |--------------------------------------------------
    | Will compine values to get rgb color in the style
    | then call @function _saveColor to save selected color values to the AsyncStorage
    |--------------------------------------------------
    */
    setColor = () => {
        const { redColor, greenColor, blueColor } = this.state
        let color = `rgb(${redColor}, ${greenColor}, ${blueColor})`
        const style = {
            backgroundColor: color
        }
        this._saveColor(style)
    }

    /**
    |--------------------------------------------------
    | Function will save @param style object to the AsyncStorage
    | and then alert user, that color has been saved 
    |--------------------------------------------------
    */
    _saveColor = async (style) => {
        const { params } = this.props.navigation.state;
        try {
            await AsyncStorage.setItem('STYLES', JSON.stringify(style), () => {
                this._getStyles()
                params._getStylesMain()
                Alert.alert(
                    'Success!',
                    'Selected style has been saved'
                )
            })
        } catch (err) {
            console.log('Error has occurred while saving settings: ', err)
        }
    }

    /**
    |--------------------------------------------------
    | Function will ask if user wants to reset scheduler data
    | if user press yes button, then @function confirmDelete
    | has been called, otherwise nothing happens
    |--------------------------------------------------
    */
    resetScheduler = () => {
        Alert.alert(
            'Warning!',
            'Are you sure, that you want reset curren school schedule?',
            [
                { text: 'No' },
                { text: 'Yes', onPress: () => this.confirmDelete() }
            ],
            { cancelable: true }
        )
    }

    /**
    |--------------------------------------------------
    | Will clear course object array from AsyncStorage
    |--------------------------------------------------
    */
    confirmDelete = async () => {
        try {
            await AsyncStorage.removeItem('COURSES', () => {
                Alert.alert(
                    'Success!',
                    'Schedule has been cleared'
                )
            })
        } catch (err) {
            console.log('Error has occurred while deleting data: ', err)
        }
    }
    render() {
        return (
            <View style={styles.container}>
                <Header
                    centerComponent={{
                        text: 'Settings',
                        style: {
                            fontSize: 25,
                            fontWeight: 'bold',
                            color: 'white',
                            fontStyle: 'italic',
                            paddingBottom: 25
                        }
                    }}
                    containerStyle={[styles.headerStyle, this.state.style]}
                />
                <View style={{
                    marginTop: "5%",
                    flex: 1,
                    alignItems: 'stretch',
                    justifyContent: 'center'
                }}>
                    <View>
                        <Text style={styles.text}>Red color</Text>
                        <Slider
                            style={{ width: 300, height: 40 }}
                            minimumValue={0}
                            maximumValue={240}
                            minimumTrackTintColor='rgb(255, 0, 0)'
                            maximumTrackTintColor="rgb(0, 0, 0)"
                            onValueChange={redColor => {
                                this.setState({
                                    redColor: Math.round(redColor),

                                })
                            }}
                        />
                    </View>
                    <View>
                        <Text style={styles.text}>Green color</Text>
                        <Slider
                            style={{ width: 300, height: 40 }}
                            minimumValue={0}
                            maximumValue={240}
                            minimumTrackTintColor='rgb(0, 255, 0)'
                            maximumTrackTintColor="rgb(0, 0, 0)"
                            onValueChange={greenColor => {
                                this.setState({
                                    greenColor: Math.round(greenColor),
                                })
                            }}
                        />
                    </View>
                    <View>
                        <Text style={styles.text}>Blue color</Text>
                        <Slider
                            style={{ width: 300, height: 40 }}
                            minimumValue={0}
                            maximumValue={240}
                            minimumTrackTintColor='rgb(0, 0, 255)'
                            maximumTrackTintColor="rgb(0, 0, 0)"
                            onValueChange={blueColor => {
                                this.setState({
                                    blueColor: Math.round(blueColor),
                                })
                            }}
                        />
                    </View>
                    <View style={{ flex: 3, flexDirection: "column", alignItems: "center", marginTop: "10%" }}>
                        <Button
                            buttonStyle={[styles.button, this.state.style]}
                            title="Set color"
                            onPress={this.setColor}
                        />
                        <Button
                            buttonStyle={[styles.button, this.state.style]}
                            title="Reset schedule"
                            onPress={this.resetScheduler}
                        />
                    </View>
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
        width: Dimensions.get('window').width,
        height: '10%',
    },
    text: {
        fontSize: 14,
        textAlign: 'center',
        fontWeight: '500',
        margin: 10,
        color: 'black'
    },
    button: {
        borderRadius: 12,
        width: 300,
        marginBottom: 10,
    }
});