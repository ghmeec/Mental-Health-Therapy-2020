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
import { GiftedChat } from 'react-native-gifted-chat'

const { Navigator, Screen } = createDrawerNavigator();
class ChatUI extends React.Component {
  state = {
    messages: [],
  }

  componentDidMount() {
    this.setState({
      messages: [
        {
          _id: 1,
          text: 'Hello developer',
          createdAt: new Date(),
          user: {
            _id: 2,
            name: 'React Native',
            avatar: 'https://placeimg.com/140/140/any',
          },
        },
      ],
    })
  }

  onSend(messages = []) {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }))
  }

  render() {
    return (
      <GiftedChat
        messages={this.state.messages}
        onSend={messages => this.onSend(messages)}
        user={{
          _id: 1,
        }}
      />
    )
  }
}
const ChatsScreen = () => {
  return (
    <Layout
      style={{
        flex: 1,
        // , justifyContent: "center", alignItems: "center"
      }}
    >
      <ApplicationHeader title="Chat" />
      {/* <ChatUI/> */}
      <View>
        <View style={{
          backgroundColor:'red',
          height:100

        }}>
        </View>
        <View style={{
          backgroundColor:'blue',
          height:100
        }}>

        </View>
      </View>
    </Layout>
  )
}

const LogoutIcon = (props) => (
  <Icon {...props} name='log-out-outline'/>
);

const ChatIcon = (props) => (
  <Icon {...props} name='message-square-outline'/>
);
const SettingIcon = (props) => (
  <Icon {...props} name='settings-outline'/>
);

const HomeIcon = (props) => (
  <Icon {...props} name='home-outline'/>
);


const AccountScreen = () => {
  return (
    <Layout
      style={{
        flex: 1,
        // , justifyContent: "center", alignItems: "center"
      }}
    >
      <ApplicationHeader title="Account" />
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
      <ApplicationHeader title="Home" />
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
    <Layout style={{ flex: 1 }}>
      <ApplicationHeader title="Logout" />
      <Text category="h4">Unknown Route</Text>
      <Button onPress={handleLogout}
        style={{
          width: 100
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


const Footer = (props) => {
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
    <React.Fragment>
      <View style={{
        // justifyContent: "center",
        // alignContent: "center",
        // paddingTop:16,
        // paddingLeft:10,
        height: 60
      }}>
        {/* <Text style={{
        // textAlign: "center",
        fontSize: 18
      }}>Footer</Text> */}
        <Divider />
        <DrawerItem title={loading?"Logging out...":"Logout"} onPress={handleLogout}
        
        accessoryLeft={LogoutIcon}
        />
      </View>
    </React.Fragment>
  )
}

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
      backgroundColor: "red"
    }}
    footer={Footer}

  >
    <DrawerItem title="Home" accessoryLeft={HomeIcon} />
    <DrawerItem title="Counseling" accessoryLeft={ChatIcon} />
    <DrawerItem title="Settings" accessoryLeft={SettingIcon} />
    {/* <DrawerItem title="Logout" /> */}
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
        width: 210,
        borderRightColor: "#edf1f7",
        borderRightWidth: 1
      }}
    >
      <Screen name="Home" component={HomeScreen} />
      <Screen name="Chats" component={ChatsScreen} />
      <Screen name="Account" component={AccountScreen} />
      {/* <Screen name="Logout" component={LogoutScreen} /> */}
    </Navigator>
  );
};

export const AppNavigator = () => <DrawerNavigator />;

export default AppNavigator;
