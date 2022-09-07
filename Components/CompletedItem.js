import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  View,
  Image,
  TextInput,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ImageBackground,
} from "react-native";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

const CompletedItem = (props) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.completedButtonContainer}
        onPress={() => props.addToCompleted(props.index)}
      >
        <Image
          source={require("../assets/completedButton.png")}
          style={styles.completedButton}
        />
      </TouchableOpacity>

      <Text style={styles.text}>{props.text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    display: "flex",
    width: wp(90),
    height: hp(6),
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 5,
    marginBottom: hp(1),
  },
  button: {
    width: wp(6),
    height: hp(4),
    resizeMode: "contain",
  },
  editButtonContainer: {
    width: wp(16),
    height: hp(6),
    backgroundColor: "#3D86F4",
    alignItems: "center",
    justifyContent: "center",
  },
  delButtonContainer: {
    width: wp(16),
    height: hp(6),
    backgroundColor: "#CC5757",
    alignItems: "center",
    justifyContent: "center",
  },
  completedButtonContainer: {
    width: wp(4),
    height: hp(4),
    borderRadius: 50,
    marginLeft: wp(2),
  },
  completedButton: {
    width: wp(4),
    height: hp(4),
    resizeMode: "contain",
  },
  text: {
    fontSize: hp(1.5),
    marginLeft: wp(4),
    width: wp(72),
    textDecorationLine: "line-through",
  },
});

export default CompletedItem;
