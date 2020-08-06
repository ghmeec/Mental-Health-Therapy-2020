import React, { Component, useEffect, useCallback, useState } from "react";
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
  Input,
  Select,
  SelectItem,
  Calendar,
  Datepicker,
  List, ListItem
} from "@ui-kitten/components";
import { FirebaseContext } from "./utils/firebase";
import { View, ScrollView } from "react-native";
import { useMediaQuery } from "react-responsive";
import ApplicationHeader from "./ApplicationHeader";
import {
  GiftedChat,
  Actions,
  SystemMessage,
  Send,
} from "react-native-gifted-chat";
import styles from "./styles";
import { StyleSheet } from "react-native";
import { TouchableWithoutFeedback } from "react-native";
import LoginInformationEdit from './src/components/LoginInformationEdit'
import PersonalInformationEdit from './src/components/PersonalInformationEdit'
import CounselorTitle from './src/components/CounselorTitle'
import {
  gql,
  useQuery,
  useMutation
} from "@apollo/client";

import { useCollection } from '@nandorojo/swr-firestore'

const { Navigator, Screen } = createDrawerNavigator();

const BirthDate = () => {

  const [date, setDate] = React.useState(new Date());

  return (
    <Layout style={styles.container} level='1'>

      <Datepicker
        label='BirthDate'
        placeholder='Pick Date'
        style={styles.inputContainer}
        date={date}
        onSelect={nextDate => setDate(nextDate)}

      />

    </Layout>
  );
};


const GenderMenu = () => {
  const [selectedIndex, setSelectedIndex] = React.useState();
  const [data, setData] = React.useState(['', 'Male', 'Female']);

  return (
    <Layout style={styles.gendercontainer} level="1">
      <Select
        style={styles.inputContainer}
        label="Gender"
        selectedIndex={selectedIndex}
        onSelect={(index) => setSelectedIndex(index)}
        value={data[selectedIndex]}
      >
        <SelectItem title="Male" />
        <SelectItem title="Female" />
      </Select>
    </Layout>
  );
};


const ChatUI = () => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    setMessages([
      {
        _id: 1,
        text: 'hello George, how are you feeling today',
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'Therapist One',
        },
      },
      {
        _id: 2,
        text: 'not so good',
        createdAt: new Date(),
        user: {
          _id: 1,
          name: 'George Millanzi',
        },
      },
      {
        _id: 3,
        text: 'can you tell me why you feeling so if you wont mind',
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'Therapist One',
        },
      }

    ])
  }, [])

  const onSend = useCallback((messages = []) => {
    setMessages(previousMessages => GiftedChat.append(previousMessages, messages))
  }, [])

  return (
    <View style={{
      flex: 1,
      backgroundColor: "#FCFCFC"
    }}>
      <View style={{ paddingVertical: 8, paddingHorizontal: 12, backgroundColor: "#F0F0F0", }}>
        <Text>Active Sessions with {"Therapist One"}</Text>
      </View>
      <GiftedChat
        messages={messages}
        onSend={messages => onSend(messages)}
        user={{
          _id: 1,
        }}
      />
    </View>
  )
}

const ChatsScreen = () => {

  const data = [{
    name: 'Bot One',
  }]
  const renderItem = ({ item, index }) => (
    <ListItem title={`${item.name} ${index + 1}`} />
  );


  return (
    <Layout
      style={{
        flex: 1,
      }}
    >
      <ApplicationHeader title="Counseling" />
      <View style={styles.mainContainer}>
        <View style={styles.chatContainer}>
          <View
            style={{
              flex: 2,
              paddingHorizontal: 12,

            }}
          >
            <ChatUI />
          </View>
          <View
            style={{
              flex: 1,
              backgroundColor: "#FCFCFC",
            }}
          >
            <View style={{}}>
              <View style={{ paddingVertical: 8, paddingHorizontal: 12, backgroundColor: "#F0F0F0", }}>
                <Text>Your Counsellor</Text>
              </View>
              <View style={{
                marginVertical: 12,
                alignContent: "center",
              }}>
                <View style={{
                  height: 100,
                  width: 100,
                  backgroundColor: "#F0F0F0",
                  alignSelf: "center",
                  borderRadius: 100
                }}>

                </View>
                <Text style={{ textAlign: "center", marginTop: 8 }}>Therapist One</Text>
              </View>
              <View>
                <View style={{ marginTop: 12, paddingVertical: 4, paddingHorizontal: 12, }}>
                  <Text style={{ textDecorationLine: "underline" }}>Schedule</Text>
                </View>
                <View style={{ marginTop: 0, paddingVertical: 4, paddingHorizontal: 12 }}>
                  <Text>Monday , 7:00 pm - 8:00 pm</Text>
                  <Text>Wednesday , 1:00 pm - 2:00 pm</Text>
                </View>
              </View>
              <View>
                <View style={{ marginTop: 24, paddingVertical: 8, paddingHorizontal: 12, backgroundColor: "#F0F0F0", }}>
                  <Text>Chatbot Support</Text>
                </View>
                <View style={{
                  paddingVertical: 8, paddingHorizontal: 12
                }}>
                  <Text>In case of Counsellor unavailabity you can just start chatting with our chatbot</Text>
                </View>
                <View style={{
                  paddingVertical: 8, paddingHorizontal: 12,
                  flexDirection: "row",
                }}>
                  <Icon name='robot' pack='material' style={{
                    height: 32, width: 32,
                    color: ""
                  }} />
                  <Text style={{ paddingLeft: 8, height: "100%", paddingTop: 6 }}>Activate Bot</Text>

                </View>
              </View>


            </View>
          </View>
        </View>
      </View>
    </Layout>
  );
};

