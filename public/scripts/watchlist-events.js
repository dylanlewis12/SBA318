// Event listener for updating watchlist
document.addEventListener('change', async (e) => {
    if(e.target.classList.contains('watched-checkbox')) {
        const movieId = e.target.dataset.movieId;
        // Change watch from true to false based on boolean value of watched
        await updateMovie(movieId, { watched: e.target.checked });
    }
});

// Event listener for star rating
document.addEventListener('click', async (e) => {
    if(e.target.classList.contains('star')) {
        const ratingValue = e.target.dataset.value;
        const starRating = e.target.closest('.star-rating');
        const movieId = starRating.dataset.movieId;
        
        // Update visual (highlight stars)
        const allStars = starRating.querySelectorAll('.star');
        allStars.forEach((star, index) => {
            if (index < ratingValue) {
                star.classList.add('active');
            } else {
                star.classList.remove('active');
            }
        });
        
        // Update rating display
        const ratingDisplay = e.target.closest('.card-summary').querySelector('.rating-display');
        ratingDisplay.textContent = `${ratingValue}/10`;
        
        // Send to server
        await updateMovie(movieId, { myRating: parseFloat(ratingValue) });
    }
    
    // Delete button click handler
    if(e.target.classList.contains('delete-btn')) {
        const movieId = e.target.dataset.movieId;
        const movieName = e.target.closest('.card').querySelector('#movieName').textContent;
        if(confirm(`Are you sure you want to delete ${movieName} from your watchlist?`)) {
            await deleteMovie(movieId);
        }
    }
});

// Remove movie from watchlist
async function deleteMovie(movieId) {
    try {
        const response = await axios.delete(`/api/watchlist/${movieId}`);
        if(response.status === 200) {
            location.reload(); // Reload page to update view
        }
    } catch(error) {
        console.error('Error deleting movie:', error);
    }
}

// Update movie (watched status or rating)
async function updateMovie(movieId, updates) {
    try {
        const response = await axios.put(`/api/watchlist/${movieId}`, updates);
        if(response.status === 200) {
            console.log('Movie was successfully updated on your watchlist');
        }
    } catch(error) {
        console.error('Error updating movie:', error.message);
    }
}