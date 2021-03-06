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
  Datepicker,
  List,
  ListItem,
} from "@ui-kitten/components";
import { useMediaQuery } from "react-responsive";
import { FirebaseContext } from "../../utils/firebase";
import { View, ScrollView, Dimensions, ActivityIndicator } from "react-native";

import ApplicationHeader from "../../ApplicationHeader";
import {
  GiftedChat,
  Actions,
  SystemMessage,
  Send,
} from "react-native-gifted-chat";
import styles from "../../styles";
import { StyleSheet, TouchableOpacity } from "react-native";
import { TouchableWithoutFeedback } from "react-native";
import LoginInformationEdit from "../../src/components/LoginInformationEdit";
import PersonalInformationEdit from "../../src/components/PersonalInformationEdit";
import CounselorTitle from "../components/CounselorTitle";
import { gql, useQuery, useMutation } from "@apollo/client";
import { BarChart, PieChart } from "react-native-chart-kit";
import {
  Table,
  TableWrapper,
  Row,
  Rows,
  Col,
  Cols,
  Cell,
} from "react-native-table-component";
import { useCollection, useDocument } from "@nandorojo/swr-firestore";
import { createStackNavigator } from "@react-navigation/stack";

const chartConfig = {
  backgroundGradientFrom: "#1E2923",
  backgroundGradientFromOpacity: 1,
  backgroundGradientTo: "#08130D",
  backgroundGradientToOpacity: 1,
  // backgroundColor: "#FFFFFF",
  fillShadowGradient: "#E5E5E5",
  fillShadowGradientOpacity: 1,
  color: (opacity = 1) => `#F3F3F3`,
  strokeWidth: 2, // optional, default 3
  barPercentage: 1,
  useShadowColorFromDataset: false, // optional
};

const screenWidth = 370;

const datas = {
  labels: ["January", "February", "March", "April", "May", "June"],
  datasets: [
    {
      data: [20, 45, 28, 80, 99, 43],
    },
  ],
};

const dataPie = [
  {
    name: "Anxiety",
    population: 21500000,
    color: "rgba(131, 167, 234, 1)",
    legendFontColor: "#7F7F7F",
    legendFontSize: 15,
  },
  {
    name: "Depression",
    population: 2800000,
    color: "#F00",
    legendFontColor: "#7F7F7F",
    legendFontSize: 15,
  },
  {
    name: "Suicide Risk",
    population: 527612,
    color: "red",
    legendFontColor: "#7F7F7F",
    legendFontSize: 15,
  },
  {
    name: "Alcohol",
    population: 8538000,
    color: "#ffffff",
    legendFontColor: "#7F7F7F",
    legendFontSize: 15,
  },
  {
    name: "Stress",
    population: 11920000,
    color: "rgb(0, 0, 255)",
    legendFontColor: "#7F7F7F",
    legendFontSize: 15,
  },
];
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
const TherapistsScreen = () => {
  return (
    <Layout
      style={{
        flex: 1,
        // , justifyContent: "center", alignItems: "center"
      }}
    >
      <ApplicationHeader title="Therapists" />
      <View style={styles.mainContainer}>
        <View style={styles.chatContainer}>
          <Therapists />
        </View>
      </View>
    </Layout>
  );
};

