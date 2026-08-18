from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)

CORS(app)


movies = [
    {
        "id": 1,
        "title": "Avengers",
        "genre": "Action",
        "show_time": "10:00 AM"
    },
    {
        "id": 2,
        "title": "Inception",
        "genre": "Sci-Fi",
        "show_time": "2:00 PM"
    },
    {
        "id": 3,
        "title": "Interstellar",
        "genre": "Science Fiction",
        "show_time": "6:00 PM"
    }
]


@app.route("/")
def home():

    return jsonify({
        "message": "Movie Booking Backend is Running"
    })


@app.route("/movies", methods=["GET"])
def get_movies():

    return jsonify(movies)


@app.route("/book", methods=["POST"])
def book_ticket():

    data = request.get_json()

    name = data.get("name")
    movie = data.get("movie")
    tickets = data.get("tickets")

    return jsonify({
        "message": f"Booking successful! {tickets} ticket(s) for {movie} booked for {name}."
    })


if __name__ == "__main__":

    app.run(
        host="0.0.0.0",
        port=5000
    )