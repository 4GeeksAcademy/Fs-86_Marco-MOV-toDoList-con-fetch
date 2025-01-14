import React, { useEffect, useState } from "react";
import "../../styles/index.css";

function App() {
  const [state, setState] = useState([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    getTodoList();
  }, []);

  const getTodoList = async () => {
    try {
      const response = await fetch(`https://playground.4geeks.com/todo/users/marco_ortiz`, {
        method: "GET",
      });

      if (!response.ok) {
        if (response.status === 404) {
          await createUser();
          return getTodoList();
        }
        throw new Error(`Error: ${response.status}`);
      }

      const { todos } = await response.json();
      setState(todos);
    } catch (error) {
      console.error("Error al obtener la lista de tareas:", error);
    }
  };

  const createUser = async () => {
    try {
      await fetch(`https://playground.4geeks.com/todo/users/marco_ortiz`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify([]),
      });
      console.log("Usuario creado con éxito.");
    } catch (error) {
      console.error("Error al crear el usuario:", error);
    }
  };

  const addTodoItem = async () => {
    if (!input.trim()) return;

    try {
      await fetch(`https://playground.4geeks.com/todo/todos/marco_ortiz`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ label: input, is_done: false }),
      });
      await getTodoList();
      setInput("");
    } catch (error) {
      console.error("Error al agregar la tarea:", error);
    }
  };

  const deleteTodoItem = async (todoId) => {
    try {
      await fetch(`https://playground.4geeks.com/todo/todos/${todoId}`, {
        method: "DELETE",
      });
      await getTodoList();
    } catch (error) {
      console.error("Error al eliminar la tarea:", error);
    }
  };

  return (
    <>
      <div className="body">
        <h1>To Do List</h1>
        <br />
        <div className="list-container">
          <div className="header-container">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Agregar nueva tarea"
            />
            <br />
            <button onClick={addTodoItem}>Agregar</button>
          </div>
          <br />
          <br />
          <ul>
            {state.map((item, index) => (
              <li key={index}>
                {item.label}{" "}
                <button className="delete-button" onClick={() => deleteTodoItem(item.id)}>
                  x
                </button>
              </li>
            ))}
          </ul>
          <p>{state.length} Items to do</p>
        </div>
      </div>
    </>
  );
}

export default App;
