import React from 'react';
import { View, TouchableWithoutFeedback } from 'react-native'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { TabBar, Tab, Layout, Text, Input, Icon, Button } from '@ui-kitten/components';


const { Navigator, Screen } = createMaterialTopTabNavigator();
const AlertIcon = (props) => (
    <Icon {...props} name='alert-circle-outline' />
);
const UsersScreen = () => {
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [secureTextEntry, setSecureTextEntry] = React.useState(true);

    const toggleSecureEntry = () => {
        setSecureTextEntry(!secureTextEntry);
    };
    const renderIcon = (props) => (
        <TouchableWithoutFeedback onPress={toggleSecureEntry}>
            <Icon {...props} name={secureTextEntry ? 'eye-off' : 'eye'} />
        </TouchableWithoutFeedback>
    );

    return (
        <Layout style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Input
                label='email'
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
            <Button
                style={{
                    width: 260,
                    marginTop:16
                }}
            >
                Login
             </Button>
        </Layout>)
};

const OrdersScreen = () => {
    const [fullName, setFullName] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [secureTextEntry, setSecureTextEntry] = React.useState(true);

    const toggleSecureEntry = () => {
        setSecureTextEntry(!secureTextEntry);
    };
    const renderIcon = (props) => (
        <TouchableWithoutFeedback onPress={toggleSecureEntry}>
            <Icon {...props} name={secureTextEntry ? 'eye-off' : 'eye'} />
        </TouchableWithoutFeedback>
    );
    return (
        <Layout style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
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
                label='email'
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

            >
                Register
             </Button>

        </Layout>
    )
}




const TopTabBar = ({ navigation, state }) => (

    <TabBar
        selectedIndex={state.index}
        onSelect={index => navigation.navigate(state.routeNames[index])}>
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
        "shadowOpacity": 0.5,
        "shadowRadius": 10,
        marginHorizontal:16,
      

    }}>
        <Navigator tabBar={props => <TopTabBar {...props} />}>
            <Screen name='Users' component={UsersScreen} />
            <Screen name='Orders' component={OrdersScreen} />
        </Navigator>
    </View>
);

export const Login = () => (
    <View style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor:"red",
    }}>
        <TabNavigator />
    </View>
);