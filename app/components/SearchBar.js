// app/components/SearchBar.js

/**
 * Search Bar Component
 * Provides a search input, triggers a callback on search, and includes advanced features.
 */
const SearchBar = {
    /**
     * Render the search bar into the given container element.
     * @param {HTMLElement} container - The container to render the search bar into.
     * @param {Function} onSearch - Callback function to handle search input.
     */
    render(container, onSearch) {
        container.innerHTML = ''; // Очистка контейнера

        const searchBarContainer = document.createElement('div');
        searchBarContainer.className = 'search-bar';

        // Поле ввода
        const searchInput = document.createElement('input');
        searchInput.type = 'text';
        searchInput.placeholder = 'Ищите треки, исполнителей...';
        searchInput.className = 'search-input';

        // Кнопка очистки
        const clearButton = document.createElement('button');
        clearButton.textContent = 'Очистить';
        clearButton.className = 'clear-button';
        clearButton.onclick = () => {
            searchInput.value = '';
            if (onSearch) onSearch('');
        };

        // Обработка ввода текста
        searchInput.addEventListener('input', async (event) => {
            const query = event.target.value.trim();
            if (onSearch) onSearch(query);
        });

        // Поиск по Enter
        searchInput.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' && onSearch) {
                onSearch(searchInput.value.trim());
            }
        });

        // Добавляем элементы
        searchBarContainer.appendChild(searchInput);
        searchBarContainer.appendChild(clearButton);
        container.appendChild(searchBarContainer);
    },
};

export default SearchBar;
