const backendURL = "/api";

async function loadMovies() {

    try {

        const response = await fetch(`${backendURL}/movies`);
        const movies = await response.json();

        const movieList = document.getElementById("movieList");
        const movieSelect = document.getElementById("movie");

        movieList.innerHTML = "";

        movies.forEach(movie => {

            const div = document.createElement("div");

            div.className = "movie";

            div.innerHTML = `
                <h3>${movie.title}</h3>
                <p>Genre: ${movie.genre}</p>
                <p>Show Time: ${movie.show_time}</p>
            `;

            movieList.appendChild(div);

            const option = document.createElement("option");

            option.value = movie.title;
            option.textContent = movie.title;

            movieSelect.appendChild(option);
        });

    } catch (error) {

        document.getElementById("movieList").innerHTML =
            "<p>Unable to connect to backend.</p>";

    }
}


document.getElementById("bookingForm").addEventListener("submit",
    async function(event) {

        event.preventDefault();

        const name = document.getElementById("name").value;
        const movie = document.getElementById("movie").value;
        const tickets = document.getElementById("tickets").value;

        const response = await fetch(`/api/book`, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                name: name,
                movie: movie,
                tickets: tickets
            })
        });

        const result = await response.json();

        document.getElementById("message").textContent =
            result.message;

    });


loadMovies();