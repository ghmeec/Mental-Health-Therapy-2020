import React from "react";
import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  drawerItem: {
    backgroundColor: "#FCFCFC",
  },
  header: {
    backgroundColor: "#FCFCFC",
    paddingHorizontal: 12,
    fontSize: 16,
  },
  mainContainer: {
    flex: 1,
    backgroundColor: "#E9E9EA",
    paddingHorizontal: 12,
    paddingVertical: 16,
  },
  chatContainer: {
    flex: 1,
    flexDirection: "row",
  },
  icon: {
    height: 32,
    width: 32,
  },
  contentContainer: {
    flex: 1,
    // backgroundColor: "#FCFCFC",
    backgroundColor:"#E9E9EA",
    paddingHorizontal: 12,
    paddingVertical: 8,
  },

  dashBoardContentContainer:{
    backgroundColor:"white",
    marginHorizontal:4
  },
  inputContainer: {
    flex: 1,
    backgroundColor: "#FCFCF",
    // paddingHorizontal: 12,
    marginVertical: 8,
    width:500
  
  },
});

export default styles;
