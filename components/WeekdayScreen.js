import React, { Component } from 'react'
import { StyleSheet, View, Dimensions } from 'react-native';
import { Button, Header } from "react-native-elements";
import AsyncStorage from '@react-native-community/async-storage';
import CustomRightHeaderComponent from './headerComponent/CustomRightHeaderComponent';

export default class WeekdayScreen extends Component {
  static navigationOptions = { header: null }
  constructor(props) {
    super(props)
    this.state = {
      courses: [],
      style: {}
    }
  }

  /**
  |--------------------------------------------------
  | Calling function before rendering
  |--------------------------------------------------
  */
  componentDidMount() {
    this._retrieveData()
  }

  /**
  |--------------------------------------------------
  | Trying to get saved courses object array from asyncStorage
  | and saves data to the state if result is not null.
  | If error occured while fetching data it logs the console.
  | Will also fetching saved styles
  |--------------------------------------------------
  */
  _retrieveData = async () => {
    try {
      await AsyncStorage.multiGet(['COURSES', 'STYLES'], (err, stores) => {
        this.setState({
          courses: JSON.parse(stores[0][1]),
          style: JSON.parse(stores[1][1])
        })
      })
    } catch (err) {
      console.log('Error while fetching data: ', err)
    }
  }

  /**
  |--------------------------------------------------
  | When weekday button pressed, it will pass course array object,
  | weekday as a string and _retriveData funtion
  |--------------------------------------------------
  */
  render() {
    const { courses, style } = this.state
    const { navigate } = this.props.navigation
    return (
      <View style={styles.container}>
        <Header
          centerComponent={{
            text: "Weekday",
            style: {
              fontSize: 25,
              fontWeight: "bold",
              color: "white",
              fontStyle: "italic",
              paddingBottom: 25
            }
          }}
          rightComponent={<CustomRightHeaderComponent navigation={this.props.navigation}/>}
          containerStyle={[styles.header, style]}
        />
        <View style={{ flex: 1, marginTop: "20%" }}>
          <Button
            buttonStyle={[styles.button, style]}
            onPress={() => navigate("Courses", {
              weekday: "monday",
              courses: courses,
              retrieveData: this._retrieveData.bind(this)
            })}
            title="monday"
          />
          <Button
            buttonStyle={[styles.button, style]}
            onPress={() => navigate("Courses", {
              weekday: "tuesday",
              courses: courses,
              retrieveData: this._retrieveData.bind(this)
            })}
            title="tuesday"
          />
          <Button
            buttonStyle={[styles.button, style]}
            onPress={() => navigate("Courses", {
              weekday: "wednesday",
              courses: courses,
              retrieveData: this._retrieveData.bind(this)
            })}
            title="wednesday"
          />
          <Button
            buttonStyle={[styles.button, style]}
            onPress={() => navigate("Courses", {
              weekday: "thursday",
              courses: courses,
              retrieveData: this._retrieveData.bind(this)
            })}
            title="thursday"
          />
          <Button
            buttonStyle={[styles.button, style]}
            onPress={() => navigate("Courses", {
              weekday: "friday",
              courses: courses,
              retrieveData: this._retrieveData.bind(this)
            })}
            title="friday"
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
    justifyContent: "center"
  },
  header: {
    backgroundColor: "black",
    width: Dimensions.get("window").width,
    height: "10%",
    justifyContent: 'space-around'
  },
  button: {
    backgroundColor: "black",
    borderRadius: 12,
    width: 300,
    marginBottom: 10
  }
});