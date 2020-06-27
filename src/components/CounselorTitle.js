import React from 'react'
import { View} from 'react-native'
import {Text} from '@ui-kitten/components'


const CounselorTitle = () => {
    const [value, setValue] = React.useState("");

    return (

        <View
            style={{
                backgroundColor: "#FCFCFC",
                paddingHorizontal: 12,
                paddingVertical: 16,
                marginTop: 24,
            }}
        >
            <Text category="h5" style={{}}>
                Login Information
            </Text>
            <Text>Your assigned to counselor + Counselor Name Here </Text>
        </View>
    );
};

export default CounselorTitle