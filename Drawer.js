import React, { Component } from "react";
import { useNavigation } from "@react-navigation/native";
import {
  createDrawerNavigator,
  useIsDrawerOpen,
} from "@react-navigation/drawer";
import {
  Drawer,
  DrawerItem,
  Layout,
  Text,
  IndexPath,
  Button,
  TopNavigation,
  TopNavigationAction,
  Icon,
  Divider
} from "@ui-kitten/components";
import { FirebaseContext } from "./utils/firebase";
import { View } from 'react-native'
import { useMediaQuery } from "react-responsive";
import ApplicationHeader from './ApplicationHeader'

const { Navigator, Screen } = createDrawerNavigator();

const ChatsScreen = () => {
  return (
    <Layout
      style={{
        flex: 1,
        // , justifyContent: "center", alignItems: "center"
      }}
    >
      <ApplicationHeader title="Chat"/>
      <Text category="h4">Chats Screen</Text>
    </Layout>
  )
}

const AccountScreen = () => {
  return (
    <Layout
      style={{
        flex: 1,
        // , justifyContent: "center", alignItems: "center"
      }}
    >
      <ApplicationHeader title="Account"/>
      <Text category="h4">Accounts Screen</Text>
    </Layout>
  )
}
const HomeScreen = () => {
  const navigation = useNavigation();
  const isDrawerOpen = useIsDrawerOpen();
  const isBig = useMediaQuery({
    minWidth: 768,
  });
  const BackIcon = (props) => <Icon {...props} name="menu-outline" />;

  const renderBackAction = () => (
    <TopNavigationAction
      icon={BackIcon}
      onPress={() => {
        if (isDrawerOpen) {
        } else {
          navigation.openDrawer();
        }
      }}
    />
  );
  return (
    <Layout
      style={{
        flex: 1,
        // , justifyContent: "center", alignItems: "center"
      }}
    >
      <ApplicationHeader title="Home"/>
      <Text category="h4">Unknown Page</Text>
    </Layout>
  );
};

const LogoutScreen = () => {
  const firebase = React.useContext(FirebaseContext);
  const [loading, setLoading] = React.useState(false);

  const handleLogout = () => {
    setLoading(true);
    firebase
      .auth()
      .signOut()
      .then((res) => {
        setLoading(false);
        console.log("You are successfuly : ", res);
      })
      .catch((error) => {
        setLoading(false);
        console.log("Error found ");
      });
  };
  return (
    <Layout style={{ flex: 1}}>
      <ApplicationHeader title="Logout"/>
      <Text category="h4">Unknown Route</Text>
      <Button onPress={handleLogout}
        style={{
          width:100
        }}
      >
        {loading ? "Logging out ..." : " Log out"}
      </Button>
    </Layout>
  );
};

const Header = (props) => (
  <React.Fragment>
    <View style={{
      backgroundColor: "FCFCFC",
      justifyContent: "center",
      alignContent: "center",
      height: 100
    }}>
      <Text style={{
        textAlign: "center",
        fontSize: 18
      }}>Logo</Text>
    </View>
    <Divider />

  </React.Fragment>
);

const DrawerContent = ({ navigation, state }) => (
  <Drawer
    header={Header}
    selectedIndex={new IndexPath(state.index)}
    onSelect={(index) => navigation.navigate(state.routeNames[index.row])}
    style={
      {
        // width:200
        backgroundColor: "#FCFCFC",
      }
    }
    indicatorStyle={{
      backgroundColor:"red"
    }}
  >
    <DrawerItem title="Home" />
    <DrawerItem title="Chats" />
    <DrawerItem title="Settings" />
    <DrawerItem title="Logout" />
  </Drawer>
);

export const DrawerNavigator = () => {
  const isBig = useMediaQuery({
    minWidth: 768,
  });

  console.log("Is big screen : ", isBig);

  return (
    <Navigator
      drawerType={isBig ? "permanent" : "front"}
      drawerContent={(props) => <DrawerContent {...props} />}
      drawerStyle={{
        width: 240,
        borderRightColor: "#B7BAC8",
        borderRightWidth: 1
      }}
    >
      <Screen name="Home" component={HomeScreen} />
      <Screen name="Chats" component={ChatsScreen} />
      <Screen name="Account" component={AccountScreen} />
      <Screen name="Logout" component={LogoutScreen} />
    </Navigator>
  );
};

export const AppNavigator = () => <DrawerNavigator />;

export default AppNavigator;
