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
  FlatList,
} from "react-native";
import { Overlay } from "@rneui/themed";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import FolderItem from "../Components/FolderItem";

const Home = () => {
  const [folders, setFolders] = useState([]);
  const [isVisible, setVisible] = useState(false);
  const [text, setText] = useState();
  const [currIndex, setCurrIndex] = useState();
  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("folders");
      const item = jsonValue != null ? JSON.parse(jsonValue) : null;
      if (item != null) {
        console.log(item);
        setFolders([...item]);
      } else {
        console.log("no item");
      }
    } catch (e) {
      // error reading value
    }
  };

  const storeData = async (value) => {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem("folders", jsonValue);
    } catch (e) {
      // saving error
    }
  };

  const editDataName = async (folderName, newFolderName) => {
    try {
      const jsonValue = await AsyncStorage.getItem(folderName);
      const item = jsonValue != null ? JSON.parse(jsonValue) : null;
      if (item != null) {
        try {
          const jsonValue = JSON.stringify(item);
          await AsyncStorage.setItem(newFolderName, jsonValue);
          const jsonValue2 = JSON.stringify([]);
          await AsyncStorage.setItem(folderName, jsonValue2);
        } catch (e) {
          // saving error
        }
      } else {
        console.log("no item");
      }
    } catch (e) {
      // error reading value
    }
    try {
      const jsonValue = await AsyncStorage.getItem(folderName + "completed");
      const item = jsonValue != null ? JSON.parse(jsonValue) : null;
      if (item != null) {
        try {
          const jsonValue = JSON.stringify(item);
          await AsyncStorage.setItem(newFolderName + "completed", jsonValue);
          const jsonValue2 = JSON.stringify([]);
          await AsyncStorage.setItem(folderName + "completed", jsonValue2);
        } catch (e) {
          // saving error
        }
      } else {
        console.log("no item");
      }
    } catch (e) {
      // error reading value
    }
  };

  const delChild = async (folderName) => {
    try {
      const jsonValue = JSON.stringify([]);
      await AsyncStorage.setItem(folderName, jsonValue);
      const jsonValue2 = JSON.stringify([]);
      await AsyncStorage.setItem(folderName + "completed", jsonValue2);
    } catch (e) {
      // saving error
    }
  };

  function hasItem(item) {
    let flag = false;
    folders.forEach((temp) => {
      if (temp.text == item.text) flag = true;
    });
    return flag;
  }

  const addFolder = () => {
    const item = {
      text: "New Folder",
      completed: false,
    };
    if (hasItem(item)) {
      alert("New Folder Already Exists!");
    } else {
      storeData([...folders, item]);
      setFolders([...folders, item]);
    }
  };

  const deleteItem = (index) => {
    const temp = [...folders];
    delChild(folders[index].text);
    temp.splice(index, 1);
    storeData([...temp]);
    setFolders([...temp]);
  };

  const completeItem = (index) => {
    const temp = [...folders];
    temp[index].completed = !temp[index].completed;
    storeData([...temp]);
    setFolders([...temp]);
  };

  const editItem = (index) => {
    setCurrIndex(index);
    setVisible(true);
  };

  const onSubmitEditing = () => {
    const temp = [...folders];
    editDataName(temp[currIndex].text, text);
    temp[currIndex].text = text;
    storeData([...temp]);
    setFolders([...temp]);
    setVisible(false);
  };

  const renderItem = ({ item, index }) => {
    return (
      <FolderItem
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
        <Text style={styles.title}>{"To-Do"}</Text>
        <TouchableOpacity
          style={[styles.addButton, { marginRight: wp(1) }]}
          onPress={addFolder}
        >
          <Image
            source={require("../assets/addButtonBlack.png")}
            style={[styles.addButton, { resizeMode: "contain" }]}
          />
        </TouchableOpacity>
      </View>
      <FlatList
        data={folders}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        style={{ marginTop: hp(4) }}
      />
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
          style={styles.input}
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
    justifyContent: "space-between",
  },
  title: {
    fontSize: hp(2.5),
    fontWeight: "bold",
    color: "white",
    marginLeft: wp(4),
  },
  addButton: {
    width: wp(10),
    height: hp(3),
  },
  overlay: {
    width: wp(40),
    height: hp(12),
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderRadius: 10,
  },
  input: {
    width: wp(30),
    backgroundColor: "rgba(67,161,232,0.39)",
    borderRadius: 3,
  },
});

export default Home;
