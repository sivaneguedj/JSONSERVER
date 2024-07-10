import React from 'react';

const SearchItemPost = ({ search, setSearch }) => {
    return (
        <form>
            <input
                type="text"
                placeholder="Search"
                value={search}
                onChange={setSearch}
            />
        </form>
    );
};

export default SearchItemPost;
