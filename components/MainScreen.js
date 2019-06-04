import React, { Component } from 'react'
import { Text, View, StyleSheet, AsyncStorage } from "react-native";
import { Button } from 'react-native-elements'
import { getStyles } from './AsyncManager'

export default class Main extends Component {
  static navigationOptions = { header: null }
  constructor(props) {
    super(props)
    this.state = {
      style: {}
    }
  }

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

  render() {
    const { navigate } = this.props.navigation
    const { style } = this.state
    return (
      <View style={styles.container}>
        <View
          style={{
            flex: 2,
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <Text style={styles.title}> School Schedule </Text>
        </View>
        <View
          style={{
            flex: 3,
            flexDirection: "column",
            alignItems: "center"
          }}
        >
          <Button
            buttonStyle={[styles.button, style]}
            title="Schedule"
            onPress={() => navigate("Weekdays")}
          />
          <Button
            buttonStyle={[styles.button, style]}
            title="Create new course"
            onPress={() => navigate("NewTimestamp")}
          />
          <Button
            buttonStyle={[styles.button, style]}
            title="Settings"
            onPress={() => navigate("Setting", {
              _getStylesMain: this._getStyles.bind(this)
            })}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "space-around",
    height: 100
  },
  title: {
    fontSize: 25,
    fontWeight: "bold"
  },
  button: {
    borderRadius: 12,
    width: 300,
    marginBottom: 10
  }
});