const TherapistDetails = ({ route }) => {
  const navigation = useNavigation();
  const BackIcon = (props) => <Icon {...props} name="arrow-back" />;
  let { therapist } = route.params;

  // therapist=JSON.parse(therapist)

  const state = {
    tableHead: ["Info", " Value"],
  };

  const [therapist2, setTherapist2] = React.useState(JSON.parse(therapist));
  const [comment, setComment] = React.useState("");
  const {
    data: therapistOnlineData,
    update,
    set,
  } = useDocument(`therapist/${therapist2.id}`, { listen: true });

  console.log("therapists details ", therapist2);
  const BackAction = () => (
    <TopNavigationAction
      icon={BackIcon}
      onPress={() => {
        navigation.navigate("Therapist");
      }}
    />
  );

  const approve = () => {
    update({
      isVerified: true,
      message:comment
    });
    alert("The councellor is approved")
  };

  const disapprove = () => {
    update({
      isVerified: false,
      message:comment
    });
    alert("The councellor is diaspproved")
  };

  return (
    <Layout
      style={{
        flex: 1,
        // , justifyContent: "center", alignItems: "center"
      }}
    >
      <ApplicationHeader accessoryLeft={BackAction} title="Therapist Details" />
      <View style={styles.mainContainer}>
        <View style={styles.chatContainer}>
          <View
            style={{
              flex: 1,
              padding: 16,
              paddingTop: 30,
              backgroundColor: "#fff",
            }}
          >
            <Table borderStyle={{ borderColor: "transparent" }}>
              <Row
                data={state.tableHead}
                style={styless.head}
                textStyle={styless.text}
              />

              <TableWrapper
                // key={index}
                style={[
                  styless.row,
                  // index % 2 && { backgroundColor: "#F7F6E7" },
                ]}
              >
                <Cell data={"Name"} textStyle={styless.text} />
                <Cell
                  data={
                    therapist2.application.firstName +
                    " " +
                    therapist2.application.lastName
                  }
                  textStyle={styless.text}
                />
              </TableWrapper>

              <TableWrapper
                // key={index}
                style={[
                  styless.row,
                  // index % 2 && { backgroundColor: "#F7F6E7" },
                ]}
              >
                <Cell data={"Gender"} textStyle={styless.text} />
                <Cell
                  data={therapist2.application.gender}
                  textStyle={styless.text}
                />
              </TableWrapper>

              <TableWrapper
                // key={index}
                style={[
                  styless.row,
                  // index % 2 && { backgroundColor: "#F7F6E7" },
                ]}
              >
                <Cell data={"Email"} textStyle={styless.text} />
                <Cell
                  data={therapist2.application.email}
                  textStyle={styless.text}
                />
              </TableWrapper>

              <TableWrapper
                // key={index}
                style={[
                  styless.row,
                  // index % 2 && { backgroundColor: "#F7F6E7" },
                ]}
              >
                <Cell data={"Phone"} textStyle={styless.text} />
                <Cell
                  data={therapist2.application.phone}
                  textStyle={styless.text}
                />
              </TableWrapper>

              <TableWrapper
                // key={index}
                style={[
                  styless.row,
                  // index % 2 && { backgroundColor: "#F7F6E7" },
                ]}
              >
                <Cell data={"Qualification"} textStyle={styless.text} />
                <Cell
                  data={therapist2.application.qualificationTitle}
                  textStyle={styless.text}
                />
              </TableWrapper>

              <TableWrapper
                // key={index}
                style={[
                  styless.row,
                  // index % 2 && { backgroundColor: "#F7F6E7" },
                ]}
              >
                <Cell data={"Qualification title"} textStyle={styless.text} />
                <Cell
                  data={therapist2.application.qualificationTitle}
                  textStyle={styless.text}
                />
              </TableWrapper>
              <TableWrapper
                // key={index}
                style={[
                  styless.row,
                  // index % 2 && { backgroundColor: "#F7F6E7" },
                ]}
              >
                <Cell data={"Support Document"} textStyle={styless.text} />
                <Cell data={""} textStyle={styless.text} />
              </TableWrapper>

              <TableWrapper
                // key={index}
                style={[
                  styless.row,
                  // index % 2 && { backgroundColor: "#F7F6E7" },
                ]}
              >
                <Cell data={"Status"} textStyle={styless.text} />
                <Cell data={therapist2.isVerified?" Approved ": " Disapproved"} textStyle={therapist2.isVerified?{color:"green"}:{color:"red"}} />
              </TableWrapper>

            </Table>
            <View
              style={{
                marginVertical: 32,
              }}
            >
              <Input
                label="Additional Comment"
                placeholder="Add the comment here"
                style={{
                  height: 200,
                  flex: 1,
                }}
                value={comment}
                onChangeText={(nextValue) => setComment(nextValue)}
              />
            </View>

            <View
              style={{
                flex: 1,
                flexDirection: "row",
              }}
            >
              <Button
                onPress={disapprove}
                style={{
                  marginTop: 32,
                  flex: 1,
                  height: 46,
                  marginRight: 16,
                }}
              >
                Disapprove
              </Button>

              <Button
                onPress={approve}
                style={{
                  marginTop: 32,
                  flex: 1,
                  height: 46,
                  marginLeft: 16,
                }}
              >
                Approve
              </Button>
            </View>
          </View>
        </View>
      </View>
    </Layout>
  );
};

