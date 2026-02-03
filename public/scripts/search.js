import { displayPage, createMovieCards, updatePagination } from "./catalog.js";

// A simple debounce function to limit API calls
let originalMovies = [];

export function initSearch(allMovies) {
    originalMovies = allMovies;
    const searchInput = document.getElementById('search-input');

    //add event listener for search input
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        filteredMovies(searchTerm);
    });
}

function filteredMovies(searchTerm) {
    //Display normal catalog without pagination if no input is provided
    if (searchTerm === '') {
        displayPage(1);
        return;
    }

    //Use filter function to return movies that match the inputed genre or movie name
    const filtered = originalMovies.filter(movie => {
        const name = movie.name.toLowerCase() || '';
        const genres = (movie.genres || []).map(g => g.toLowerCase()).join(' ');

        return name.includes(searchTerm) || genres.includes(searchTerm);
    })

    // Display filtered results without pagination
    createMovieCards(filtered);
    updatePagination(filtered.length);
}