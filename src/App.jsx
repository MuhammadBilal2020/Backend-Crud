import React, { useState, useEffect } from "react";
import axios from "axios";

const App = () => {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedTodo, setSelectedTodo] = useState(null);

  // Fetch all todos
  const fetchTodos = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/v1/todos");
      setTodos(response.data.todos);
    } catch (error) {
      console.error("Error fetching todos:", error.message);
    }
  };

  // Add a new todo
  const addTodo = async () => {
    try {
      const response = await axios.post("http://localhost:3000/api/v1/todo", { title, description });
      setTodos([...todos, response.data.data]);
      setTitle("");
      setDescription("");
    } catch (error) {
      console.error("Error adding todo:", error.message);
    }
  };

  // Delete a todo
  const deleteTodo = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/v1/todo/${id}`);
      setTodos(todos.filter((todo) => todo._id !== id));
    } catch (error) {
      console.error("Error deleting todo:", error.message);
    }
  };

  // Update a todo
  const updateTodo = async () => {
    try {
      const response = await axios.put(`http://localhost:3000/api/v1/todo/${selectedTodo._id}`, {
        title: selectedTodo.title,
        description: selectedTodo.description,
      });
      setTodos(
        todos.map((todo) =>
          todo._id === selectedTodo._id ? response.data.data : todo
        )
      );
      setSelectedTodo(null);
    } catch (error) {
      console.error("Error updating todo:", error.message);
    }
  };

  // Fetch todos on mount
  useEffect(() => {
    fetchTodos();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Todo App</h1>

      {/* Add Todo */}
      <div>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button onClick={addTodo}>Add Todo</button>
      </div>

      {/* Update Todo */}
      {selectedTodo && (
        <div style={{ marginTop: "10px" }}>
          <input
            type="text"
            value={selectedTodo.title}
            onChange={(e) =>
              setSelectedTodo({ ...selectedTodo, title: e.target.value })
            }
          />
          <input
            type="text"
            value={selectedTodo.description}
            onChange={(e) =>
              setSelectedTodo({
                ...selectedTodo,
                description: e.target.value,
              })
            }
          />
          <button onClick={updateTodo}>Update</button>
          <button onClick={() => setSelectedTodo(null)}>Cancel</button>
        </div>
      )}

      {/* Todo List */}
      <h2>Todos</h2>
      <ul>
        {todos.map((todo) => (
          <li key={todo._id}>
            <strong>{todo.title}</strong> - {todo.description}
            <button onClick={() => deleteTodo(todo._id)}>Delete</button>
            <button onClick={() => setSelectedTodo(todo)}>Edit</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
