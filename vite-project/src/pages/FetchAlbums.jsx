import { useState, useEffect } from 'react';

const API_URL = "http://localhost:3500/";

const FetchAlbums = (typeRequest) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${API_URL}${typeRequest}`);
                if (!response.ok) {
                    throw new Error(`Erreur HTTP ! Statut : ${response.status}`);
                }
                const json = await response.json();
                setData(json);
            } catch (error) {
                console.error('Échec de la récupération des données :', error);
                setError(error); // Définir l'état d'erreur pour le traitement dans le composant
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [typeRequest]);

    return { data, loading, error, setData };
};

export default FetchAlbums;

