import React, { Component, useState, useEffect } from "react";
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
  Card,
  Modal,
} from "@ui-kitten/components";
import { useMediaQuery } from "react-responsive";
import { FirebaseContext } from "../../utils/firebase";
import { View, ScrollView, TouchableOpacity } from "react-native";

import ApplicationHeader from "../../ApplicationHeader";
import {
  GiftedChat,
  Actions,
  SystemMessage,
  Send,
} from "react-native-gifted-chat";
import styles from "../../styles";
import { StyleSheet } from "react-native";
import { TouchableWithoutFeedback } from "react-native";
import LoginInformationEdit from "../../src/components/LoginInformationEdit";
import PersonalInformationEdit from "../../src/components/PersonalInformationEdit";
import CounselorTitle from "../components/CounselorTitle";
import { gql, useQuery, useMutation } from "@apollo/client";

import * as DocumentPicker from "expo-document-picker";
import { useCollection } from "@nandorojo/swr-firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { useDocument } from "@nandorojo/swr-firestore";
// import { FirebaseContext } from "../../utils/firebase";
import { useRecoilState, useRecoilValue } from "recoil";
import useSWR from "swr";

import { messageState } from "../../App";

const { Navigator, Screen } = createDrawerNavigator();

const BirthDate = () => {
  const [date, setDate] = React.useState(new Date());

  return (
    <Layout style={styles.container} level="1">
      <Datepicker
        label="BirthDate"
        placeholder="Pick Date"
        style={styles.inputContainer}
        date={date}
        onSelect={(nextDate) => setDate(nextDate)}
      />
    </Layout>
  );
};

const GenderMenu = () => {
  const [selectedIndex, setSelectedIndex] = React.useState();
  const [data, setData] = React.useState(["", "Male", "Female"]);

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
              backgroundColor: "white",
              paddingHorizontal: 12,
            }}
          ></View>
        </View>
      </View>
    </Layout>
  );
};

const LogoutIcon = (props) => <Icon {...props} name="log-out-outline" />;

const ChatIcon = (props) => <Icon {...props} name="message-square-outline" />;
const SettingIcon = (props) => <Icon {...props} name="settings-outline" />;
const ApplicationIcon = (props) => <Icon {...props} name="book-outline" />;
const NotebookIcon = (props) => <Icon {...props} name="book-open-outline" />;
const ReviewIcon = (props) => <Icon {...props} name="layers-outline" />;
const EditIcon = (props) => (
  <>
    <TouchableOpacity
      onPress={() => {
        console.log("Acquiring the user location");
      }}
    >
      <Icon
        {...props}
        name={"edit-outline"}
        style={{ width: 28, height: 28 }}
      />
    </TouchableOpacity>
  </>
);

const CalendarIcon = (props) => <Icon {...props} name="calendar" />;
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
          <View
            style={[styles.contentContainer, { backgroundColor: "#E9E9EA" }]}
          >
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
  query GetUser {
    users {
      first_name
      gender
      id
      date_of_birth
    }
  }
