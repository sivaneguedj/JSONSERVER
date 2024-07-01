import React, { useState } from 'react';
//import './AddTodoForm.module.css';

const AddTodoForm = ({ onSave, onCancel }) => {
    const [title, setTitle] = useState('');
    const [completed, setCompleted] = useState(false);

    const handleSave = (e) => {
        e.preventDefault();
        const newTodo = { title, completed };
        onSave(newTodo);
    };

    const handleCancel = (e) => {
        e.preventDefault();
        onCancel();
    };

    return (
        <form className="add-form">
            <h3>Add Todo</h3>
            <p>
                <label htmlFor='title'>Title:</label>
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

export default AddTodoForm;
