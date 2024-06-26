import axios from 'axios';
import fs from 'fs';

async function fetchData() {
    try {
        const post = await axios.get("https://jsonplaceholder.typicode.com/posts");
        const comment = await axios.get("https://jsonplaceholder.typicode.com/comments");
        const album = await axios.get("https://jsonplaceholder.typicode.com/albums");
        const photo = await axios.get("https://jsonplaceholder.typicode.com/photos");
        const todo = await axios.get("https://jsonplaceholder.typicode.com/todos");
        const user = await axios.get("https://jsonplaceholder.typicode.com/users");

        const data = {
            posts: post.data,
            comments: comment.data,
            albums: album.data,
            photos: photo.data,
            todos: todo.data,
            users: user.data
        };

        if (!data) {
            throw new Error('Data not fetched');
        }

        fs.writeFileSync('db.json', JSON.stringify(data, null, 2));
        console.log('Data fetched and saved to db.json');
    } catch (err) {
        console.log('Error fetching data:', err);
    }
}

fetchData();
