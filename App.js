import "react-native-gesture-handler";
import * as React from "react";
import { Button, View } from "react-native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { NavigationContainer } from "@react-navigation/native";
import {
  ApplicationProvider,
  IconRegistry,
  Layout,
  Text,
} from "@ui-kitten/components";
import { EvaIconsPack } from "@ui-kitten/eva-icons";
import { IndexPath } from '@ui-kitten/components';
// import { mapping, light, dark } from "@eva-design/eva";
import * as eva from "@eva-design/eva";

import { Login } from "./Login";

function HomeScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Button
        onPress={() => navigation.navigate("Notifications")}
        title="notifications"
      />
    </View>
  );
}

function NotificationsScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Button onPress={() => navigation.goBack()} title="home" />
    </View>
  );
}
const MyAccount = ({ navigation }) => {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Button
        //onPress={() => navigation.navigate("Notifications")}
        title="My Account"
      />
    </View>
  );
};
const PersonalInfo = ({ navigation }) => {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Button
        onPress={() => navigation.navigate("Notifications")}
        title="Personal Information"
      />
    </View>
  );
};

const Subscribe = ({ navigation }) => {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Button
        //onPress={() => navigation.navigate("Notifications")}
        title="Subscribe"
      />
    </View>
  );
};
const MyCounselor = ({ navigation }) => {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Button
        //onPress={() => navigation.navigate("Notifications")}
        title="My Counselor"
      />
    </View>
  );
};
const Settings = ({ navigation }) => {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Button
        //onPress={() => navigation.navigate("Notifications")}
        title="Settings"
      />
    </View>
  );
};
const Logout = ({ navigation }) => {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Button
        //onPress={() => navigation.navigate("Notifications")}
        title="Logout"
      />
    </View>
  );
};

const Drawer = createDrawerNavigator();



const AuthenticatedHome = () => {
  return (
    <Drawer.Navigator initialRouteName="Home" drawerType="permanent" >
      <Drawer.Screen name="Home" component={HomeScreen} />
      <Drawer.Screen name="Notifications" component={NotificationsScreen} />
      <Drawer.Screen name="My Account" component={MyAccount} />
      <Drawer.Screen name="Personal Information" component={PersonalInfo} />
      <Drawer.Screen name="Subscribe" component={Subscribe} />
      <Drawer.Screen name="Settings" component={Settings} />
      <Drawer.Screen name="Logout" component={Logout} />
    </Drawer.Navigator>
  );
};

export default function App() {
  const [isAuth, setIsAuth] = React.useState(false);
  return (
    <>
      <IconRegistry icons={EvaIconsPack} />
      <ApplicationProvider {...eva} theme={{ ...eva.light }}>
        <NavigationContainer>
          {!isAuth && <Login></Login>}
          {isAuth && <AuthenticatedHome />}
        </NavigationContainer>
      </ApplicationProvider>
    </>
  );
}
