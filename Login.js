import React, { useState } from 'react';
import { View, TouchableWithoutFeedback, ActivityIndicator } from 'react-native'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { TabBar, Tab, Layout, Text, Input, Icon, Button, Spinner, Select, SelectItem } from '@ui-kitten/components';

import "firebase/auth";
import { useAuthState } from 'react-firebase-hooks/auth';
import { FirebaseContext } from './utils/firebase';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import FirebaseProvider from './utils/firebase'
import { EvaIconsPack } from "@ui-kitten/eva-icons";
import {
    ApplicationProvider,
    IconRegistry,
} from "@ui-kitten/components";
import * as eva from "@eva-design/eva";
import Drawer from './Drawer';
import { useMutation, gql } from '@apollo/client'

const { Navigator, Screen } = createMaterialTopTabNavigator();
const AlertIcon = (props) => (
    <Icon {...props} name='alert-circle-outline' />
);

const LoadingIndicator = (props) => (
    <ActivityIndicator size={"small"} color="white"></ActivityIndicator>
);

// to be moved to queries

const ADD_USER = gql`
  mutation insert_single_user(
        $firstName:String!
        ,$lastName:String!,
        $role:String!,
        $id:String!

    ) {
    insert_users(objects: [{
      first_name:$firstName,
      last_name:$lastName,
      id:$id,
      role:$role,
      
    }]) {
               affected_rows
    }
  }
`

const UsersScreen = () => {
    const firebase = React.useContext(FirebaseContext)
    const [user, error] = useAuthState(firebase.auth());

    const [loading, setLoading] = React.useState(false)
    const [loginFailed, setloginFailed] = useState(false)
    const [loginSuccess, setLoginSuccess] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")

    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [secureTextEntry, setSecureTextEntry] = React.useState(true);



    console.log("Loading state : ", loading)


    const login = () => {
        setloginFailed(false)
        setLoginSuccess(false)
        setErrorMessage("")

        enterLoading()
        firebase.auth().signInWithEmailAndPassword(email, password)
            .then(res => {
                exitLoading()
                setloginFailed(false)
                setLoginSuccess(true)

            })
            .
            catch(error => {
                console.log("login failed ", error)
                exitLoading()
                setloginFailed(true)
                setErrorMessage(error.message)
                setLoginSuccess(false)

            })
    };


    const toggleSecureEntry = () => {
        setSecureTextEntry(!secureTextEntry);
    };

    const enterLoading = () => {
        setLoading(true)
    };

    const exitLoading = () => {
        setLoading(false)
    }

    const renderIcon = (props) => (
        <TouchableWithoutFeedback onPress={toggleSecureEntry}>
            <Icon {...props} name={secureTextEntry ? 'eye-off' : 'eye'} />
        </TouchableWithoutFeedback>
    );


    return (
        <Layout style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ marginVertical: 10, color: "red", width: 260 }}>{errorMessage}</Text>
            <Input
                label='Email'
                placeholder='ghmatc@gmail.com'
                style={{
                    width: 260
                }}

                value={email}
                onChangeText={nextValue => setEmail(nextValue)}

            />
            <Input
                value={password}
                label='Password'
                placeholder='*********'
                style={{
                    width: 260
                }}

                caption='Should contain at least 8 symbols'
                accessoryRight={renderIcon}
                captionIcon={AlertIcon}
                secureTextEntry={secureTextEntry}
                onChangeText={nextValue => setPassword(nextValue)}
            />
            <Text>{loading}</Text>
            <Button
                style={{
                    width: 260,
                    marginTop: 16
                }}

                onPress={login}
                disabled={loading}
                status={(loginSuccess) && "success"}
            >
                {loading ? <LoadingIndicator></LoadingIndicator> : loginSuccess ? "Redireting..." : "Login"}
            </Button>

        </Layout>)
};

