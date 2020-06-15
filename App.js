import "react-native-gesture-handler";
import '@expo/match-media'
import React, { useState, useEffect } from "react";
import { Button, View, ActivityIndicator } from "react-native";
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

import FirebaseProvider, { FirebaseContext } from './utils/firebase'
import { useAuthState } from 'react-firebase-hooks/auth';
import "firebase/auth";
import "firebase/database"
import { Login } from "./Login";
import Drawer from './Drawer';



function HomeScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Button
        onPress={() => navigation.navigate("Notifications")}
        title="Notifications"
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
  const firebase = React.useContext(FirebaseContext)
  const [loading, setLoading] = React.useState(false)

  const logout = () => {
    enterLoading()
    firebase.auth().signOut()
      .then(res => {
        exitLoading()
      })
      .
      catch(error => {
        console.log("login failed ", error)
        exitLoading()
      })
  };

  const enterLoading = () => {
    setLoading(true)
  };

  const exitLoading = () => {
    setLoading(false)
  }

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Button
        //onPress={() => navigation.navigate("Notifications")}
        title={loading?"Logging out":"Log out"}
        
        onPress={logout}
      />
    </View>
  );
};


const AuthenticatedHome = () => {
  return (
    <Drawer/>
  );
};


// const provider = new firebase.auth.GoogleAuthProvider();
const Routes = () => {
  const firebase = React.useContext(FirebaseContext)
  // const [user,error,initialising] = useAuthState(firebase.auth());

  const [authState, setAuthState] = useState({ status: "loading" });

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
            if (!data.exists) return
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


  if (authState.status === "loading") {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size={"large"}></ActivityIndicator>
        <Text style={{
          textAlign:"center",
          fontSize:16,
          marginTop:12
        }}>Loading data ...</Text>
      </View>
    );
  }
  if (authState.status === "out") {
    return (
      <Login></Login>
    )
  }

  if (authState.status === "in") {
    return (
      <AuthenticatedHome />
    )
  }

}

export default function App() {


  return (
    <FirebaseProvider>
      <IconRegistry icons={EvaIconsPack} />
      <ApplicationProvider {...eva} theme={{ ...eva.light }}>
        <NavigationContainer>
        <Routes/>
        </NavigationContainer>
      </ApplicationProvider>
    </FirebaseProvider>

  );
}
