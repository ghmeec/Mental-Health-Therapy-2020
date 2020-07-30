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
  Input,
  Select,
  SelectItem,
  Calendar,
  Datepicker
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
import LoginInformationEdit from '../../src/components/LoginInformationEdit'
import PersonalInformationEdit from '../../src/components/PersonalInformationEdit'
import CounselorTitle from '../components/CounselorTitle'
import {
  gql,
  useQuery,
  useMutation
} from "@apollo/client";

import * as DocumentPicker from 'expo-document-picker';

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

class ChatUI extends React.Component {
  state = {
    messages: [],
  };

  componentDidMount() {
    this.setState({
      messages: [
        {
          _id: 1,
          text: "Hello developer",
          createdAt: new Date(),
          user: {
            _id: 2,
            name: "React Native",
            avatar: "https://placeimg.com/140/140/any",
          },
        },
      ],
    });
  }
  renderSend(props) {
    return (
      <Send {...props} containerStyle={{}}>
        <View
          style={{
            marginRight: 10,
            marginBottom: 5,
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            alignSelf: "center",
            marginRight: 15,
          }}
        >
          <Text style={{ fontSize: 14 }} status="primary" category="label">
            Send
          </Text>
          <Icon style={styles.icon} fill="#3366FF" name="paper-plane-outline" />
        </View>
      </Send>
    );
  }

  onSend(messages = []) {
    this.setState((previousState) => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }));
  }

  render() {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#FFFFFF",
        }}
      >
        <GiftedChat
          messages={this.state.messages}
          onSend={(messages) => this.onSend(messages)}
          user={{
            _id: 1,
          }}
          renderSend={this.renderSend}
        />
      </View>
    );
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
    <TouchableOpacity onPress={() => {
      console.log("Acquiring the user location")
    }}>
      <Icon {...props} name={"edit-outline"} style={{ width: 28, height: 28 }} />
    </TouchableOpacity>
  </>
);


const CalendarIcon = (props) => (
  <Icon {...props} name='calendar' />
);
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

  const navigation = useNavigation();
  const isDrawerOpen = useIsDrawerOpen();
  const isBig = useMediaQuery({
    minWidth: 768,
  });
  const { loading, error, data } = useQuery(GET_USER);

  const BackIcon = (props) => <Icon {...props} name="menu-outline" />;

  const goToMyApplicationPage = () => {
    navigation.navigate('MyApplication')
  }
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
        // , justifyContent: "center", alignItems: "center"
      }}
    >
      <ApplicationHeader title="Home" />
      <View style={styles.mainContainer}>
        <View style={styles.contentContainer}>
          <View style={[styles.dashBoardContentContainer, { padding: 12 }]}>
            <Text status='warning'>Your Profile Is Not Complete</Text>
            <Text>Hello George, Please complete your profile to start providing therapy service </Text>
            <Text>Tips and How tos Here</Text>
            <Button onPress={goToMyApplicationPage}
              style={{
                marginTop: 8,
                width: 300
              }}
            >
              Go to My Application
            </Button>
          </View>


          <View style={[styles.dashBoardContentContainer, { padding: 12, marginTop: 12 }]}>
            <Text status='danger'>Application Rejected</Text>
            <Text>Hello George, Looks like your application has been rejected </Text>
            <Text>Please review and submit the appropriate information</Text>
            <Button onPress={goToMyApplicationPage}
              style={{
                marginTop: 8,
                width: 300
              }}
            >
              Edit informations
            </Button>
          </View>

          <View style={[styles.dashBoardContentContainer, { padding: 12, marginTop: 12 }]}>
            <Text>Other content here</Text>
          </View>


        </View>
      </View>
    </Layout>
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
          <Text>COunselling content</Text>
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
    copyToCacheDirectory: true
  }

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
            <View style={[styles.dashBoardContentContainer, { padding: 12, marginTop: 12 }]}>
              <Text category='h6'>Personal Details</Text>
              <Input
                // value={value}
                label='First Name'
                placeholder='George'
              // caption='Should contain at least 8 symbols'
              // accessoryRight={renderIcon}
              // captionIcon={AlertIcon}
              // secureTextEntry={secureTextEntry}
              // onChangeText={nextValue => setValue(nextValue)}
              />

              <Input
                // value={value}
                label='Last Name'
                placeholder='Millanzi'
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
                <SelectItem title='Male' />
                <SelectItem title='Female' />
              </Select>

              <Datepicker
                label='Birth Info'
                placeholder='Pick Date'
                date={date}
                onSelect={nextDate => setDate(nextDate)}
                accessoryRight={CalendarIcon}
              />

            </View>


            <View style={[styles.dashBoardContentContainer, { padding: 12, marginTop: 12 }]}>
              <Text category='h6'>Address information</Text>
              <Input
                // value={value}
                label='Email'
                placeholder='georgemillaniz1234@gmail.com'
              // caption='Should contain at least 8 symbols'
              // accessoryRight={renderIcon}
              // captionIcon={AlertIcon}
              // secureTextEntry={secureTextEntry}
              // onChangeText={nextValue => setValue(nextValue)}
              />

              <Input
                // value={value}
                label='Phone'
                placeholder='0733527783'
              // caption='Should contain at least 8 symbols'
              // accessoryRight={renderIcon}
              // captionIcon={AlertIcon}
              // secureTextEntry={secureTextEntry}
              // onChangeText={nextValue => setValue(nextValue)}
              />

              <Input
                // value={value}
                disabled={true}
                label='Geo Location'
                placeholder='2.343424,3.234234423'
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

            <View style={[styles.dashBoardContentContainer, { padding: 12, marginTop: 12 }]}>
              <Text category='h6'>Professional Qualification</Text>

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
                label='Qualificatin Description'
                placeholder='text'
              // caption='Should contain at least 8 symbols'
              // accessoryRight={renderIcon}
              // captionIcon={AlertIcon}
              // secureTextEntry={secureTextEntry}
              // onChangeText={nextValue => setValue(nextValue)}
              />
              
              <Button
              
                onPress={() => {
                  DocumentPicker.getDocumentAsync(options)
                    .then(
                      res => {
                        console.log(" Ther results are here : ")
                      }
                    )
                    .catch(error => {
                      console.log("Error in file upload : ", error)
                    })
                }
                }
                style={{
                  // width: 100,
                  marginTop:12
                }}
              >
                Add support documents
              </Button>



            </View>


            <View style={[styles.dashBoardContentContainer, { padding: 12, marginTop: 12 }]}>
              <Text category='h6'>Working experience</Text>
              <Input
                // value={value}
                label='Experience Description'
                placeholder='Year'
             
              />
              <Select
                label="Experience Review"
              
              >
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
 const NotebookScreen=()=>{
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

 }
 const ReviewScreen=()=>{
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

 }

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
      <Screen name="Notebook" component={NotebookScreen}/>   
      <Screen name="Review" component={ReviewScreen}/> 
    </Navigator>
  );
};

const TherapistMainContainer = () => {
  const [isProfileCOmplete, setIsProfileComplete] = React.useState(true)
  if (isProfileCOmplete) {
    return (
      <DrawerNavigator />
    )

  } else {
    return (
      <View style={[{ flex: 1, justifyContent: "center", alignItems: "center", alignContent: "center" }, styles.contentContainer]}>
        <View style={{ backgroundColor: "white", width: "80%", padding: 12 }}>
          <View style={{ backgroundColor: "red", height: 80 }}>
            <Text style={{ textAlign: "center" }}>Logo Here</Text>
          </View>
          <Text>About to complete the profile</Text>
        </View>
      </View>
    )
  }
};

export default TherapistMainContainer;
