import React, { useState } from 'react';
import { View, TouchableWithoutFeedback, ActivityIndicator } from 'react-native'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { TabBar, Tab, Layout, Text, Input, Icon, Button, Spinner } from '@ui-kitten/components';

import "firebase/auth";
import { useAuthState } from 'react-firebase-hooks/auth';
import { FirebaseContext } from './utils/firebase'

const { Navigator, Screen } = createMaterialTopTabNavigator();
const AlertIcon = (props) => (
    <Icon {...props} name='alert-circle-outline' />
);

const LoadingIndicator = (props) => (
    <ActivityIndicator size={"small"} color="white"></ActivityIndicator>
);
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
            <Text style={{ marginVertical: 10, color: "red",width:260 }}>{errorMessage}</Text>
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
                status={(loginSuccess)&&"success"}
            >
                {loading ? <LoadingIndicator></LoadingIndicator> : loginSuccess?"Redireting...":"Login"}
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


    const toggleSecureEntry = () => {
        setSecureTextEntry(!secureTextEntry);
    };

    const handleSignUp=()=>{
        setErrorMessage("")
        setLoading(true)
        firebase.auth().createUserWithEmailAndPassword(email, password)
        .then(res=>{
            setLoading(false)

            console.log("User registered successfull ",res)
            var user = firebase.auth().currentUser;

            user.updateProfile({
                displayName: fullName,
              }).then(function() {
                // Update successful.
                console.log("Successfully updated user profile")

              }).catch(function(error) {
                  console.log("Failed to update profile")
                // An error happened.
              
            });
            setLoginSuccess(true)
            setErrorMessage("")
        })
        .catch(function(error) {
            console.log("Failed to create the user ",error)
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
        <Layout style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ marginVertical: 10, color: "red",width:260 }}>{errorMessage}</Text>
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
                caption='Should contain at least 8 symbols'
                accessoryRight={renderIcon}
                captionIcon={AlertIcon}
                secureTextEntry={secureTextEntry}
                onChangeText={nextValue => setPassword(nextValue)}
            />
            <Button
                style={{
                    width: 260,
                    marginTop: 16
                }}
                onPress={handleSignUp}
                disabled={loading}
                status={(loginSuccess)&&"success"}
            >
                {loading ? <LoadingIndicator></LoadingIndicator> : loginSuccess?"Redireting...":"Register"}

             </Button>

        </Layout>
    )
}




const TopTabBar = ({ navigation, state }) => (

    <TabBar
        selectedIndex={state.index}
        onSelect={index => navigation.navigate(state.routeNames[index])}
        style={{
            height: 50,
            borderBottomColor: "#DDD",
            borderBottomWidth: 1
        }}
        indicatorStyle={{
            backgroundColor: "white"
        }}
    >
        <Tab title='Login' />
        <Tab title='Register' />
    </TabBar>

);

const TabNavigator = () => (
    <View style={{
        maxWidth: 360,
        height: 400,
        "shadowOffset": {
            "width": 1,
            "height": 1
        },
        "shadowOpacity": 0.25,
        "shadowRadius": 5,
        marginHorizontal: 16,


    }}>
        <Navigator tabBar={props => <TopTabBar {...props} />}>
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
    }}>
        <TabNavigator />
    </View>
);