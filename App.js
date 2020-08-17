
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

import { Fuego, FuegoProvider, useDocument, useCollection } from '@nandorojo/swr-firestore'

import "firebase/auth";
import "firebase/database"
import { Login } from "./Login";
import AdminNavigator from './src/admin/AdminHome'
import TherapistHome from './src/therapist/TherapistHome'
import { default as theme } from './src/theme/theme.json';
import { MaterialIconsPack } from './MaterialCommunityIcons';

import {
  RecoilRoot,
  atom,
  selector,
  useRecoilState,
  useRecoilValue,
} from 'recoil';


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

  const { data, update, error } = useCollection(`users`, {
    where: ['uid', '==', firebase.auth().currentUser.uid],
    limit: 1,
    listen: true
  })

  console.log("Current user : ", firebase.auth().currentUser.uid)
  // Dr8CObja83fO2cy0xEo6pu7DEC53
  // dj6TcAJGE2OWFSR9YIObDfarqGs2
  // if (error) return <Text>Error!</Text>
  // if (!data) return <Text>Loading...</Text>

  // return <Text>Details: {JSON.stringify(data)}</Text>


  // const { loading, error, data, refetch } = useQuery(FETCH_USER, {
  //   variables: {
  //     id: firebase.auth().currentUser.uid
  //   },
  // });

  if (error) {
    return (
      <Text>Oops something went wrong!</Text>
    )
  }
  if (!data) {
    return (
      <LoadingScreen message="Loading data ...." />
    )
  }
  if (data) {
    console.log("data found : ", data)
    const role = data[0].role
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
  // const [getUser, { loading, data }] = useLazyQuery(FETCH_USER);

  useEffect(() => {
    return firebase.auth().onAuthStateChanged(async user => {
      if (user) {
        const token = await user.getIdToken();
        const idTokenResult = await user.getIdTokenResult();
        // const userFinal = await getUser(user.uid)


        // console.log("User fetched : ", userFinal)
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

const firebaseConfig = {
  apiKey: "AIzaSyC4oKpL8g6PIMYZQWctzhBleqb0FulFWJg",
  authDomain: "uqsapp.firebaseapp.com",
  databaseURL: "https://uqsapp.firebaseio.com",
  projectId: "uqsapp",
  storageBucket: "uqsapp.appspot.com",
  messagingSenderId: "1092090054069",
  appId: "1:1092090054069:web:4574591bba04c55c6e45fc"
};

const fuego = new Fuego(firebaseConfig)


export const messageState = atom({
  key: 'latestMessage', // unique ID (with respect to other atoms/selectors)
  default: '', // default value (aka initial value)
});

export default function App() {


  return (
    <RecoilRoot>
      <FuegoProvider fuego={fuego}>
        <ApolloProvider client={client}>
          <FirebaseProvider>
            <IconRegistry icons={[EvaIconsPack, MaterialIconsPack]} />
            <ApplicationProvider {...eva} theme={{ ...eva.light, ...theme }}>
              <NavigationContainer>
                <Routes />
              </NavigationContainer>
            </ApplicationProvider>
          </FirebaseProvider>
        </ApolloProvider>
      </FuegoProvider>
    </RecoilRoot>

  );
}
