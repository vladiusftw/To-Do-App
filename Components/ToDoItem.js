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
import Swipeable from "react-native-gesture-handler/Swipeable";

const ToDoItem = (props) => {
  const [swiped, setSwiped] = useState(false);
  const swipeRef = useRef();
  const RightActions = () => {
    return (
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <TouchableOpacity
          style={styles.editButtonContainer}
          onPress={() => {
            swipeRef.current.close();
            props.editItem(props.index);
          }}
        >
          <Image
            source={require("../assets/editButton.png")}
            style={styles.button}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.delButtonContainer}
          onPress={() => props.delItem(props.index)}
        >
          <Image
            source={require("../assets/deleteButton.png")}
            style={styles.button}
          />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <Swipeable
      renderRightActions={RightActions}
      onSwipeableOpen={() => setSwiped(true)}
      onSwipeableClose={() => setSwiped(false)}
      containerStyle={{ marginBottom: hp(1) }}
      ref={swipeRef}
    >
      <View
        style={[styles.container, { paddingLeft: swiped ? wp(32) : wp(0) }]}
      >
        <TouchableOpacity
          style={styles.completeButton}
          onPress={() => props.addToCompleted(props.index)}
        />

        <Text style={[styles.text, { width: swiped ? wp(40) : wp(72) }]}>
          {props.text}
        </Text>
      </View>
    </Swipeable>
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
  completeButton: {
    width: wp(3.8),
    height: hp(1.6),
    borderRadius: 50,
    marginLeft: wp(2),
    borderWidth: 1,
  },
  text: {
    fontSize: hp(1.5),
    marginLeft: wp(4),
  },
});

export default ToDoItem;