const OrdersScreen = () => {
    const firebase = React.useContext(FirebaseContext)

    const [fullName, setFullName] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [secureTextEntry, setSecureTextEntry] = React.useState(true);

    const [loading, setLoading] = React.useState(false)
    const [errorMessage, setErrorMessage] = useState("")
    const [loginSuccess, setLoginSuccess] = useState(false)
    const [selectedIndex, setSelectedIndex] = React.useState(0);
    const [logInAsData] = React.useState(['Attendee', 'Therapist'])

    const [addUser] = useMutation(ADD_USER)

    const toggleSecureEntry = () => {
        setSecureTextEntry(!secureTextEntry);
    };

    const handleSignUp = () => {
        setErrorMessage("")
        setLoading(true)
        firebase.auth().createUserWithEmailAndPassword(email, password)
            .then(res => {
                setLoading(false)

                console.log("User registered successfull ", res)
                var user = firebase.auth().currentUser;

                user.updateProfile({
                    displayName: fullName,
                }).then(function () {
                    // Update successful.
                    console.log("Successfully updated user profile")
                    addUser({
                        variables: {
                            firstName: fullName.split(" ")[0],
                            lastName: fullName.split(" ")[1],
                            role: logInAsData[selectedIndex-1],
                            id: "jadhad"
                        }
                    })

                }).catch(function (error) {
                    console.log("Failed to update profile")
                    // An error happened.

                });
                setLoginSuccess(true)
                setErrorMessage("")
            })
            .catch(function (error) {
                console.log("Failed to create the user ", error)
                setLoading(false)
                setLoginSuccess(false)
                setErrorMessage(error.message)
            });
    }
    const renderIcon = (props) => (
        <TouchableWithoutFeedback onPress={toggleSecureEntry}>
            <Icon {...props} name={secureTextEntry ? 'eye-off' : 'eye'} />
        </TouchableWithoutFeedback>
    );
    return (
        <Layout style={{
            flex: 1, justifyContent: 'center', alignItems: 'center',
            backgroundColor: "#FFFFFF",
        }}>
            <Text style={{ marginVertical: 10, color: "red", width: 260 }}>{errorMessage}</Text>
            <Input
                label='Full Name'
                placeholder='Andrew Thomas'
                value={fullName}
                style={{
                    width: 260
                }}


                onChangeText={nextValue => setFullName(nextValue)}
            />
            <Input
                label='Email'
                placeholder='ghmatc@gmail.com'
                style={{
                    width: 260
                }}

                value={email}
                onChangeText={nextValue => setEmail(nextValue)}
            />
            <Input
                value={password}
                style={{
                    width: 260
                }}

                label='Password'
                placeholder='*********'
                // caption='Should contain at least 8 symbols'
                accessoryRight={renderIcon}
                // captionIcon={AlertIcon}
                secureTextEntry={secureTextEntry}
                onChangeText={nextValue => setPassword(nextValue)}
            />

            <Select
                selectedIndex={selectedIndex}
                onSelect={index => setSelectedIndex(index)}
                value={logInAsData[selectedIndex - 1]}
                placeholder="Register as "
                label="Register as :  "
                style={{
                    width: 260
                }}
            >
                <SelectItem title='Attendee' />
                <SelectItem title='Therapist' />
            </Select>

            <Button
                style={{
                    width: 260,
                    marginTop: 16,
                    marginBottom: 20
                }}
                onPress={handleSignUp}
                disabled={loading}
                status={(loginSuccess) && "success"}
            >
                {loading ? <LoadingIndicator></LoadingIndicator> : loginSuccess ? "Redireting..." : "Register"}

            </Button>

        </Layout>
    )
}




const TopTabBar = ({ navigation, state }) => (

    <TabBar
        selectedIndex={state.index}

        onSelect={index => navigation.navigate(state.routeNames[index])}
        style={{
            height: 42,
            borderBottomWidth: 0,
        }}
        indicatorStyle={{
            backgroundColor: "#3366FF",
            height: 1
        }}

    >
        <Tab title='Login' />
        <Tab title='Register' />
    </TabBar>

);

const TabNavigator = () => (
    <View style={{
        maxWidth: 360,
        height: "auto",
        // "shadowOffset": {
        //     "width": 0.0,
        //     "height": 0.5
        // },
        // "shadowOpacity": 0.25,
        // "shadowRadius": 2,
        marginHorizontal: 16,
        paddingVertical: 16


    }}>
        <Navigator tabBar={props => <TopTabBar {...props}

        />}

        >
            <Screen name='Users' component={UsersScreen} />
            <Screen name='Orders' component={OrdersScreen} />
        </Navigator>
    </View>
);

export const Login = ({ }) => (
    <View style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#E9E9EA",
    }}>
        <TabNavigator />
    </View>
);