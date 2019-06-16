import React, { Component } from "react";
import { createStackNavigator, createAppContainer } from "react-navigation";
import MainScreen from "./components/MainScreen";
import NewTimestamp from "./components/NewTimestamp";
import WeekdayScreen from "./components/WeekdayScreen";
import CourseScreen from "./components/CourseScreen";
import SettingScreen from "./components/SettingScreen";

const MainNavigator = createStackNavigator({
  Main: { screen: MainScreen },
  NewTimestamp: { screen: NewTimestamp },
  Weekdays: { screen: WeekdayScreen},
  Courses: { screen: CourseScreen},
  Setting: { screen: SettingScreen},
});
const App = createAppContainer(MainNavigator);



export default App;
