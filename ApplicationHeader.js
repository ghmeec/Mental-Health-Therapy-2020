import React from 'react'
import {
    TopNavigation,
    TopNavigationAction,
    Icon,
    Divider,
    Text
} from "@ui-kitten/components";
import { useMediaQuery } from "react-responsive";
import { useNavigation } from "@react-navigation/native";
import {
    useIsDrawerOpen,
} from "@react-navigation/drawer";


const Header = ({ title }) => {
    const navigation = useNavigation();
    const isBig = useMediaQuery({
        minWidth: 768,
    });
    const isDrawerOpen = useIsDrawerOpen();

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
        <>
            <TopNavigation
                title={evaProps => <Text {...evaProps}
                style={{
                    marginLeft:12,
                    fontSize:16
                }}
                >{title?title:""}</Text>}
                accessoryLeft={(!isBig) && renderBackAction}
                style={{
                    backgroundColor: "FCFCFC",
                }}

            />
            <Divider />
        </>

    )

}

export default Header