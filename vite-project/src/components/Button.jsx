import React from 'react';

export default function Button({ type, onSubmit, value, classname}) {


    return(
        <button 
        className={classname}
            onClick={onSubmit}
            type={type}
            > {value}
        </button>
    );

}