`;

const PendingPatientQutionares = () => {
  const firebase = React.useContext(FirebaseContext);

  const { data, error } = useCollection(`questionnaire`, {
    where: ["isPatientAssignedToCounsellor", "==", false],
  });

  const [pendingTime, setPendingTime] = React.useState("");
  const [visible, setVisible] = React.useState(false);

  const [currentId, setCurrentId] = React.useState("");
  const [loading, setLoading] = React.useState("");

  //update the data for the patient quetionare

  const { update, set } = useDocument(`questionnaire/${currentId}`, {
    listen: true,
  });

  if (error) return <Text>Error!</Text>;
  if (!data) return <Text>Loading...</Text>;

  const elapsedTime = (time) => {
    "use strict";
    const since = time.toDate();
    const elapsed = (new Date().getTime() - since) / 1000;

    if (elapsed >= 0) {
      const diff = {};

      diff.days = Math.floor(elapsed / 86400);
      diff.hours = Math.floor((elapsed / 3600) % 24);
      diff.minutes = Math.floor((elapsed / 60) % 60);
      diff.seconds = Math.floor(elapsed % 60);

      let message = `Over ${diff.days}d ${diff.hours}h ${diff.minutes}m ${diff.seconds}s.`;
      message = message.replace(/(?:0. )+/, "");
      setPendingTime(message);
      return message;
    } else {
      alert(
        "Elapsed time lesser than 0, i.e. specified datetime is still in the future."
      );
      setPendingTime("");
      return " ";
    }
  };

  const assignTherapistPatient = async (patient) => {
    console.log("Update of this item ", patient);
    setLoading(true);
    await update({
      isPatientAssignedToCounsellor: true,
      councelor:firebase.auth().currentUser.uid
    });
    setLoading(false);
    setVisible(false);
  };

  const PatientPending = ({ data }) => {
    return (
      <Card
        style={{
          maxHeight: 200,
          maxWidth: 300,
          padding: 4,
        }}
      >
        <Text>ID : {data.id}</Text>
        <Text>Requested : {elapsedTime(data.createdAt)} ago</Text>
        <View>
          <TouchableOpacity
            onPress={() => {
              setCurrentId(data.patient);
              setVisible(true);
            }}
          >
            <Text style={{ color: "blue" }}>View Details</Text>
          </TouchableOpacity>

          <Modal
            visible={visible}
            backdropStyle={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
            onBackdropPress={() => setVisible(false)}
          >
            <View style={{ width: 380 }}>
              <Card disabled={true}>
                <Text>Age : {data.questionnaireResults.age}</Text>
                <Text>Chronic Pain : {data.questionnaireResults.chronic}</Text>
                <Text>
                  financial status : {data.questionnaireResults.financial}
                </Text>
                <Text>Gender : {data.questionnaireResults.gender}</Text>
                <Text>
                  Considered to be Religious :{" "}
                  {data.questionnaireResults.religious}
                </Text>
                <Text>
                  Taking Any Medication : {data.questionnaireResults.medication}
                </Text>
                <Text>
                  Prefered Language : {data.questionnaireResults.language}
                </Text>
                <Text>
                  Experiencing Panic Attacks : {data.questionnaireResults.panic}
                </Text>
                <Text>
                  Relationship status : {data.questionnaireResults.relationship}
                </Text>
                <Text>
                  Sleeping habit : {data.questionnaireResults.sleeping}
                </Text>
                <Text>
                  Suicidal thoughts : {data.questionnaireResults.suicide}
                </Text>
                <Text>
                  Had therapy before : {data.questionnaireResults.therapy}
                </Text>

                <Button
                  onPress={() => assignTherapistPatient()}
                  style={{
                    marginVertical: 20,
                  }}
                >
                  Accept Patient
                </Button>
              </Card>
            </View>
          </Modal>
        </View>
      </Card>
    );
  };

  return (
    <View>
      {data.length == 0 && <Text category="h4">No Pending Patient</Text>}

      {data.map((item, index) => (
        <View>
          <Text category="h4" style={{ marginBottom: 12 }}>
            Pending Patients
          </Text>
          <PatientPending data={item} key={index} />
        </View>
      ))}
    </View>
  );
};

const WelcomeUser = () => {
  const firebase = React.useContext(FirebaseContext);
  const userName = firebase.auth().currentUser.displayName;
  return <Text>Welcome {userName}</Text>;
};

const HomeScreen = () => {
  const navigation = useNavigation();
  const isDrawerOpen = useIsDrawerOpen();
  const isBig = useMediaQuery({
    minWidth: 768,
  });
  const { loading, error, data } = useQuery(GET_USER);

  const BackIcon = (props) => <Icon {...props} name="menu-outline" />;

  const goToMyApplicationPage = () => {
    navigation.navigate("MyApplication");
  };
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
  console.log("error : ", error);
  return (
    <Layout
      style={{
        flex: 1,
        // , justifyContent: "center", alignItems: "center"
      }}
    >
      <ApplicationHeader title="Home" />
      <View style={styles.mainContainer}>
        <View style={styles.contentContainer}>
          <ScrollView>
            <View style={[styles.dashBoardContentContainer, { padding: 12 }]}>
              <Text status="warning">Your Profile Is Not Complete</Text>
              <Text>
                Hello George, Please complete your profile to start providing
                therapy service{" "}
              </Text>
              <Text>Tips and How tos Here</Text>
              <Button
                onPress={goToMyApplicationPage}
                style={{
                  marginTop: 8,
                  width: 300,
                }}
              >
                Go to My Application
              </Button>
            </View>

            <View
              style={[
                styles.dashBoardContentContainer,
                { padding: 12, marginTop: 12 },
              ]}
            >
              <Text status="danger">Application Rejected</Text>
              <Text>
                Hello George, Looks like your application has been rejected{" "}
              </Text>
              <Text>Please review and submit the appropriate information</Text>
              <Button
                onPress={goToMyApplicationPage}
                style={{
                  marginTop: 8,
                  width: 300,
                }}
              >
                Edit informations
              </Button>
            </View>

            <View
              style={[
                styles.dashBoardContentContainer,
                { padding: 12, marginTop: 12 },
              ]}
            >
              <WelcomeUser />
              <PendingPatientQutionares />
            </View>
          </ScrollView>
        </View>
      </View>
    </Layout>
  );
};

const ChatUI = () => {
  const [messages, setMessages] = useState([]);
  const firebase = React.useContext(FirebaseContext);
  const [user, loading, error] = useAuthState(firebase.auth());
  const currentUser = user.toJSON();
  const [text, setText] = useRecoilState(messageState);

  console.log("Chat UI user is here : ", user);
  // const [messages, setMessages] = useState([]);
  // const thread = "Room 1";  //this to be picked from somehwer amaizing

  const [threads, setThreads] = useState(null);
  const [thread, setThread] = useState(null);
  // const [loading, setLoading] = useState(true);

  /**
   * Fetch threads from Firestore
   */
  useEffect(() => {
    const unsubscribe = firebase
      .firestore()
      .collection("THREADS")
      // .orderBy('latestMessage.createdAt', 'desc')
      .onSnapshot((querySnapshot) => {
        const threads = querySnapshot.docs.map((documentSnapshot) => {
          return {
            _id: documentSnapshot.id,
            // give defaults
            name: "",
            ...documentSnapshot.data(),
          };
        });

        console.log("Loadging all the threads here ", threads);
        setThreads(threads);
        setThread(threads[0]); //set as demo thread

        if (loading) {
          setLoading(false);
        }
      });

    /**
     * unsubscribe listener
     */
    return () => unsubscribe();
  }, []);

  async function handleSend(messages) {
    const text = messages[0].text;

    firebase
      .firestore()
      .collection("THREADS")
      .doc(thread._id)
      .collection("MESSAGES")
      .add({
        text,
        createdAt: new Date().getTime(),
        user: {
          _id: currentUser.uid,
          email: currentUser.email,
        },
      });

    await firebase
      .firestore()
      .collection("THREADS")
      .doc(thread._id)
      .set(
        {
          latestMessage: {
            text,
            user_id: currentUser.uid,
            createdAt: new Date().getTime(),
          },
        },
        { merge: true }
      );
  }

  useEffect(() => {
    if (threads) {
      const messagesListener = firebase
        .firestore()
        .collection("THREADS")
        .doc(thread._id)
        .collection("MESSAGES")
        .orderBy("createdAt", "desc")
        .onSnapshot((querySnapshot) => {
          const messages = querySnapshot.docs.map((doc) => {
            const firebaseData = doc.data();

            const data = {
              _id: doc.id,
              text: "",
              createdAt: new Date().getTime(),
              ...firebaseData,
            };

            if (!firebaseData.system) {
              data.user = {
                ...firebaseData.user,
                name: firebaseData.user.email,
              };
            }

            return data;
          });
          setText(messages[0]);
          setMessages(messages);
        });

      // Stop listening for updates whenever the component unmounts
      return () => messagesListener();
    }
  }, [thread]);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#FCFCFC",
      }}
    >
      <View
        style={{
          paddingVertical: 8,
          paddingHorizontal: 12,
          backgroundColor: "#F0F0F0",
        }}
      >
        <Text>Active Session with Patient {"Patient One"}</Text>
        {/* <ChatRooms /> */}
      </View>
      <GiftedChat
        messages={messages}
        onSend={handleSend}
        user={{ _id: currentUser.uid }}
        placeholder="Type your message here..."
        alwaysShowSend
        showUserAvatar
        scrollToBottom
        // renderBubble={renderBubble}
        // renderLoading={renderLoading}
        // renderSend={renderSend}
        // scrollToBottomComponent={scrollToBottomComponent}
        // renderSystemMessage={renderSystemMessage}
      />
    </View>
  );
};

const fetcher = (url) => fetch(url).then((res) => res.json());

const TextAnalysis = () => {
  const [text, setText] = useRecoilState(messageState);
  console.log("Recived text is here ", text);
  const { data, error } = useSWR(
    text
      ? text.text == ""
        ? null
        : `https://mental-health-2020.herokuapp.com/predict?msg=${text.text}`
      : null,
    fetcher
  );

  if (error) return <Text>An error has occurred. {JSON.stringify(error)}</Text>;
  if (!data) return <Text>Analysing the last message ...</Text>;

  return (
    <Text>
      The Patient potentially is dealing with{" "}
      <Text style={{ color: "red" }}>{data.sentiment}</Text>
    </Text>
  );
};
const CounsellingScreen = () => {
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
      <ApplicationHeader title="Counselling" />
      <View style={styles.mainContainer}>
        <View style={styles.contentContainer}>
          <View
            style={{
              flex: 1,
              flexDirection: "row",
            }}
          >
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
                paddingHorizontal: 12,
                backgroundColor: "#FFFFFF",
              }}
            >
              <View
                style={{
                  marginHorizontal: -12,
                  paddingVertical: 8,
                  paddingHorizontal: 12,
                  backgroundColor: "#F0F0F0",
                }}
              >
                <Text>Message Analysis Tool</Text>
              </View>
              <TextAnalysis />
            </View>
          </View>
        </View>
      </View>
    </Layout>
  );
};

