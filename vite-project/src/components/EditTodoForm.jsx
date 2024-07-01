import React, { useState, useEffect } from 'react';
import './EditTodoForm.module.css';


const EditTodoForm = ({ todo, onSave, onCancel }) => {
    const [title, setTitle] = useState(todo.title);
    const [completed, setCompleted] = useState(todo.completed);

    const handleSave = (e) => {
        e.preventDefault();
        const updatedTodo = { ...todo, title, completed };
        onSave(updatedTodo);
    };


    const handleCancel = (e) => {
        e.preventDefault();
        onCancel();
    };

    return (
        <form className="edit-form">
            <h3>Edit Todo</h3>
            <p>
                <label htmlFor='title'> Title:</label>
                <textarea
                        id='title'
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
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
            <button onClick={handleSave}>Save</button>
            <button onClick={handleCancel}>Cancel</button>
        </form>
    );
};

export default EditTodoForm;