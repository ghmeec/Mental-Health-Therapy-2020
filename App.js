import 'react-native-gesture-handler';
import * as React from 'react';
import { Button, View } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { ApplicationProvider, IconRegistry, Layout, Text } from '@ui-kitten/components';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
// import { mapping, light, dark } from "@eva-design/eva";
import * as eva from '@eva-design/eva';

import {Login} from './Login'

function HomeScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button
        onPress={() => navigation.navigate('Notifications')}
        title="notifications"
      />
    </View>
  );
}

function NotificationsScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button onPress={() => navigation.goBack()} title="home" />
    </View>
  );
}

const Drawer = createDrawerNavigator();

const AuthenticatedHome = () => {
  return (
    <Drawer.Navigator initialRouteName="Home" drawerType="permanent">
      <Drawer.Screen name="Home" component={HomeScreen} />
      <Drawer.Screen name="Notifications" component={NotificationsScreen} />
    </Drawer.Navigator>

  )
}

export default function App() {
  const [isAuth,setIsAuth]=React.useState(false)
  return (
    <>
      <IconRegistry icons={EvaIconsPack} />
      <ApplicationProvider {...eva} theme={{ ...eva.light }}>
        <NavigationContainer>
         {!isAuth &&<Login></Login>}
         {isAuth && <AuthenticatedHome/>}
        </NavigationContainer>
      </ApplicationProvider>
    </>
  );
}