const MyApplicationScreen = () => {
  const navigation = useNavigation();
  const isDrawerOpen = useIsDrawerOpen();
  const isBig = useMediaQuery({
    minWidth: 768,
  });

  const [date, setDate] = React.useState(new Date());
  const options = {
    type: "*/*",
    copyToCacheDirectory: true,
  };

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
      <ApplicationHeader title="My Application" />
      <View style={styles.mainContainer}>
        <ScrollView style={{ height: "100%" }}>
          <View style={styles.contentContainer}>
            <View
              style={[
                styles.dashBoardContentContainer,
                { padding: 12, marginTop: 12 },
              ]}
            >
              <Text category="h6">Personal Details</Text>
              <Input
                // value={value}
                label="First Name"
                placeholder="George"
                // caption='Should contain at least 8 symbols'
                // accessoryRight={renderIcon}
                // captionIcon={AlertIcon}
                // secureTextEntry={secureTextEntry}
                // onChangeText={nextValue => setValue(nextValue)}
              />

              <Input
                // value={value}
                label="Last Name"
                placeholder="Millanzi"
                // caption='Should contain at least 8 symbols'
                // accessoryRight={renderIcon}
                // captionIcon={AlertIcon}
                // secureTextEntry={secureTextEntry}
                // onChangeText={nextValue => setValue(nextValue)}
              />

              <Select
                // selectedIndex={selectedIndex}
                // onSelect={index => setSelectedIndex(index)}
                label="Gender"
              >
                <SelectItem title="Male" />
                <SelectItem title="Female" />
              </Select>

              <Datepicker
                label="Birth Info"
                placeholder="Pick Date"
                date={date}
                onSelect={(nextDate) => setDate(nextDate)}
                accessoryRight={CalendarIcon}
              />
            </View>

            <View
              style={[
                styles.dashBoardContentContainer,
                { padding: 12, marginTop: 12 },
              ]}
            >
              <Text category="h6">Address information</Text>
              <Input
                // value={value}
                label="Email"
                placeholder="georgemillaniz1234@gmail.com"
                // caption='Should contain at least 8 symbols'
                // accessoryRight={renderIcon}
                // captionIcon={AlertIcon}
                // secureTextEntry={secureTextEntry}
                // onChangeText={nextValue => setValue(nextValue)}
              />

              <Input
                // value={value}
                label="Phone"
                placeholder="0733527783"
                // caption='Should contain at least 8 symbols'
                // accessoryRight={renderIcon}
                // captionIcon={AlertIcon}
                // secureTextEntry={secureTextEntry}
                // onChangeText={nextValue => setValue(nextValue)}
              />

              <Input
                // value={value}
                disabled={true}
                label="Geo Location"
                placeholder="2.343424,3.234234423"
                // caption='Should contain at least 8 symbols'
                accessoryRight={EditIcon}
                // captionIcon={AlertIcon}
                // secureTextEntry={secureTextEntry}
                // onChangeText={nextValue => setValue(nextValue)}
              />

              <Select
                label="Region"
                // selectedIndex={selectedIndex}
                // onSelect={(index) => setSelectedIndex(index)}
                // value={data[selectedIndex]}
              >
                <SelectItem title="Dar Es Salaam" />
                <SelectItem title="Mbeya" />
              </Select>
            </View>

            <View
              style={[
                styles.dashBoardContentContainer,
                { padding: 12, marginTop: 12 },
              ]}
            >
              <Text category="h6">Professional Qualification</Text>

              <Select
                label="Qualification Title"
                // selectedIndex={selectedIndex}
                // onSelect={(index) => setSelectedIndex(index)}
                // value={data[selectedIndex]}
              >
                <SelectItem title="Bsc IN Therapy" />
                <SelectItem title="Masters In Therapy" />
              </Select>

              <Input
                // value={value}
                label="Qualificatin Description"
                placeholder="text"
                // caption='Should contain at least 8 symbols'
                // accessoryRight={renderIcon}
                // captionIcon={AlertIcon}
                // secureTextEntry={secureTextEntry}
                // onChangeText={nextValue => setValue(nextValue)}
              />

              <Button
                onPress={() => {
                  DocumentPicker.getDocumentAsync(options)
                    .then((res) => {
                      console.log(" Ther results are here : ");
                    })
                    .catch((error) => {
                      console.log("Error in file upload : ", error);
                    });
                }}
                style={{
                  // width: 100,
                  marginTop: 12,
                }}
              >
                Add support documents
              </Button>
            </View>

            <View
              style={[
                styles.dashBoardContentContainer,
                { padding: 12, marginTop: 12 },
              ]}
            >
              <Text category="h6">Working experience</Text>
              <Input
                // value={value}
                label="Experience Description"
                placeholder="Year"
              />
              <Select label="Experience Review">
                <SelectItem title="Articles" />
                <SelectItem title="Books" />
              </Select>
            </View>
          </View>
        </ScrollView>
      </View>
    </Layout>
  );
};
const NotebookScreen = () => {
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
      <ApplicationHeader title="Notebook" />
      <View style={styles.mainContainer}>
        <View style={styles.contentContainer}>
          <Text>Take Note Here</Text>
        </View>
      </View>
    </Layout>
  );
};
const ReviewScreen = () => {
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
      <ApplicationHeader title="Review" />
      <View style={styles.mainContainer}>
        <View style={styles.contentContainer}>
          <Text>Take Review Here</Text>
        </View>
      </View>
    </Layout>
  );
};

