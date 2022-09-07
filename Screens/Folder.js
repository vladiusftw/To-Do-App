import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
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
import { FlatList } from "react-native-gesture-handler";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ToDoItem from "../Components/ToDoItem";
import CompletedItem from "../Components/CompletedItem";
import { Overlay } from "@rneui/themed";

const Folder = ({ navigation, route }) => {
  const [list, setList] = useState([]);
  const [completed, setCompleted] = useState([]);
  const [showCompleted, setShowCompleted] = useState(false);
  const [input, setInput] = useState();
  const [currIndex, setCurrIndex] = useState();
  const [isVisible, setVisible] = useState(false);
  const [text, setText] = useState();
  const folderName = route.params.folderName;
  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem(folderName);
      const item = jsonValue != null ? JSON.parse(jsonValue) : null;
      if (item != null) {
        console.log(item);
        setList([...item]);
      } else {
        console.log("no item");
      }
    } catch (e) {
      // error reading value
      console.log(e);
    }
  };

  const storeData = async (value) => {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(folderName, jsonValue);
    } catch (e) {
      // saving error
    }
  };

  const getCompleted = async () => {
    if (showCompleted) {
      setShowCompleted(false);
      return;
    }
    try {
      const jsonValue = await AsyncStorage.getItem(folderName + "completed");
      const item = jsonValue != null ? JSON.parse(jsonValue) : null;
      if (item != null) {
        console.log(item);
        setCompleted([...item]);
      } else {
        console.log("no item");
      }
      setShowCompleted(true);
    } catch (e) {
      // error reading value
      console.log(e);
    }
  };

  const storeCompleted = async (value) => {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(folderName + "completed", jsonValue);
    } catch (e) {
      // saving error
    }
  };

  function hasItem(item) {
    let flag = false;
    list.forEach((temp) => {
      if (temp.text == item.text) flag = true;
    });
    return flag;
  }

  const addItem = () => {
    const item = {
      text: input,
      completed: false,
    };
    if (hasItem(item)) {
      alert(item.text + " Already Exists!");
    } else {
      storeData([...list, item]);
      setList([...list, item]);
    }
  };

  const deleteItem = (index) => {
    const temp = [...list];
    temp.splice(index, 1);
    storeData([...temp]);
    setList([...temp]);
  };

  const completeItem = (index) => {
    const temp = [...list];
    temp[index].completed = !temp[index].completed;
    storeData([...temp]);
    setList([...temp]);
  };

  const editItem = (index) => {
    setCurrIndex(index);
    setVisible(true);
  };

  const onSubmitEditing = () => {
    const temp = [...list];
    temp[currIndex].text = text;
    storeData([...temp]);
    setList([...temp]);
    setVisible(false);
  };

  const addToCompleted = (index) => {
    const tempItem = list[index];
    deleteItem(index);
    storeCompleted([...completed, tempItem]);
    setCompleted([...completed, tempItem]);
  };

  const renderItem = ({ item, index }) => {
    return (
      <ToDoItem
        text={item?.text}
        completed={item?.completed}
        delItem={deleteItem}
        completeItem={completeItem}
        editItem={editItem}
        index={index}
        addToCompleted={addToCompleted}
      />
    );
  };

  const renderItem2 = ({ item, index }) => {
    return (
      <CompletedItem
        text={item?.text}
        completed={item?.completed}
        delItem={deleteItem}
        completeItem={completeItem}
        editItem={editItem}
        index={index}
      />
    );
  };
  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity
          style={[styles.arrowBack, { marginLeft: wp(2) }]}
          onPress={() => navigation.goBack()}
        >
          <Image
            source={require("../assets/arrowBack.png")}
            style={[styles.addButton, { resizeMode: "contain" }]}
          />
        </TouchableOpacity>
        <Text style={styles.title}>{folderName}</Text>
      </View>

      <FlatList
        data={list}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        style={{ marginTop: hp(4), maxHeight: hp(35), flexGrow: 0 }}
      />

      <TouchableOpacity
        style={{
          width: wp(30),
          height: hp(4),
          backgroundColor: "#78B8E8",
          borderRadius: 10,
          flexDirection: "row",
          alignItems: "center",
          alignSelf: "flex-start",
          marginLeft: wp(4),
        }}
        onPress={getCompleted}
      >
        <Image
          source={
            showCompleted
              ? require("../assets/downButton.png")
              : require("../assets/rightButton.png")
          }
          style={{
            width: wp(3),
            height: hp(3),
            resizeMode: "contain",
            marginLeft: wp(2),
          }}
        />
        <Text style={{ fontSize: hp(1.5), marginLeft: wp(1) }}>
          {"Completed"}
        </Text>
      </TouchableOpacity>
      <FlatList
        data={completed}
        renderItem={renderItem2}
        keyExtractor={(item, index) => index.toString()}
        style={{
          display: showCompleted ? "flex" : "none",
          flexGrow: 0,
          height: hp(20),
          marginTop: hp(1),
        }}
      />

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          position: "absolute",
          bottom: hp(4),
        }}
      >
        <TextInput
          placeholder="Add Task"
          style={styles.input}
          onChangeText={(newText) => setInput(newText)}
          value={input}
        />
        <TouchableOpacity
          style={styles.addButtonContainer}
          onPress={() => {
            addItem();
            setInput("");
          }}
        >
          <Image
            source={require("../assets/addButtonBlue.png")}
            style={styles.addButton}
          />
        </TouchableOpacity>
      </View>
      <Overlay
        isVisible={isVisible}
        onBackdropPress={() => setVisible(!isVisible)}
        overlayStyle={styles.overlay}
      >
        <Text
          style={{ fontSize: hp(1.5), fontWeight: "bold", marginBottom: hp(1) }}
        >
          {"Rename Folder"}
        </Text>
        <TextInput
          style={styles.overlayInput}
          onSubmitEditing={onSubmitEditing}
          onChangeText={(newText) => setText(newText)}
        />
      </Overlay>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#C9E8FF",
    alignItems: "center",
  },
  topBar: {
    width: wp(90),
    height: hp(6),
    backgroundColor: "#43A1E8",
    marginTop: hp(10),
    borderRadius: hp(1),
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    fontSize: hp(2.5),
    fontWeight: "bold",
    color: "white",
  },
  arrowBack: {
    width: wp(10),
    height: hp(3),
  },
  input: {
    fontSize: hp(2),
    fontWeight: "bold",
    width: wp(80),
    height: hp(6),
    borderRadius: 5,
    paddingLeft: wp(4),
    backgroundColor: "white",
  },
  addButtonContainer: {
    width: wp(7),
    height: hp(4),
    marginLeft: wp(2),
  },
  addButton: {
    width: wp(7),
    height: hp(4),
    resizeMode: "contain",
  },
  overlay: {
    width: wp(40),
    height: hp(12),
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderRadius: 10,
  },
  overlayInput: {
    width: wp(30),
    backgroundColor: "rgba(67,161,232,0.39)",
    borderRadius: 3,
  },
});

export default Folder;
