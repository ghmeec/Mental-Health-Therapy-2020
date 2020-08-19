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
import styles from './styles'


const Header = (props) => {
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
                >{props.title?props.title:""}</Text>}
                accessoryLeft={(!isBig) && renderBackAction}
                style={styles.header}
                {...props}

            />
            {/* <Divider /> */}
        </>

    )

}

export default Header