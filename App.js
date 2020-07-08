
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
import AdminNavigator from './src/admin/AdminHome'
import TherapistHome from './src/therapist/TherapistHome'
import { default as theme } from './src/theme/theme.json';

const LoadingScreen = ({ message }) => {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <ActivityIndicator size={"large"}></ActivityIndicator>
      <Text style={{
        textAlign: "center",
        fontSize: 16,
        marginTop: 12,
        fontWeight: "bold"
      }}>{message}</Text>

    </View>
  )
}

import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  gql,
  useQuery,
  useMutation,
  useLazyQuery
} from "@apollo/client";
import Drawer from './Drawer';


const FETCH_USER = gql`
  query fetchUser($id:String!){
    users(
      where:{
        id:{
          _eq:$id
        }
      }
    ){
      id
      first_name
      last_name
      role
    }
  }
`


const cache = new InMemoryCache();
const client = new ApolloClient({
  uri: "https://ghm-hasura.herokuapp.com/v1/graphql",
  headers: {
    "x-hasura-admin-secret": "@ghmeec2020",
    "content-type": "application/json"
  },
  cache
});

const AuthenticatedHome = () => {
  const firebase = React.useContext(FirebaseContext)
  const { loading, error, data, refetch } = useQuery(FETCH_USER, {
    variables: {
      id: firebase.auth().currentUser.uid
    },
  });
  if (error) {
    return (
      <Text>Error of the user {JSON.stringify(error)}</Text>
    )
  }
  if (loading) {
    return (
      <LoadingScreen message="Loading data ...." />
    )
  }
  if (data) {
    console.log("data found : ", data)
    const role = data.users[0].role
    if (role === "Admin") {
      return <AdminNavigator />
    }
    if (role === "Therapist") {
      return <TherapistHome />
    }

    if (role === "Attendee") {
      return <Drawer />
    }
  }

};


// const provider = new firebase.auth.GoogleAuthProvider();
const Routes = () => {
  const firebase = React.useContext(FirebaseContext)
  // const [user,error,initialising] = useAuthState(firebase.auth());

  const [authState, setAuthState] = useState({ status: "loading" });
  const [getUser, { loading, data }] = useLazyQuery(FETCH_USER);

  useEffect(() => {
    return firebase.auth().onAuthStateChanged(async user => {
      if (user) {
        const token = await user.getIdToken();
        const idTokenResult = await user.getIdTokenResult();
        const userFinal = await getUser(user.uid)


        console.log("User fetched : ", userFinal)
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
            console.log("The current user data ", data)
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
          textAlign: "center",
          fontSize: 16,
          marginTop: 12,
          fontWeight: "bold"
        }}>Initializing the app ...</Text>



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
    <ApolloProvider client={client}>
      <FirebaseProvider>
        <IconRegistry icons={EvaIconsPack} />
        <ApplicationProvider {...eva} theme={{ ...eva.light, ...theme }}>
          <NavigationContainer>
            <Routes />
          </NavigationContainer>
        </ApplicationProvider>
      </FirebaseProvider>
    </ApolloProvider>

  );
}
