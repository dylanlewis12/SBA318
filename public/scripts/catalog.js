import { loadMovies } from '../data/movieData.js';

let allMovies = [];
let currentPage = 1;
const moviesPerPage = 20;

async function viewCatalog() {
    allMovies = await loadMovies();
    displayPage(1);
}

function displayPage(pageNum) {
    //page 1: start = 0, end = 20 (shows movies 0-19)
    //page 2: start = 20, end = 40 (shows movies 20-39)
    //page 3: start = 40, end = 60 (shows movies 40-59)
    const start = (pageNum - 1) * moviesPerPage;
    const end = start + moviesPerPage;
    const pageMovies = allMovies.slice(start, end); //Extracts 20 movies for that page
    
    createMovieCards(pageMovies); //Displays those 20 movie cards
    updatePagination(allMovies.length); //Updates page button (1, 2, 3, etc.)
}

function createMovieCards(movies) {
    // Render cards to .catalog-container
    const genreColors = {
        'Drama': '#E74C3C',
        'Action': '#C0392B',
        'Comedy': '#F39C12',
        'Thriller': '#2C3E50',
        'Horror': '#8B008B',
        'Romance': '#E91E63',
        'Sci-Fi': '#3498DB',
        'Fantasy': '#9B59B6',
        'Adventure': '#27AE60',
        'Mystery': '#34495E',
        'Crime': '#95A5A6',
        'Animation': '#1ABC9C',
        'Documentary': '#7F8C8D',
        'Family': '#F1C40F',
        'History': '#D35400'
    };

    const catalogContainer = document.querySelector('.catalog-container');
    catalogContainer.innerHTML = ''; // Clear previous cards

    try {
        movies.forEach(movie => {
            const card = document.createElement('div');
            card.className = 'card';
            card.style.background = "#1a2847";
            card.style.borderColor = "#3466AF";

            const movieName = movie.name || 'N/A';
            const moviePoster = movie.image?.medium || '../placeholder.jpg';
            const movieRating = movie.rating?.average || 'N/A';
            const movieStatus = movie.status || 'N/A';
            const movieSummary = movie.summary?.replace(/<[^>]*>/g, '') || 'No summary available';
            const movieGenres = movie.genres || []; 

            // Create genre tags with colors
            const genreHTML = movieGenres.map(genre => {
                const color = genreColors[genre] || '#95A5A6';
                return `<span class="genre-tag" style="background-color: ${color};">${genre}</span>`;
            }).join('');

            card.innerHTML = `
                <div class="card-image">
                    <img src="${moviePoster}" alt="${movieName}">
                </div>
                <div class="card-body">
                    <p id="movieName"><strong>${movieName}</strong></p>
                    <div id="movieGenre" class="genres-container">${genreHTML}</div>
                    <p id="movieRating">⭐ ${movieRating}/10</p>
                    <p id="movieStatus">Status: ${movieStatus}</p>
                </div>
                <div class="card-summary">
                    <p id="movieSummary">${movieSummary}</p>
                </div>
                <button class="add-to-watchlist" data-movie-id="${movie.id}">Add to Watchlist</button>
            `;

            catalogContainer.appendChild(card);

        });
    } catch(error) {
        console.error("Error creating movie catalog:", error.message);
    }
}

function updatePagination(totalMovies) {
    const totalPages = Math.ceil(totalMovies / moviesPerPage);
    const paginationContainer = document.querySelector('.pagination');
    
    paginationContainer.innerHTML = ''; // Clear previous buttons
    
    // Previous button
    const prevBtn = document.createElement('button');
    prevBtn.textContent = 'Previous';

    //Disable previous page button if user is on the first page
    if(currentPage === 1) {
        prevBtn.disabled = true;
    }

    prevBtn.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            displayPage(currentPage);
        }
    });
    paginationContainer.appendChild(prevBtn);
    
    // Page number buttons
    for (let i = 1; i <= totalPages; i++) {
        const pageBtn = document.createElement('button');
        pageBtn.textContent = i;
        pageBtn.className = 'pagination-number';
        
        if (i === currentPage) {
            pageBtn.classList.add('active');
        }
        
        pageBtn.addEventListener('click', () => {
            currentPage = i;
            displayPage(currentPage);
        });
        
        paginationContainer.appendChild(pageBtn);
    }
    
    // Next button
    const nextBtn = document.createElement('button');
    nextBtn.textContent = 'Next';
    
    //Disable previous next button if user is on the last page
    if(currentPage === totalPages) {
        nextBtn.disabled = true;
    }

    nextBtn.addEventListener('click', () => {
        if (currentPage < totalPages) {
            currentPage++;
            displayPage(currentPage);
        }
    });
    paginationContainer.appendChild(nextBtn);
}

async function handleAddList(event) {
    if (event.target.classList.contains('add-to-watchlist')) {
            const movieId = event.target.getAttribute('data-movie-id');
            const card = event.target.closest('.card');

            const movieName = card.querySelector('#movieName').textContent;
            const movieSummary = card.querySelector('#movieSummary').textContent;
            const movieRating = card.querySelector('#movieRating').textContent;
            const movieImage = card.querySelector('.card-image img').src;

            const movieGenres = Array.from(card.querySelectorAll('.genre-tag'))
            .map(tag => tag.textContent);

        try {
            const data = {
                movieId,
                movieName,
                movieRating,
                movieGenres,
                movieImage,
                movieSummary

            };
            const response = await axios.post('/api/watchlist', data);
            console.log(response.data);
            
            if (response.status === 201) {
                console.log('Request was successful and status is OK');
                //Disable add button for selected card after post
                alert(`${movieName} was added to your watchlist✅!`);
                event.target.disabled = true;
                event.target.textContent = 'Added ✓';
            } else if (response.status === 400) {
                console.log('Error: An item with this id already exists in your database❌.');
                alert(`This movie is already in your watch list. Try again.`);
            } else {
                alert(`An error occured while trying to the movie to your watchlist.`);
            }

        } catch(error) {
            console.error('Error adding to watchlist:', error);
        }
    }
}
document.addEventListener('click',handleAddList)

viewCatalog();

export {updatePagination, displayPage, createMovieCards };