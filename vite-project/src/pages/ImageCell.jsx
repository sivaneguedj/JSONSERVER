import { useState, useEffect } from 'react';

const ImageCell = ({ url, photo, onLoad, onDelete, onUpdate }) => {
    const [loaded, setLoaded] = useState(false);
    const [error, setError] = useState(false);
    const imageMargin = 10;
    const imageSize = (window.innerWidth - 5 * imageMargin) / 4;

    useEffect(() => {
        if (loaded) {
            onLoad();
        }
    }, [loaded]); 

    return (
        <div style={{
            width: imageSize,
            height: imageSize,
            marginRight: imageMargin,
            marginBottom: imageMargin,
            backgroundColor: '#EFEFEF',
            display: 'inline-block',
            position: 'relative'
        }}>
            {!error && (
                <img
                    src={url}
                    alt="photo"
                    style={{ width: '100%', height: '100%', display: loaded ? 'block' : 'none' }}
                    onLoad={() => setLoaded(true)}
                    onError={() => { setError(true); setLoaded(true); }}
                />
            )}
            {!loaded && <div>Loading...</div>}
            {error && (
                <div style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#EFEFEF',
                    color: 'red'
                }}>
                    Problem with loading
                </div>
            )}
            <div>
                <button onClick={() => onDelete(photo.id)}>Delete</button>
            </div>
        </div>
    );
};

export default ImageCell;
