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
} from "@ui-kitten/components";
import { FirebaseContext } from "./utils/firebase";
import { useMediaQuery } from "react-responsive";

const { Navigator, Screen } = createDrawerNavigator();

const UsersScreen = () => {
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
      <TopNavigation title="Users" accessoryLeft={(!isBig)&&renderBackAction}
        style={{
            backgroundColor:"#DDD"
        }}
       />
      <Text category="h1">USERS</Text>
    </Layout>
  );
};

const OrdersScreen = () => {
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
    <Layout style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text category="h1">ORDERS</Text>
      <Button onPress={handleLogout}>
        {loading ? "Logging out ..." : " Log out"}
      </Button>
    </Layout>
  );
};

const DrawerContent = ({ navigation, state }) => (
  <Drawer
    selectedIndex={new IndexPath(state.index)}
    onSelect={(index) => navigation.navigate(state.routeNames[index.row])}
    style={
      {
        // width:200
           backgroundColor:"#DDD"
      }
    }
  >
    <DrawerItem title="Users" />
    <DrawerItem title="Orders" />
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
      }}
    >
      <Screen name="Users" component={UsersScreen} />
      <Screen name="Orders" component={OrdersScreen} />
    </Navigator>
  );
};

export const AppNavigator = () => <DrawerNavigator />;

export default AppNavigator;
