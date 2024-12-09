// app/pages/MainPage.js

/**
 * Main Page Module
 * Renders the main page for the Telegram Mini App.
 */
const MainPage = {
    /**
     * Render the main page into the given container element.
     * @param {HTMLElement} container - The container to render the main page into.
     */
    render(container) {
        // Clear existing content
        container.innerHTML = '';

        // Create page elements
        const header = document.createElement('h1');
        header.textContent = 'Welcome to the Music Platform';

        const description = document.createElement('p');
        description.textContent = 'Earn tokens while listening to your favorite tracks!';

        const startButton = document.createElement('button');
        startButton.textContent = 'Start Listening';
        startButton.onclick = () => {
            alert('Let’s get started!');
            // Add further navigation logic here
        };

        // Append elements to the container
        container.appendChild(header);
        container.appendChild(description);
        container.appendChild(startButton);
    },
};

export default MainPage;
