import React, { useContext } from 'react'
import { TouchableOpacity, View } from 'react-native'
import { Icon, Layout, Input, Text } from '@ui-kitten/components';

import 'firebase'
import 'firebase/auth'
import { FirebaseContext } from '../../utils/firebase';
import ApplicationHeader from '../../ApplicationHeader'
import styles from '../../styles'

const LoginInformationEdit = () => {
    const firebase = useContext(FirebaseContext)
    var user = firebase.auth().currentUser
    const [value, setValue] = React.useState("");
    const [editStatus, setEmailEditStatus] = React.useState(true);
    const [oldPassword, setOldPassword] = React.useState("")
    const [newPassword, setNewPassword] = React.useState("")

    const [email, setEmail] = React.useState(user.email)
    console.log("Current user , : ", user)

    const toggleEmailEdit = () => {
        setEmailEditStatus(!editStatus);
    };

    const reauthenticate = (currentPassword) => {
        var user = firebase.auth().currentUser;
        var cred = firebase.auth.EmailAuthProvider.credential(
            user.email, currentPassword);
        return user.reauthenticateWithCredential(cred);
    }

    const changePassword = (oldPassword, newPassword) => {
        reauthenticate(oldPassword).then(() => {
            user.updatePassword(newPassword).then(() => {
                console.log("Password updated!");
            }).catch((error) => { console.log(error); });
        }).catch((error) => { console.log(error); });
    }

    const changeEmail = (oldPassword, newEmail) => {
        reauthenticate(oldPassword).then(() => {
            user.updateEmail(newEmail).then(() => {
                console.log("Email updated!");
            }).catch((error) => { console.log(error); });
        }).catch((error) => { console.log(error); });
    }

    const updateLoginInformation = () => {
        changeEmail(oldPassword,email)
        changePassword(oldPassword,newPassword)
    }

    const EditIcon = (props) => (
        <>
            {editStatus && <TouchableOpacity onPress={toggleEmailEdit}>
                <Icon {...props} name={"edit-outline"} style={{ width: 28, height: 28 }} />
            </TouchableOpacity>}
            {!editStatus && <TouchableOpacity onPress={updateLoginInformation} style={{ width: 28, height: 28 }}>
                <Icon {...props} name={"save-outline"} />
            </TouchableOpacity>}
        </>
    );


    console.log("Edit status : ", editStatus)
    return (
        <View
            style={{
                backgroundColor: "#FCFCFC",
                paddingHorizontal: 12,
                paddingVertical: 16,
            }}
        >
            <View
                style={{
                    flexDirection: "row",
                    maxWidth: 500,
                }}
            >
                <Text category="h5" style={{ flex: 9 }}>
                    Login Information
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
                label="Email"
                disabled={editStatus}
                value={email}
                style={{
                    maxWidth: 500,
                }}
                onChangeText={nextValue => setEmail(nextValue)}
            ></Input>
            <Input
                disabled={editStatus}
                style={{
                    maxWidth: 500,
                }}
                label="Old Password"
                value={oldPassword}
                placeholder="*********"
                onChangeText={(oldPassword) => setOldPassword(oldPassword)}
            ></Input>
            <Input
                disabled={editStatus}
                style={{
                    maxWidth: 500,
                }}
                label="New Password"
                placeholder="*********"
                onChangeText={(newPassword) => setNewPassword(newPassword)}
            ></Input>
        </View>
    );
};

export default LoginInformationEdit