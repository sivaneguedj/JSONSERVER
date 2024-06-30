import React, { useState, useEffect } from 'react';


const EditTodoForm = ({ todo, onSave, onCancel }) => {
    const [title, setTitle] = useState(todo.title);
    const [completed, setCompleted] = useState(todo.completed);

    const handleSave = () => {
        onSave({ ...todo, title, completed });
    };


    const handleCancel = () => {
        onCancel();
    };

    return (
        <form className="edit-form">
            <h3>Edit Todo</h3>
            <p>
                <label>
                    Title:
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </label>
            </p>
            <label>
                Completed:
                <input
                    type="checkbox"
                    checked={completed}
                    onChange={(e) => setCompleted(e.target.checked)}
                />
            </label>
            <button onClick={handleSave}>Save</button>
            <button onClick={handleCancel}>Cancel</button>
        </form>
    );
};

export default EditTodoForm;