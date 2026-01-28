
async function deleteMovie(event) {
    const movieId = event.target.getAttribute('data-movie-id');

    const card = event.target.closest('.card');

    const movieName = card.querySelector('#movieName').textContent;
    if (confirm(`Are you sure you want to remove ${movieName} from your watchlist?`)) {
        try {
            const response = await axios.delete(`/api/watchlist/${movieId}`);
            if(response.status === 200) {
                location.reload(); // Reload page to update view
            }
            loadWatchList();
        } catch(error) {
            console.error('Error deleting movie:', error);
        }
    }
}

async function updateMovie(event) {
    const movieId = event.target.getAttribute('data-movie-id');

    const card = event.target.closest('.card');

    const movieName = card.querySelector('#movieName').textContent;

    try {
        const response = await axios.put(`/api/watchlist/${movieId}`);
        if(response.status === 200) {
            alert(`${movieName} was sucessfully updated on your watchlist`);
        }

    } catch(error) {
        console.error('Error deleting movie:', error.message);
    }
}