//  everything is not firebase

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
        e-Therapy Platform
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
          height: 60,
        }}
      >
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
      // paddingTop:30
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
      title="Counselling"
      accessoryLeft={ChatIcon}
      style={styles.drawerItem}
    />

    <DrawerItem
      title="My Application"
      accessoryLeft={ApplicationIcon}
      style={styles.drawerItem}
    />
    <DrawerItem
      title="Notebook"
      accessoryLeft={NotebookIcon}
      style={styles.drawerItem}
    />
    <DrawerItem
      title="Review"
      accessoryLeft={ReviewIcon}
      style={styles.drawerItem}
    />
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
      <Screen name="Counselling" component={CounsellingScreen} />
      <Screen name="MyApplication" component={MyApplicationScreen} />
      <Screen name="Notebook" component={NotebookScreen} />
      <Screen name="Review" component={ReviewScreen} />
    </Navigator>
  );
};

const TherapistMainContainer = () => {
  const [isProfileCOmplete, setIsProfileComplete] = React.useState(true);
  if (isProfileCOmplete) {
    return <DrawerNavigator />;
  } else {
    return (
      <View
        style={[
          {
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            alignContent: "center",
          },
          styles.contentContainer,
        ]}
      >
        <View style={{ backgroundColor: "white", width: "80%", padding: 12 }}>
          <View style={{ backgroundColor: "red", height: 80 }}>
            <Text style={{ textAlign: "center" }}>Logo Here</Text>
          </View>
          <Text>About to complete the profile</Text>
        </View>
      </View>
    );
  }
};

export default TherapistMainContainer;
