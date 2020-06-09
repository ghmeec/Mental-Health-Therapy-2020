import "react-native-gesture-handler";
import React, { useState, useEffect } from "react";
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

import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";

import { Login } from "./Login";

const firebaseConfig = {
  apiKey: "AIzaSyC4oKpL8g6PIMYZQWctzhBleqb0FulFWJg",
  authDomain: "uqsapp.firebaseapp.com",
  databaseURL: "https://uqsapp.firebaseio.com",
  projectId: "uqsapp",
  storageBucket: "uqsapp.appspot.com",
  messagingSenderId: "1092090054069",
  appId: "1:1092090054069:web:4574591bba04c55c6e45fc"
};

firebase.initializeApp(firebaseConfig);

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

const provider = new firebase.auth.GoogleAuthProvider();

export default function App() {
  const [authState, setAuthState] = useState({ status: "loading" });
  const [isAuth, setIsAuth] = React.useState(false);

  useEffect(() => {
    return firebase.auth().onAuthStateChanged(async user => {
      if (user) {
        const token = await user.getIdToken();
        const idTokenResult = await user.getIdTokenResult();
        const hasuraClaim =
          idTokenResult.claims["https://hasura.io/jwt/claims"];

        if (hasuraClaim) {
          setAuthState({ status: "in", user, token });
        } else {
          // Check if refresh is required.
          const metadataRef = firebase
            .database()
            .ref("metadata/" + user.uid + "/refreshTime");

          metadataRef.on("value", async (data) => {
            if(!data.exists) return
            // Force refresh to pick up the latest custom claims changes.
            const token = await user.getIdToken(true);
            setAuthState({ status: "in", user, token });
          });
        }
      } else {
        setAuthState({ status: "out" });
      }
    });
  }, []);

  const signInWithGoogle = async () => {
    try {
      const user=await firebase.auth().signInWithEmailAndPassword("sample@sample.com","samplasdasde")
      console.log("User signed it : ",user)
    } catch (error) {
      console.log("Error happened " ,error);
    }
  };

  const signOut = async () => {
    try {
      setAuthState({ status: "loading" });
      await firebase.auth().signOut();
      setAuthState({ status: "out" });
    } catch (error) {
      console.log(error);
    }
  };


  return (
    <>
      <IconRegistry icons={EvaIconsPack} />
      <ApplicationProvider {...eva} theme={{ ...eva.light }}>
        <NavigationContainer>
          <button onClick={signInWithGoogle}>Sign in with Google</button>
          {!isAuth && <Login onClick={signInWithGoogle}></Login>}
          {isAuth && <AuthenticatedHome />}
        </NavigationContainer>
      </ApplicationProvider>
    </>
  );
}
