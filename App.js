import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from "react-navigation-stack";
import { createBottomTabNavigator } from "react-navigation-tabs";
import { f, database, auth, storage } from "./config/config.js";


import feed from "./app/screen/feed.js";
import update from "./app/screen/update";
import profile from "./app/screen/profile.js";
import userProfile from "./app/screen/userProfile.js";
import comments from "./app/screen/comments.js";



const TabStack = createBottomTabNavigator(
  {
    Feed : {screen:feed},
    Update : {screen:update},
    Profile : {screen:profile}
  }
)

const MainStack = createStackNavigator(
  {
    Home: { screen: TabStack },
    User: { screen: userProfile },
    Comments: { screen: comments }
  },
  {
    initialRouteName: "Home",
    mode: 'modal',
    headerMode: 'none'
  }
)

const Appcontainer = createAppContainer(MainStack);

export default class App extends React.Component {


  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Appcontainer />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
