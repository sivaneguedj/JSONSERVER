import { useState, useEffect } from 'react';

const API_URL = "http://localhost:3500/";

const FetchAlbums = (typeRequest) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
 
    useEffect(() => {
        const fetchItems = async () => {
            try {
               
                const response = await fetch(`${API_URL}${typeRequest}`);
                const data = await response.json();
                setData(data);
                console.log(data);
            } catch (error) {
                console.error('Failed to fetch data:', error);
                
            }
            finally{
                setLoading(false);
            }
        };

        fetchItems();
    }, [typeRequest]);

    return { data, loading,setData };
};

export default FetchAlbums;

