import React from 'react'
import { TouchableOpacity, View } from 'react-native'
import { Icon, Text, Input, Layout, Datepicker, Select, SelectItem } from '@ui-kitten/components'
import {
    gql,
    useQuery,
    useMutation
} from "@apollo/client";


import styles from '../../styles'

const GET_USER = gql`
query GetUser{
  users{
    first_name
    last_name
    gender
    id
    date_of_birth
  }
}
`

const PersonalInformationEdit = () => {
    const [value, setValue] = React.useState("");
    const [editStatus, setEditStatus] = React.useState(true);
    const [selectedIndex, setSelectedIndex] = React.useState();
    const [gender, setGender] = React.useState(['', 'Male', 'Female']);
    const [date, setDate] = React.useState(new Date());
    const { loading, error, data } = useQuery(GET_USER);

 
    const toggleEditStatus = () => {
        setEditStatus(!editStatus);
    };

    const EditIcon = (props) => (
        <TouchableOpacity onPress={toggleEditStatus}>
            <Icon
                {...props}
                style={{
                    width: 32,
                    height: 32,
                }}
                name={"edit-outline"}
            />
        </TouchableOpacity>
    );
    const renderIcon = (props) => (
        <TouchableOpacity onPress={toggleEmailEdit}>
            <Icon {...props} name={"edit-outline"} />
        </TouchableOpacity>
    );

    if (loading) {
        return (
            <Text>Loading data</Text>
        )
    }

    if (error) {
        return (
            <Text>{JSON.stringify(error)}</Text>
        )
    }

    if (data) {
        console.log("Data user " ,data)
        const user=data.users[0]
        const date_of_birth=new Date(user.date_of_birth)
        return (

            <View
                style={{
                    backgroundColor: "#FCFCFC",
                    paddingHorizontal: 12,
                    paddingVertical: 16,
                    marginTop: 24,
                }}
            >
                <View
                    style={{
                        flexDirection: "row",
                        maxWidth: 500,
                    }}
                >
                    <Text category="h5" style={{ flex: 9 }}>
                        Personal Information
                </Text>
                    <View
                        style={{
                            flex: 1,
                            paddingLeft: 10,
                            alignItems: "center",
                            justifyContent: "center",
                            alignContent: "center",
                        }}
                    >
                        <EditIcon />
                    </View>
                </View>

                <Input
                    label="Full Names"
                    disabled={editStatus}
                    style={{
                        maxWidth: 500,
                    }}
                    value={user.first_name + " " + user.last_name}
                ></Input>
                <Layout style={styles.gendercontainer} level="1">
                    <Select
                        style={styles.inputContainer}
                        label="Gender"
                        selectedIndex={selectedIndex}
                        onSelect={(index) => setSelectedIndex(index)}
                        value={user.gender}
                        disabled={editStatus}
                    >
                        <SelectItem title="Male" />
                        <SelectItem title="Female" />
                    </Select>
                </Layout>
                <Layout style={styles.container} level='1'>

                    <Datepicker
                        label='BirthDate'
                        placeholder='Pick Date'
                        style={styles.inputContainer}
                        date={date_of_birth}
                        onSelect={nextDate => setDate(nextDate)}
                        disabled={editStatus}
                    />

                </Layout>
            </View>
        )
    }
};

export default PersonalInformationEdit