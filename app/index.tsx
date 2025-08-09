import { useTheme } from "@/contexts/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Checkbox from "expo-checkbox";
import { useEffect, useState } from "react";
import {
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type todoType = {
  id: number;
  title: string;
  isDone: boolean;
};

export default function Index() {
  // const todo = [
  //   {
  //     id: 1,
  //     title: "Todo 1",
  //     isDone: false,
  //   },
  //   {
  //     id: 2,
  //     title: "Todo 2",
  //     isDone: false,
  //   },
  //   {
  //     id: 3,
  //     title: "Todo 3",
  //     isDone: true,
  //   },
  //   {
  //     id: 4,
  //     title: "Todo 4",
  //     isDone: false,
  //   },
  //   {
  //     id: 5,
  //     title: "Todo 5",
  //     isDone: false,
  //   },
  // ];

  const [todos, setTodos] = useState<todoType[]>([]);
  const [oldTodos, setOldTodos] = useState<todoType[]>([]);
  const [todoText, setTodoText] = useState("");
  const [searchText, setSearchText] = useState("");
  const { theme, toggleTheme } = useTheme();

  const isDark = theme === "dark";

  useEffect(() => {
    const getTodos = async () => {
      try {
        const todos = await AsyncStorage.getItem("my-todo");
        if (todos !== null) {
          setTodos(JSON.parse(todos));
          setOldTodos(JSON.parse(todos));
        }
      } catch (error) {
        console.log(error);
      }
    };
    getTodos();
  }, []);

  const addTodo = async () => {

    if(todoText === ''){
      return;
    }
    try {
      const newTodo = {
        id: Math.random(),
        title: todoText,
        isDone: false,
      };
      todos?.push(newTodo);
      setTodos(todos);
      setOldTodos(todos);
      await AsyncStorage.setItem("my-todo", JSON.stringify(todos));
      setTodoText("");
      Keyboard.dismiss();
    } catch (error) {
      console.log(error);
    }
  };

  const deleteTodo = async (id: number) => {
    try {
      const newTodos = todos.filter((todo) => todo.id !== id);
      await AsyncStorage.setItem("my-todo", JSON.stringify(newTodos));
      setTodos(newTodos);
      setOldTodos(newTodos);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDone = async (id: number) => {
    try {
      const newTodos = todos.map((todo) => {
        if (todo.id === id) {
          todo.isDone = !todo.isDone;
        }
        return todo;
      });
      await AsyncStorage.setItem("my-todo", JSON.stringify(newTodos));
      setTodos(newTodos);
      setOldTodos(newTodos);
    } catch (error) {
      console.log(error);
    }
  };

  const onSearch = async (searchText: string) => {
    if (searchText === "") {
      setTodos(oldTodos);
    } else {
      const filteredTodos = todos.filter((todo) =>
        todo.title.toLowerCase().includes(searchText.toLowerCase())
      );
      setTodos(filteredTodos);
    }
  };

  useEffect(() => {
    onSearch(searchText);
  }, [searchText]);

  // const [isChecked , setIsChecked] = useState(false)
  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: isDark ? "#eee" : "#000" }]}
    >
      {/* <Text>Edit app/index.tsx to edit this screen.</Text> */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => {
            // alert("jj");
          }}
        >
          <Ionicons name="menu" size={24} color={isDark ? "#000" : "#eee"} />
        </TouchableOpacity>

        <TouchableOpacity onPress={toggleTheme}>
          <Ionicons
            name="contrast-outline"
            size={24}
            color={isDark ? "#000" : "#eee"}
          />
        </TouchableOpacity>

        {/* <Image
          source={{ uri: "https://xsgames.co/randomusers/avatar.php?g=male" }}
          style={{ width: 40, height: 40, borderRadius: 20 }}
        /> */}
      </View>

      <View
        style={[
          styles.searchBar,
          { backgroundColor: isDark ? "#fff" : "#333" },
        ]}
      >
        <Ionicons name="search" size={24} color={isDark ? "#000" : "#fff"} />
        <TextInput
          placeholder="Search"
          value={searchText}
          onChangeText={(text) => setSearchText(text)}
          style={[styles.input, { color: isDark ? "#000" : "#fff" }]}
          clearButtonMode="always"
          placeholderTextColor={isDark ? "#000" : "#fff"}
        />
      </View>
      <FlatList
        data={[...todos].reverse()}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View
            style={[
              styles.todoContainer,
              { backgroundColor: isDark ? "#fff" : "#333" },
            ]}
          >
            <View style={styles.todoInfoContainer}>
              <Checkbox
                value={item.isDone}
                color={item.isDone ? "#009688" : undefined}
                onValueChange={() => handleDone(item.id)}
              />
              <Text
                style={[
                  styles.todoText,
                  item.isDone && { textDecorationLine: "line-through" },
                  { color: isDark ? "#000" : "#fff" },
                ]}
              >
                {item.title}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => {
                // alert("Deleted " + item.title);
                deleteTodo(item.id);
              }}
            >
              <Ionicons name="trash" size={24} color={"red"} />
            </TouchableOpacity>
          </View>
        )}
      />

      <KeyboardAvoidingView
        style={styles.footer}
        behavior="padding"
        keyboardVerticalOffset={10}
      >
        <TextInput
          placeholder="Add New Todo"
          style={[
            styles.newTodoInput,
            {
              backgroundColor: isDark ? "#fff" : "#333",
              color: isDark ? "#000" : "#fff",
            },
          ]}
          onChangeText={(text) => setTodoText(text)}
          value={todoText}
          placeholderTextColor={isDark ? "#000" : "#fff"}
        />
        <TouchableOpacity
          onPress={() => addTodo()}
          style={styles.newTodoButton}
        >
          <Ionicons name="add" size={24} color={"black"} />
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
  },
  header: {
    marginBottom: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  searchBar: {
    // backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    borderRadius: 10,
    gap: 10,
    marginBottom: 20,
  },
  input: {
    // backgroundColor:'#000',
    flex: 1,
    fontSize: 16,
    // color: "#000",
  },
  todoContainer: {
    // backgroundColor: "#fff",
    marginBottom: 20,
    paddingHorizontal:10,

    flexDirection: "row",
    padding: 4,
    borderRadius: 10,
    justifyContent: "space-between",
  },
  todoInfoContainer: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
  todoText: {
    fontSize: 16,
    color: "#333",
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  newTodoInput: {
    // backgroundColor: "#fff",
    flex: 1,
    paddingHorizontal:10,
    borderRadius: 10,
    color: "#000",
    fontSize: 16,
  },
  newTodoButton: {
    backgroundColor: "#009688",
    padding: 8,
    borderRadius: 10,
    marginLeft: 18,
  },
});
