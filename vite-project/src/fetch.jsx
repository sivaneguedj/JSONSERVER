import React, { useState, useEffect } from 'react';


export default function Fetch( typeRequest ) {

    const API_URL = "http://localhost:3500/";
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);



    useEffect(() => {

        const fetchItems = async () => {
            try {
                const users = await fetch(`${API_URL}${typeRequest}`);
                console.log(`${API_URL}${typeRequest}`);
                const data = await users.json();
                setData(data);
                console.log(data);
            }
            catch (err) {
                console.log( err);
            }
            finally {
                setLoading(false);
            }
        };

        fetchItems();

    }, [typeRequest]);


    return(
            {data, loading}
        
    );

}