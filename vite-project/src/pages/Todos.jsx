import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Button from "/src/components/Button.jsx";
import EditTodoForm from "/src/components/EditTodoForm.jsx";
import Fetch from "/src/fetch.jsx";
import style from '/src/styles/Home.module.css';

const Todos = () => {
    
  
    //const { userId } = localStorage.getItem('users');
    const { userId } =  useParams();
    const [filterOption, setFilterOption] = useState('serial');
    const [searchTerm, setSearchTerm] = useState('');
    const [searchById, setSearchById] = useState(false);
    const [searchByCriteria, setSearchByCriteria] = useState(false);
    const [editTodo, setEditTodo] = useState(null);
    const [addTodo, setAddTodo] = useState(false);
    const [todoKey, settodoKey] = useState();
    const [title, setTitle] = useState('');
    const [completed, setCompleted] = useState(false);
    const actualUser = JSON.parse(localStorage.getItem('user')) || {};

    // Fetch all todos data
    const { data: todos = [], loading , setData: setTodos} = Fetch('todos/');

        
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
      setEditTodo(todo);
    };



    // Handle Add todo
    const handleSaveAddTodo = async (e) => {
      e.preventDefault();
      try {

          const maxId = todos.reduce((max, todo) => Math.max(max, parseInt(todo.id)), 0);
          const newId = maxId + 1;

          const newTodo = {
              userId: parsedUserId,
              id: newId,
              title: title,
              completed: completed,
          };

          const response = await fetch('http://localhost:3500/todos', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify(newTodo),
          });

          if (!response.ok) {
              throw new Error('Failed to add todo');
          }

          const addedTodo = await response.json();
          setTodos([...todos, addedTodo]);
          setAddTodo(false);
          setTitle('');
          setCompleted(false);
      } catch (error) {
          console.error('Error adding todo:', error);
      }
  };


    // Handle Save Add
    const handleAddTodo = () => {
      setAddTodo(true);
  };


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
        <header>
        <h1 >{actualUser.name}</h1>
        </header>
        <h1>Todos</h1>
        <form className={style.bar}>
        <div className={style.filteroptions}>

          <div className={style.filterselect}>
            <label htmlFor="filter">Sort by:</label>
            <select id="filter" value={filterOption} onChange={handleFilterChange}>
              <option value="serial">Serial</option>
              <option value="completed">Completed</option>
              <option value="alphabetical">Alphabetical</option>
              <option value="random">Random</option>
            </select>
          </div>


          <div className={style.searchbarContainer}>
           <div className={style.searchbar}>
           <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={handleSearch}
            />

          <Button type="button" onClick={handleSearchTodo} value="Search" className={style.searchbutton} />

           </div>
            <div className={style.checkboxes}>
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
          </div>

          <Button type="button" onClick={handleAddTodo} value="Add" className={style.searchbutton}/>
        </div>

      </form>
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
                    <form className={style['add-form']} onSubmit={handleSaveAddTodo}>
                        <h3>Add Todo</h3>
                        <p>
                            <label htmlFor='title'>Title:</label>
                            <textarea
                                id='title'
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder='Title'
                                required
                            />
                        </p>
                        <p>
                            <label htmlFor='completed'>
                                Completed:
                            </label>
                            <input
                                id='completed'
                                type="checkbox"
                                checked={completed}
                                onChange={(e) => setCompleted(e.target.checked)}
                            />
                        </p>
                        <button type='submit'>Save</button>
                        <button type='button' onClick={handleCancelAdd}>Cancel</button>
                    </form>
                </Modal>
            )}
        <div className={style.todosgrid}>
          {filteredTodos.length > 0 ? (
            filteredTodos.map((todo, index) => (
              <div key={todo.id} className={style.usertodo}>
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
                <button onClick={() => handleEditTodo(todo)} className={style.editDelete}>Edit</button>
                <button onClick={() => handleDeleteTodo(todo.id) } className={style.editDelete}>Delete</button>
              </div>
            ))
          ) : (
            <p>No todos found for this user.</p>
          )}
        </div>            
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
