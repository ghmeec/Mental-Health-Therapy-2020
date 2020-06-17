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
  Divider,
  Input
} from "@ui-kitten/components";
import { FirebaseContext } from "./utils/firebase";
import { View } from 'react-native'
import { useMediaQuery } from "react-responsive";
import ApplicationHeader from './ApplicationHeader'
import { GiftedChat, Actions, SystemMessage, Send } from 'react-native-gifted-chat'
import styles from './styles'
import { TouchableWithoutFeedback } from 'react-native';
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
  renderSend(props) {
    return (
      <Send
        {...props}
        containerStyle={{}}
      >
        <View style={{
          marginRight: 10, marginBottom: 5,
          flexDirection: "row",
          justifyContent: 'center',
          alignItems: 'center',
          alignSelf: 'center',
          marginRight: 15,
        }}>
          <Text style={{ fontSize: 14 }} status='primary' category='label'>Send</Text>
          <Icon
            style={styles.icon}
            fill="#3366FF"
            name='paper-plane-outline'
          />

        </View>
      </Send>
    );
  }

  onSend(messages = []) {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }))
  }

  render() {
    return (
      <View style={{
        flex: 1,
        backgroundColor: "#FFFFFF"
      }}>
        <GiftedChat
          messages={this.state.messages}
          onSend={messages => this.onSend(messages)}
          user={{
            _id: 1,
          }}
          renderSend={this.renderSend}
        />
      </View>
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
      <ApplicationHeader title="Counseling" />
      <View style={styles.mainContainer}>
        <View style={styles.chatContainer}>
          <View style={{
            flex: 2,
            paddingHorizontal: 12
          }}>
            <ChatUI />
          </View>
          <View style={{
            flex: 1,
            backgroundColor: 'white',
            paddingHorizontal: 12
          }}>

          </View>
        </View>
      </View>
    </Layout>
  )
}

const LogoutIcon = (props) => (
  <Icon {...props} name='log-out-outline' />
);

const ChatIcon = (props) => (
  <Icon {...props} name='message-square-outline' />
);
const SettingIcon = (props) => (
  <Icon {...props} name='settings-outline' />
);

const HomeIcon = (props) => (
  <Icon {...props} name='home-outline' />
);


const AccountScreen = () => {

  const [value, setValue] = React.useState('');
  const [editStatus, setEmailEditStatus] = React.useState(true);

  const toggleEmailEdit = () => {
    setEmailEditStatus(!editStatus)
  };

  const EditIcon = (props) => (
    <TouchableWithoutFeedback onPress={toggleEmailEdit}>
      <Icon {...props} style={{
        width: 32, height: 32
      }} name={'edit-outline'} />
    </TouchableWithoutFeedback>
  );
  const renderIcon = (props) => (
    <TouchableWithoutFeedback onPress={toggleEmailEdit}>
      <Icon {...props} name={'edit-outline'} />
    </TouchableWithoutFeedback>
  );

  return (
    <Layout
      style={{
        flex: 1,
        // , justifyContent: "center", alignItems: "center"
      }}
    >
      <ApplicationHeader title="Account" />
      <View style={styles.mainContainer}>
        <View style={[styles.contentContainer, { backgroundColor: "#E9E9EA" }]}>

          <View style={{
            backgroundColor: "#FCFCFC",
            paddingHorizontal: 12,
            paddingVertical: 16
          }}>
            <View style={{
              flexDirection: "row",
              maxWidth:500
            }}>
              <Text category='h5' style={{ flex: 9 }}>Login Information</Text>
              <View style={{flex:1,paddingLeft:10,alignItems:"center",justifyContent:"center",alignContent:"center"}}><EditIcon /></View>

            </View>

            <Input
              label="Email"
              disabled={editStatus}
              style={{
                maxWidth:500

              }} ></Input>
            <Input disabled={editStatus} style={{
              maxWidth:500
            }}
              label="Password"
              placeholder="*********"
            >
            </Input>

          </View>

          <View style={{
            backgroundColor: "#FCFCFC",
            paddingHorizontal: 12,
            paddingVertical: 16,
            marginTop:24
          }}>
            <View style={{
              flexDirection: "row",
              maxWidth:500
            }}>
              <Text category='h5' style={{ flex: 9 }}>Personal Information</Text>
              <View style={{flex:1,paddingLeft:10,alignItems:"center",justifyContent:"center",alignContent:"center"}}><EditIcon /></View>

            </View>

            <Input
              label="Email"
              disabled={editStatus}
              style={{
                maxWidth:500

              }} ></Input>
            <Input disabled={editStatus} style={{
              maxWidth:500
            }}
              label="Password"
              placeholder="*********"
            >
            </Input>

          </View>


        </View>
      </View>

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
      <View style={styles.mainContainer}>
        <View style={styles.contentContainer}><Text>Content</Text></View>
      </View>
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
        <DrawerItem title={loading ? "Logging out..." : "Logout"} onPress={handleLogout}

          accessoryLeft={LogoutIcon}
          style={styles.drawerItem}
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
    <DrawerItem title="Home" accessoryLeft={HomeIcon} style={styles.drawerItem} />
    <DrawerItem title="Counseling" accessoryLeft={ChatIcon} style={styles.drawerItem} />
    <DrawerItem title="Account" accessoryLeft={SettingIcon} style={styles.drawerItem} />
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
        borderRightColor: "#FCFCFC",
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
