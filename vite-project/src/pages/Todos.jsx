import React, {useState} from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Fetch from "/src/fetch.jsx";
import './Home.Module.css';


const Todos = () => {
    //const actualUser = JSON.parse(localStorage.getItem('user')) || {};
    const { userId, todosId, albumId, postsId } = useParams();
    const [filterOption, setFilterOption] = useState('serial');
    const [searchTerm, setSearchTerm] = useState('');
    const [newTodoTitle, setNewTodoTitle] = useState('');
    const [editTodoId, setEditTodoId] = useState(null);
    const [editTodoTitle, setEditTodoTitle] = useState('');
    const [editTodoCompleted, setEditTodoCompleted] = useState(false);

    const { data: todos, loading } = Fetch( 'todos/' );

    if (loading) {
      return <div>Loading...</div>;
    }

  let todosForCurrentUser = todos.filter(todo => todo.userId === parseInt(userId));   


  const handleFilterChange = (e) => {
    setFilterOption(e.target.value);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };


const filterTodos = (todos) => {
    switch (filterOption) {
        case 'serial':
            return todos; // already sorted by serial
        case 'completed':
            return [...todos].filter(todo => todo.completed);
        case 'alphabetical':
            return [...todos].sort((a, b) => a.title.localeCompare(b.title));
        case 'random':
            return [...todos].sort(() => Math.random() - 0.5);
        default:
            return todos;
    }
};

const filteredTodos = filterTodos(todosForCurrentUser);

const handleAddTodo = () => {
  // Implement logic to add new todo
};

const handleDeleteTodo = (todoId) => {
  // Implement logic to delete todo
};

const handleEditTodo = (todoId) => {
  // Implement logic to edit todo
};

const handleUpdateTodo = () => {
  // Implement logic to update todo
};
  
return (
  <div>
    <h1>Todos</h1>
    <div className="filter-options">
      <label htmlFor="filter">Sort by:</label>
      <select id="filter" value={filterOption} onChange={handleFilterChange}>
        <option value="serial">Serial</option>
        <option value="completed">Completed</option>
        <option value="alphabetical">Alphabetical</option>
        <option value="random">Random</option>
      </select>
      <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={handleSearch}
          />
    </div>
    <div className="todos-grid">
      {filteredTodos.length > 0 ? (
        filteredTodos.map((todo, index) => (
          <div key={todo.id} className="user-todo">
            <h2>{index + 1}: {todo.title}</h2>
            <p><strong>User Id:</strong> {todo.userId}</p>
                <p><strong>N° of todo:</strong> {todo.id}</p>
                <p><strong>Title:</strong> {todo.title}</p>
                <p><strong>Completed:</strong> {todo.completed ? 'Yes' : 'No'}</p>
            <label>
              <input type="checkbox" checked={todo.completed} readOnly />
              Completed
            </label>
            <button onClick={() => handleEditTodo(todo.id)}>Edit</button>
            <button onClick={() => handleDeleteTodo(todo.id)}>Delete</button>
          </div>
        ))
      ) : (
        <p>No todos found for this user.</p>
      )}
    </div>
  </div>
);
};

export default Todos;