const Stack = createStackNavigator();

function TherapistStack() {
  return (
    <Stack.Navigator
      initialRouteName="Therapist"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Therapist" component={TherapistsScreen} />
      <Stack.Screen name="Details" component={TherapistDetails} />
    </Stack.Navigator>
  );
}

const LogoutIcon = (props) => <Icon {...props} name="log-out-outline" />;

const PeopleIcon = (props) => <Icon {...props} name="people-outline" />;
const SettingIcon = (props) => <Icon {...props} name="settings-outline" />;

const HomeIcon = (props) => <Icon {...props} name="grid-outline" />;

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
const HomeScreen = () => {
  const navigation = useNavigation();
  const isDrawerOpen = useIsDrawerOpen();
  const isBig = useMediaQuery({
    minWidth: 768,
  });
  const { loading, error, data } = useQuery(GET_USER);

  const BackIcon = (props) => <Icon {...props} name="menu-outline" />;

  // data to be loaded from internet
  var values = ["verified", "pending"];
  const [dataTherapists, setDataTherapists] = React.useState([
    {
      title: "Name",
      description: "Description for Item",
      status: values[Math.floor(Math.random() * values.length)],
    },
    {
      title: "Name",
      description: "Description for Item",
      status: "pending",
    },
    {
      title: "Name",
      description: "Description for Item",
      status: "verified",
    },
    {
      title: "Name",
      description: "Description for Item",
      status: values[Math.floor(Math.random() * values.length)],
    },
  ]);

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

  const renderItemAccessory = (status) => {
    console.log("Props passed : ", status);
    return (
      <View style={{ flexDirection: "row" }}>
        <Button size="tiny">View</Button>
      </View>
    );
  };

  const renderItemIcon = (status) => (
    <View>
      {status === "verified" ? (
        <Icon
          name="person-done-outline"
          fill="green"
          style={{
            height: 26,
            width: 26,
            marginRight: 8,
          }}
        />
      ) : (
        <Icon
          name="person-delete-outline"
          fill="red"
          style={{
            height: 26,
            width: 26,
            marginRight: 8,
          }}
        />
      )}
    </View>
  );

  const renderItem = ({ item, index }) => (
    <ListItem
      title={`${item.title} ${index + 1}`}
      description={`${item.description} ${index + 1}`}
      accessoryLeft={(props) => renderItemIcon(item.status)}
      accessoryRight={(props) => renderItemAccessory(item.status)}
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
        <ScrollView style={{ height: "100%" }}>
          {/* {loading && <Text>Loading data </Text>}
          {error && <Text>{JSON.stringify(error)}</Text>} */}
          <View>
            <View
              style={{
                flex: 1,
                height: 100,
                width: "100%",
                flexDirection: "row",
                marginBottom: 10,
              }}
            >
              <View
                style={[
                  styles.dashBoardContentContainer,
                  { height: 100, flex: 1 },
                ]}
              >
                <Text>Therapists</Text>
                <Text>{90}</Text>
              </View>

              <View
                style={[
                  styles.dashBoardContentContainer,
                  { height: 100, flex: 1 },
                ]}
              >
                <Text>Attendee</Text>
                <Text>{10}</Text>
              </View>
              {/* 
              <View style={[styles.dashBoardContentContainer, { height: 100, flex: 1 }]}>
              </View> */}

              <View
                style={[
                  styles.dashBoardContentContainer,
                  { height: 100, flex: 1 },
                ]}
              >
                <Text>Online Users</Text>
                <Text>{1}</Text>
              </View>
            </View>

            <View
              style={{
                flex: 1,
                height: 400,
                paddingHorizontal: 4,
                marginBottom: 10,
              }}
            >
              <PieChart
                data={dataPie}
                width={screenWidth}
                height={220}
                chartConfig={chartConfig}
                accessor="population"
                backgroundColor="transparent"
                paddingLeft="15"
                absolute
              />
            </View>

            <View
              style={{
                flexDirection: "row",
                paddingHorizontal: 4,
                marginBottom: 10,
              }}
            >
              <View style={{ flex: 1, height: 400 }}>
                <BarChart
                  style={{}}
                  data={datas}
                  width={screenWidth}
                  height={400}
                  yAxisLabel=""
                  chartConfig={chartConfig}
                  verticalLabelRotation={0}
                />
              </View>

              <View style={{ flex: 1, height: 400 }}>
                <BarChart
                  style={{}}
                  data={datas}
                  width={screenWidth}
                  height={400}
                  yAxisLabel=""
                  chartConfig={chartConfig}
                  verticalLabelRotation={0}
                />
              </View>
            </View>
            <View
              style={{
                // flex: 1,
                backgroundColor: "red",
                // height: 400,
                marginHorizontal: 4,
                // marginTop: 10
              }}
            >
              {/* <Text >
                Therapists
              </Text> */}
              {/* <List
                ListHeaderComponent={() => (
                  <Text
                    category="h6"
                    style={{
                      paddingVertical: 8,
                      paddingHorizontal: 4,
                    }}
                  >
                    Therapists
                  </Text>
                )}
                style={{}}
                data={dataTherapists}
                renderItem={renderItem}
              /> */}
              <Therapists />
            </View>
          </View>
        </ScrollView>
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
    }}
    indicatorStyle={{
      backgroundColor: "red",
    }}
    footer={Footer}
  >
    <DrawerItem
      title="Dashboard"
      accessoryLeft={HomeIcon}
      style={styles.drawerItem}
    />
    <DrawerItem
      title="Therapists"
      accessoryLeft={PeopleIcon}
      style={styles.drawerItem}
    />
    {/* <DrawerItem
      title="Account"
      accessoryLeft={SettingIcon}
      style={styles.drawerItem}
    /> */}
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
      <Screen name="Dashboard" component={HomeScreen} />
      <Screen name="Therapists" component={TherapistStack} />
      {/* <Screen name="Account" component={AccountScreen} /> */}
      {/* <Screen name="Logout" component={LogoutScreen} /> */}
    </Navigator>
  );
};

