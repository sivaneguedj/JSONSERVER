import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Button from "/src/components/Button.jsx";
import EditTodoForm from "/src/components/EditTodoForm.jsx";
import AddTodoForm from "/src/components/AddTodoForm.jsx";
import Fetch from "/src/fetch.jsx";
import './Home.Module.css';

const Todos = () => {
    
  
    const { userId } = useParams();
    const [filterOption, setFilterOption] = useState('serial');
    const [searchTerm, setSearchTerm] = useState('');
    const [searchById, setSearchById] = useState(false);
    const [searchByCriteria, setSearchByCriteria] = useState(false);
    const [editTodo, setEditTodo] = useState(null);
    const [addTodo, setAddTodo] = useState(false);


    // Fetch all todos data
    const { data: todos, loading , setData: setTodos} = Fetch('todos/');

        
    // Loading
    if (loading) {
      return <div>Loading...</div>;
    }

    // todos for current user logged in
    let todosForCurrentUser = todos.filter(todo => todo.userId === parseInt(userId));   


    // Handle Filter and Search changes 
    const handleFilterChange = (e) => {
        setFilterOption(e.target.value);
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };



    // search by Id or by Criteria
    const handleSearchTodo = () => {
        let filteredTodos = todosForCurrentUser;
        if (searchById) {
            filteredTodos = filteredTodos.filter(todo => todo.id.toString().includes(searchTerm));
        }
        if (searchByCriteria) {
            filteredTodos = filteredTodos.filter(todo => todo.title.toLowerCase().includes(searchTerm.toLowerCase()));
        }
        return filteredTodos;
    };

    
    // which checkBox to check for the Search
    const handleCheckboxChange = (e) => {
        const { name, checked } = e.target;
        if (name === 'byId') {
            setSearchById(checked);
        } else if (name === 'byCriteria') {
            setSearchByCriteria(checked);
        }
    };


    // Handle Select option filter
    const filterTodos = (todos) => {
        switch (filterOption) {
            case 'serial':
                return todos;
            case 'completed':
                return todos.filter(todo => todo.completed);
            case 'alphabetical':
                return todos.sort((a, b) => a.title.localeCompare(b.title));
            case 'random':
                return todos.sort(() => Math.random() - 0.5);
            default:
                return todos;
        }
    };

    const filteredTodos = filterTodos(handleSearchTodo());



    // Handle Completed checkbox change
    const handleCompletedChange = (id) => {
      setTodos(todos.map(todo =>
          todo.id === id ? { ...todo, completed: !todo.completed } : todo
      ));
    };


    // Handle Edit todo
    const handleEditTodo = (todo) => {
      setAddTodo(true);
    };



    // Handle Add todo
    const handleAddTodo = () => {
        setAddTodo(true);
    };


    // Handle Save Add
    const handleSaveAdd = async (newTodo) => {
      try {
          const response = await fetch('http://localhost:3500/todos', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({ ...newTodo, userId: parseInt(userId) }),
          });

          if (!response.ok) {
              throw new Error('Failed to add todo');
          }

          const addedTodo = await response.json();

          // Update the state with the new todo
          setTodos([...todos, addedTodo]);

          setAddTodo(false);
      } catch (error) {
          console.error('Error adding todo:', error);
      }
  };

  // Handle Cancel Add
  const handleCancelAdd = () => {
      setAddTodo(false);
  };



  const handleSaveEdit = async (updatedTodo) => {
    console.log(updatedTodo.id);
    try {
        const response = await fetch(`http://localhost:3500/todos/${updatedTodo.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedTodo),
        });

        if (!response.ok) {
            throw new Error('Failed to update todo');
        }

        // Update the state with the edited todo
        setTodos(todos.map(todo =>
            todo.id === updatedTodo.id ? updatedTodo : todo
        ));

        setEditTodo(null);
    } catch (error) {
        console.error('Error updating todo:', error);
    }
  };


  // Handle Cancel Edit
  const handleCancelEdit = () => {
    setEditTodo(null);
  };


  
    // Handle Edit todo
    const handleDeleteTodo = async (id) => {
      try {
          const response = await fetch(`http://localhost:3500/todos/${id}`, {
              method: 'DELETE',
          });

          if (!response.ok) {
              throw new Error('Failed to delete todo');
          }

          // Update the state to remove the deleted todo
          setTodos(todos.filter(todo => todo.id !== id));
      } catch (error) {
          console.error('Error deleting todo:', error);
      }
  };


    return (
      <div>
        <h1>Todos</h1>
        <div className="filter-options">
          <div className="filter-select">
            <label htmlFor="filter">Sort by:</label>
            <select id="filter" value={filterOption} onChange={handleFilterChange}>
              <option value="serial">Serial</option>
              <option value="completed">Completed</option>
              <option value="alphabetical">Alphabetical</option>
              <option value="random">Random</option>
            </select>
          </div>
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={handleSearch}
            />
            <Button type="button" onSubmit={handleSearchTodo} value="Search" className="search-button" />
          </div>
          <div className="checkboxes">
            <label>
              <input
                type="checkbox"
                name="byId"
                checked={searchById}
                onChange={handleCheckboxChange}
              />
              by Id
            </label>
            <label>
              <input
                type="checkbox"
                name="byCriteria"
                checked={searchByCriteria}
                onChange={handleCheckboxChange}
              />
              by Criteria
            </label>
          </div>
          <Button type="button" onClick={handleAddTodo} value="Add" className="search-button" />
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
                  <input 
                      type="checkbox" 
                      checked={todo.completed}
                      onChange={() => handleCompletedChange(todo.id)}  
                  />
                  Completed
                </label>
                <button onClick={() => handleEditTodo(todo)}>Edit</button>
                <button onClick={() => handleDeleteTodo(todo.id)}>Delete</button>
              </div>
            ))
          ) : (
            <p>No todos found for this user.</p>
          )}
        </div>
        {editTodo && (
                <Modal>
                    <EditTodoForm
                        todo={editTodo}
                        onSave={handleSaveEdit}
                        onCancel={handleCancelEdit}
                    />
                </Modal>
            )}
            {addTodo && (
            <Modal>
                <AddTodoForm
                    onSave={handleSaveAdd}
                    onCancel={handleCancelAdd}
                />
            </Modal>
        )}
      </div>
    );
};

const Modal = ({ children }) => {
  return (
      <div className="modal">
          <div className="modal-content">
              {children}
          </div>
      </div>
  );
};

export default Todos;
