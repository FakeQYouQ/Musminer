// app/components/SearchBar.js

/**
 * Search Bar Component
 * Provides a search input and triggers a callback on search.
 */
const SearchBar = {
    /**
     * Render the search bar into the given container element.
     * @param {HTMLElement} container - The container to render the search bar into.
     * @param {Function} onSearch - Callback function to handle search input.
     */
    render(container, onSearch) {
        // Clear existing content
        container.innerHTML = '';

        // Create search bar container
        const searchBarContainer = document.createElement('div');
        searchBarContainer.className = 'search-bar';

        // Create search input
        const searchInput = document.createElement('input');
        searchInput.type = 'text';
        searchInput.placeholder = 'Search for tracks or artists...';
        searchInput.className = 'search-input';

        // Handle input changes
        searchInput.addEventListener('input', (event) => {
            const query = event.target.value.trim();
            if (onSearch && typeof onSearch === 'function') {
                onSearch(query);
            }
        });

        // Append input to container
        searchBarContainer.appendChild(searchInput);
        container.appendChild(searchBarContainer);
    },
};

export default SearchBar;