const Therapists = () => {
  const navigation = useNavigation();
  const { data: therapists, update, error, set } = useCollection(`therapist`, {
    listen: true,
  });

  const state = {
    tableHead: ["Name", "Phone", "Gender", "Actions"],
  };

  const alertIndex = (index) => {
    alert(`This is row ${index + 1}`);
  };

  const goView = (therapist) => {
    // navigation.navigate("")
    navigation.navigate("Therapists", {
      screen: "Details",
      params: { therapist: JSON.stringify(therapist) },
    });
  };

  // const state = this.state;
  const element = (therapist) => (
    <TouchableOpacity
      onPress={() => {
        goView(therapist);
      }}
    >
      <View style={styless.btn}>
        <Text style={styless.btnText}>View</Text>
      </View>
    </TouchableOpacity>
  );

  if (error) retrun(<Text>Error fetching therapists</Text>);
  if (!therapists) return <ActivityIndicator />;
  console.log("all therapists here ", therapists);
  return (
    <View style={styless.container}>
      <Table borderStyle={{ borderColor: "transparent" }}>
        <Row
          data={state.tableHead}
          style={styless.head}
          textStyle={styless.text}
        />
        {therapists.map((therapist, index) => (
          <TableWrapper
            key={index}
            style={[styless.row, index % 2 && { backgroundColor: "#F7F6E7" }]}
          >
            <Cell
              data={
                therapist.application.firstName +
                " " +
                therapist.application.lastName
              }
              textStyle={styless.text}
            />
            <Cell data={therapist.application.phone} textStyle={styless.text} />
            <Cell
              data={therapist.application.gender}
              textStyle={styless.text}
            />

            <Cell data={element(therapist)} textStyle={styless.text} />
          </TableWrapper>
        ))}
      </Table>
    </View>
  );
};

const styless = StyleSheet.create({
  container: { flex: 1, padding: 16, paddingTop: 30, backgroundColor: "#fff" },
  head: { height: 40, backgroundColor: "#537791" },
  text: { margin: 6 },
  row: { flexDirection: "row", backgroundColor: "#FFFFFF" },
  btn: {
    paddingHorizontal: 9,
    paddingVertical: 4,
    marginTop: 9,
    backgroundColor: "#78B7BB",
    borderRadius: 2,
  },
  btnText: { textAlign: "center", color: "#fff" },
});

const AppNavigator = () => <DrawerNavigator />;

export default AppNavigator;
