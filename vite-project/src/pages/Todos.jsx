import React from 'react';
import { useParams } from 'react-router-dom';


const Todos = () => {
    const { userId } = useParams();

    const { data: todos, loading } = Fetch( 'todos/' );

  
    return (
      <div>
        <h1>Todos for User {userId}</h1>
      </div>
    );
  };

export default Todos;