const LogoutIcon = (props) => <Icon {...props} name="log-out-outline" />;

const ChatIcon = (props) => <Icon {...props} name="message-square-outline" />;
const SettingIcon = (props) => <Icon {...props} name="settings-outline" />;

const HomeIcon = (props) => <Icon {...props} name="home-outline" />;

const AccountScreen = () => {
  const [value, setValue] = React.useState("");
  const [editStatus, setEmailEditStatus] = React.useState(true);

  const toggleEmailEdit = () => {
    setEmailEditStatus(!editStatus);
  };

  const EditIcon = (props) => (
    <TouchableWithoutFeedback onPress={toggleEmailEdit}>
      <Icon
        {...props}
        style={{
          width: 32,
          height: 32,
        }}
        name={"edit-outline"}
      />
    </TouchableWithoutFeedback>
  );
  const renderIcon = (props) => (
    <TouchableWithoutFeedback onPress={toggleEmailEdit}>
      <Icon {...props} name={"edit-outline"} />
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
        <ScrollView style={{ height: "100%" }}>
          <View style={[styles.contentContainer, { backgroundColor: "#E9E9EA" }]}>

            <LoginInformationEdit />
            <PersonalInformationEdit />
            <CounselorTitle />


          </View>
        </ScrollView>
      </View>
    </Layout>
  );
};

const GET_USER = gql`
query GetUser{
  users{
    first_name
    gender
    id
    date_of_birth
  }
}
`
const HomeScreen = () => {
  const firebase = React.useContext(FirebaseContext)
  const navigation = useNavigation();
  const isDrawerOpen = useIsDrawerOpen();
  const isBig = useMediaQuery({
    minWidth: 768,
  });



  const { data, update, error } = useCollection(`users`, {
    where: ['uid', '==', firebase.auth().currentUser.uid],
    limit: 1,
    listen: false
  })

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
  console.log("error : ", error)
  return (
    <Layout
      style={{
        flex: 1,
      }}
    >
      <ApplicationHeader title="Home" />
      <View style={styles.mainContainer}>
        <View style={styles.contentContainer}>
          <View style={{ flex: 1, backgroundColor: "#FCFCFC" }}>
            {error && <Text>{JSON.stringify(error)}</Text>}
            {!data && <Text>Home COntent</Text>}
            {data && <Text>{JSON.stringify(data)}</Text>}
          </View>

        </View>
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
      <Button
        onPress={handleLogout}
        style={{
          width: 100,
        }}
      >
        {loading ? "Logging out ..." : " Log out"}
      </Button>
    </Layout>
  );
};

const Header = (props) => (
  <React.Fragment>
    <View
      style={{
        backgroundColor: "#FCFCFC",
        justifyContent: "center",
        alignContent: "center",
        height: 56,
      }}
    >
      <Text
        style={{
          textAlign: "center",
          backgroundColor: "#FCFCFC",
          fontSize: 18,
        }}
      >
        Logo
      </Text>
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
      <View
        style={{
          // justifyContent: "center",
          // alignContent: "center",
          // paddingTop:16,
          // paddingLeft:10,
          height: 60,
        }}
      >
        {/* <Text style={{
        // textAlign: "center",
        fontSize: 18
      }}>Footer</Text> */}
        <Divider />
        <DrawerItem
          title={loading ? "Logging out..." : "Logout"}
          onPress={handleLogout}
          accessoryLeft={LogoutIcon}
          style={styles.drawerItem}
        />
      </View>
    </React.Fragment>
  );
};

const DrawerContent = ({ navigation, state }) => (
  <Drawer
    header={Header}
    selectedIndex={new IndexPath(state.index)}
    onSelect={(index) => navigation.navigate(state.routeNames[index.row])}
    style={{
      // width:200
      backgroundColor: "#FCFCFC",
    }}
    indicatorStyle={{
      backgroundColor: "red",
    }}
    footer={Footer}
  >
    <DrawerItem
      title="Home"
      accessoryLeft={HomeIcon}
      style={styles.drawerItem}
    />
    <DrawerItem
      title="Counseling"
      accessoryLeft={ChatIcon}
      style={styles.drawerItem}
    />
    <DrawerItem
      title="Account"
      accessoryLeft={SettingIcon}
      style={styles.drawerItem}
    />
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
        borderRightWidth: 0,
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
