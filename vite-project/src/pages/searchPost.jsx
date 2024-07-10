
const SearchPost = ({ search, setSearch }) => {
    return (
        <form className="searchForm" onSubmit={(e) => e.preventDefault()}>
            <label htmlFor="search">Search</label>
            <input
                id='search'
                type='text'
                role='searchbox'
                placeholder='Search Post'
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />
        </form>
    );
};

export default SearchPost;