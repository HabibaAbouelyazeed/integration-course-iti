import { useEffect, useState } from "react";
import { server } from "../Config/axios.config";

const getAllTodos = (query) => server.get('/todos',{params:{q:query}}).then((data) => data.data);

const Todolist = () => {
  const [todos, setTodos] = useState([]);
  const [taskName, setTaskName] = useState([]);

  const toDoList = async (query = '') => {
    const res = await getAllTodos(query);
    setTodos(res);
  };

  useEffect(() => {
    toDoList();
  }, []);

  const handleChange = (e) => {
    setTaskName(e.target.value);
  };

  const handleDelete = (id) => {
    server.delete(`/todos/${id}`).then((data) => {
      if (data.status === 200) {
        toDoList();
      }
    });
  };
  const handleEdit = (content) => {
    if(!!content.isCompleted){
      server.patch(`/todos/${content.id}`,{
        isCompleted: false,
      }).then((data) => {
        if (data.status === 200) {
          toDoList();
        }
      });
    }
  };
  const handleDone = (content) => {
    server.patch(`/todos/${content.id}`,{
      isCompleted: true,
    }).then((data) => {
      if (data.status === 200) {
        toDoList();
      }
    });
  };

  const handleSearch =  (e) =>{
    toDoList(e.target.value);
  }

  const addTask = async (e) => {
    e.preventDefault();
    if (taskName) {
      server
        .post("/todos", {
          taskName,
          isCompleted: false,
        })
        .then(() => {
          setTaskName("");
          toDoList();
        });
    }
  };

  return (
    <div className="todolist">
      <div className="search">
        <input type="text" placeholder="Search ex: todo 1" onChange={handleSearch}/>
      </div>
      <form className="addTask" onSubmit={addTask}>
        <input
          type="text"
          onChange={handleChange}
          placeholder="Add a task........"
        />
        <button className="addtask-btn">Add Task</button>
      </form>
      <div className="lists">
        {todos?.map((todo, id) => (
          <div
            key={id}
            className={`list ${todo.isCompleted ? "completed" : ""}`}>
            <p> {todo.taskName}</p>
            <div className="span-btns">
              {!todo.isCompleted && (
                <span onClick={() => handleDone(todo)} title="completed">
                  ✓
                </span>
              )}
              <span
                className="delete-btn"
                onClick={() => handleDelete(todo.id)}
                title="delete">
                x
              </span>
              <span
                className="edit-btn"
                onClick={() => handleEdit(todo)}
                title="edit">
                ↻
              </span>
            </div>
          </div>
        ))}
        {!todos?.length && <h1>No Records</h1>}
      </div>
    </div>
  );
};

export default Todolist;
