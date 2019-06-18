;import React, { Component } from 'react'
import {
  View, Text, StyleSheet, TextInput,
  Picker, Alert, Dimensions, ScrollView
} from 'react-native';
import { Button, Header } from 'react-native-elements';
import DateTimePicker from "react-native-modal-datetime-picker";
import moment from 'moment';
import { getStyles } from './AsyncManager';
import AsyncStorage from '@react-native-community/async-storage';
import CustomRightHeaderComponent from './headerComponent/CustomRightHeaderComponent';
import { validate } from './validation/CourseValidation';

export default class NewTimestamp extends Component {
  static navigationOptions = { header: null }
  constructor(props) {
    super(props)
    this.state = {
      startTime: null,
      endTime: null,
      courseName: null,
      courseId: null,
      classRoom: null,
      weekday: null,
      startTimePicker: false,
      endTimePicker: false,
      style: {},
      customTextInputStyle: {}
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
        this.setState({
          style: response,
          customTextInputStyle: {
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
  | Temporary course object validation.
  | Creates new @param newCourse object and will be checked with imported @function validate
  | if there is any null values on object
  | If not then it will create course object and pass to the _storeData function
  |--------------------------------------------------
  */
  validateNewCourse = () => {
    const newCourse = {
      startingTime: this.state.startTime,
      endingTime: this.state.endTime,
      courseName: this.state.courseName,
      courseId: this.state.courseId,
      classRoom: this.state.classRoom,
      weekday: this.state.weekday
    }

    validate(newCourse, this._storeData, this.alertMessage)
  }

  /**
  |--------------------------------------------------
  | Function will save passed @param data course object
  | to the course object array list and saves to the AsyncStorage.
  |--------------------------------------------------
  */
  _storeData = async (data) => {
    let newList = []
    try {
      await AsyncStorage.getItem('COURSES', (err, result) => {
        if (err) {
          console.log('Error: ', err)
          return
        }

        if (result !== null) {
          newList = JSON.parse(result).slice()
          newList.push(data)
          AsyncStorage.setItem('COURSES', JSON.stringify(newList), () => {
            this.alertMessage('Success!', 'New course has been added to the schedule')
          })
        } else {
          newList.push(data)
          AsyncStorage.setItem('COURSES', JSON.stringify(newList), () => {
            this.alertMessage('Success!', 'New course has been added to the schedule')
          })
        }
      })

    } catch (err) {
      console.log('Error while saving data: ', err)
    }
  }

  /**
  |--------------------------------------------------
  | Alert to the user message with passed @param title string
  | and @param message string
  |--------------------------------------------------
  */
  alertMessage = (title, message) => {
    Alert.alert(
      title,
      message
    )
  }

  /**
  |--------------------------------------------------
  | Open/CLoses time where user can select course starting time
  |--------------------------------------------------
  */
  toggleStartTimePicker = () => {
    this.setState((prevState) => {
      return { startTimePicker: !prevState.startTimePicker }
    })
  }
  /**
  |--------------------------------------------------
  | Open/CLoses time where user can select course ending time
  |--------------------------------------------------
  */
  toggleEndTimePicker = () => {
    this.setState((prevState) => {
      return { endTimePicker: !prevState.endTimePicker }
    })
  }

  /**
  |--------------------------------------------------
  | When user select time it will call handle functions
  | to set selected time state and closes time picker
  | if starting time is after ending time it will throw alert error
  | and if ending time is before starting time it will also throw alert error
  |--------------------------------------------------
  */
  handleStartingTime = startTime => {
    if (startTime < this.state.endTime || this.state.endTime === null) {
      this.setState({ startTime });
      this.toggleStartTimePicker();
    } else {
      this.alertMessage('Error!', 'Course starting time cannot be after ending time')
    }
  }

  handleEndingTime = endTime => {
    if (this.state.startTime < endTime || this.state.startTime === null) {
      this.setState({ endTime })
      this.toggleEndTimePicker();
    } else {
      this.alertMessage('Error!', 'Course ending time cannot be before starting time')
    }
  }



  render() {
    const { customTextInputStyle, style } = this.state
    const startingTime = moment(this.state.startTime).format("HH:mm")
    const endingTime = moment(this.state.endTime).format("HH:mm")

    return (
      <View style={styles.container}>
        <Header
          centerComponent={{
            text: "New course",
            style: {
              fontSize: 25,
              fontWeight: "bold",
              color: "white",
              fontStyle: "italic",
              paddingBottom: 25
            }
          }}
          rightComponent={<CustomRightHeaderComponent navigation={this.props.navigation} />}
          containerStyle={[styles.headerStyle, style]}
        />
        <ScrollView 
          style={{ flex: 1, marginTop: "5%", flexDirection: "column" }}
          contentContainerStyle={{ alignItems: "stretch", justifyContent: "center"}}
          >
            <View style={styles.timeContainer}>
              <Text
                onPress={this.toggleStartTimePicker}
                style={styles.timeText}>
                Start:{" "}{this.state.startTime ? startingTime : " --:-- "}
                <DateTimePicker 
                  isVisible={this.state.startTimePicker}
                  onConfirm={this.handleStartingTime}
                  onCancel={this.toggleStartTimePicker}
                  mode="time"
                />
              </Text>
              <Text 
                onPress={this.toggleEndTimePicker}
                style={styles.timeText}>
                End:{" "}{this.state.endTime ? endingTime : " --:-- "}
                <DateTimePicker 
                  isVisible={this.state.endTimePicker}
                  onConfirm={this.handleEndingTime}
                  onCancel={this.toggleEndTimePicker}
                  mode="time"
                />
              </Text>
            </View>
            <TextInput
              style={[styles.textStyle, customTextInputStyle]}
              placeholder="Course name"
              onChangeText={courseName =>
                this.setState({ courseName })
              }
              value={this.state.courseName}
            />
            <TextInput
              style={[styles.textStyle, customTextInputStyle]}
              placeholder="Course id"
              onChangeText={courseId => this.setState({ courseId })}
              value={this.state.courseId}
            />
            <TextInput
              style={[styles.textStyle, customTextInputStyle]}
              placeholder="Class room"
              onChangeText={classRoom =>
                this.setState({ classRoom })
              }
              value={this.state.classRoom}
            />
            <Picker
              style={{ width: 200, marginLeft: "22.5%" }}
              selectedValue={this.state.weekday}
              onValueChange={(itemValue, itemIndex) =>
                this.setState({ weekday: itemValue })
              }
            >
              <Picker.Item label={"weekday"} value={null} />
              <Picker.Item label={"monday"} value={"monday"} />
              <Picker.Item label={"tuesday"} value={"tuesday"} />
              <Picker.Item label={"wednesday"} value={"wednesday"} />
              <Picker.Item label={"thursday"} value={"thursday"} />
              <Picker.Item label={"friday"} value={"friday"} />
            </Picker>
            <Button
              buttonStyle={[styles.button, style]}
              title="Add new course"
              onPress={this.validateNewCourse}
            />
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },

  headerStyle: {
    backgroundColor: "black",
    width: "100%",
    height: "10%",
  },

  textStyle: {
    width: 200,
    borderWidth: 3,
    textAlign: "center",
    marginBottom: 10,
    borderRadius: 12,
    marginLeft: "17.5%"
  },

  timeContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  },
  timeText: {
    fontSize: 17,
    fontWeight: "500",
    margin: 10,
    color: "black",
    padding: 5
  },

  button: {
    justifyContent: "center",
    alignItems: "center",
    width: 320,
    borderRadius: 12,
    margin: 5,
    marginLeft: '5%'
  }
});