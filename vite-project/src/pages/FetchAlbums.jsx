// Fetch.jsx
import { useState, useEffect } from 'react';

const API_URL = "jsonplaceholder.typicode.com/";

const Fetch = (typeRequest) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
 
    useEffect(() => {
        const fetchItems = async () => {
            try {
                const encodedTypeRequest = encodeURIComponent(typeRequest);
                const response = await fetch(`${API_URL}${encodedTypeRequest}`);
                const data = await response.json();
                setData(data);
                setLoading(false);
            } catch (error) {
                console.error('Failed to fetch data:', error);
                setLoading(false);
            }
        };

        fetchItems();
    }, [typeRequest]);

    return { data, loading };
};

export default Fetch;
