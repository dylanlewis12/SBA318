let movieData = [];

export async function loadMovies() {
    try {
        // Generate a random number between 1 and 1025 (valid Pokémon range)
        const API_URL = 'https://api.tvmaze.com/shows';
        let response = await axios.get(API_URL);

        let result = response.data;

        movieData = result;

        console.log(movieData);
        return movieData;

    } catch(error) {
        console.log('Error fetching movie collection:', error.message);
        return [];
    }
}
