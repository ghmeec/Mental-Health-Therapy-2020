import React, { useState } from 'react';
import { View, TouchableWithoutFeedback, ActivityIndicator, StyleSheet } from 'react-native'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { TabBar, Tab, Layout, Text, Input, Icon, Button, Spinner, Select, SelectItem } from '@ui-kitten/components';

import "firebase/auth";
import { useAuthState } from 'react-firebase-hooks/auth';
import { FirebaseContext } from './utils/firebase';


import { useCollection } from '@nandorojo/swr-firestore'

const { Navigator, Screen } = createMaterialTopTabNavigator();
const AlertIcon = (props) => (
    <Icon {...props} name='alert-circle-outline' />
);

const LoadingIndicator = (props) => (
    <ActivityIndicator size={"small"} color="white"></ActivityIndicator>
);

// to be moved to queries

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
        <Layout style={{ flex: 1, justifyContent: 'center', alignItems: 'center', }}>
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
                    marginTop: 16,
                    backgroundColor: "#0771EC"
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
    const {add } = useCollection('users', {

    })

    const [fullName, setFullName] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [secureTextEntry, setSecureTextEntry] = React.useState(true);

    const [loading, setLoading] = React.useState(false)
    const [errorMessage, setErrorMessage] = useState("")
    const [loginSuccess, setLoginSuccess] = useState(false)
    const [selectedIndex, setSelectedIndex] = React.useState(0);
    const [logInAsData] = React.useState(['Attendee', 'Therapist'])

    // const [addUser] = useMutation(ADD_USER)

    // console.log("Register users data  : ",data)
    const toggleSecureEntry = () => {
        setSecureTextEntry(!secureTextEntry);
    };

    const handleSignUp = () => {
        setErrorMessage("")
        setLoading(true)
        firebase.auth().createUserWithEmailAndPassword(email, password)
            .then(async (res) => {
                setLoginSuccess(true)
                setErrorMessage("")
                setLoading(false)

                console.log("User registered successfull ", res)
                const user = firebase.auth().currentUser;
                const uid=res.user.uid
               
                try {
                    await user.updateProfile({
                        displayName: fullName,
                    })

                    // setting up user details in collection
                    console.log("User registerd as  ",uid)

                    await add({
                        uid: uid,
                        first_name: fullName.split(" ")[0],
                        last_name: fullName.split(" ")[1],
                        role: logInAsData[selectedIndex - 1]
                        

                    })
                    
                    console.log("Everythong is good")
                    // console.log("User details : ", updatProfile)
                    // console.log("User db details: ", updateUserData)
                }
                catch (e) {
                    console.log("Any exception : ", e)
                }

                // .then(function () {
                //     // Update successful.
                //     console.log("Successfully updated user profile")
                //     addUser({
                //         variables: {
                //             firstName: fullName.split(" ")[0],
                //             lastName: fullName.split(" ")[1],
                //             role: logInAsData[selectedIndex - 1],
                //             id: "jadhad"
                //         }
                //     })

                // }).catch(function (error) {
                //     console.log("Failed to update profile")
                //     // An error happened.

                // });

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
        backgroundColor: "#FBFAFE",
        marginHorizontal: 16,
        // paddingTop: 12,


    }}>
        <View style={{ height: 10, backgroundColor: "#0771EC", opacity: 0.9 }}></View>
        <Navigator tabBar={props => <TopTabBar {...props}

        />}
            tabBarOptions={{
                activeTintColor: "red",
                labelStyle: { fontSize: 12 },
                style: { backgroundColor: "#FBFAFE" },
            }}
        >
            <Screen name='Users' component={UsersScreen} />
            <Screen name='Orders' component={OrdersScreen} />
        </Navigator>
    </View>
);

export const Login = ({ }) => (
    <View style={{ flex: 1, flexDirection: "row-reverse" }}>
        <View style={{
            flex: 1,
            alignContent: "center",
            justifyContent: "center",
            // alignItems:"center",
            backgroundColor: "#FBFAFE",
            paddingHorizontal: 30
        }}>
            <View style={{
                height: 100,
                width: 100,
                backgroundColor: "#00AE0B"
            }}>

            </View>
            <Text style={styles.loginHeroSubtitles} category='s1'>Mental Health e-Therapy Platform</Text>
            <Text style={{ color: "#2E295A", fontWeight: "bold", fontSize: 28, marginVertical: 16 }} category='h4'>Connect. Chat. Resolve. Be happier</Text>
            <Text style={styles.loginHeroSubtitles} category='s1'>Experts who are qualified and understands</Text>
            <Text style={styles.loginHeroSubtitles} category='s1'>Connect to experts to improve your mental wellbeing and learn to manage your mind</Text>
            <Text style={styles.loginHeroSubtitles} category='s1'>You own the counsellor. You can share your private information or totally reamain anonymous</Text>
            <Text style={styles.loginHeroSubtitles} category='s1'>Do not let fester. Start it now</Text>
        </View>
        <View style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#E9E9EA",
            // backgroundColor:"#FFFFFF",
        }}>
            <TabNavigator />
        </View>

    </View>
);

const styles = StyleSheet.create({
    loginHeroSubtitles: {
        fontSize: 16,
        marginVertical: 8,
        color: "#2E295A",
        opacity: 0.7
        // color:"yellow"
    }
})