class MovieLibrary{
    constructor(){
        this.currentId = 0;
        this.list = [];
    }
    createMovie(movie){
        return `
            <div class="movie-poster" data-id=${movie.id}>
                <div class="overlay"><button class="delete">Delete</button></div>

                <div class="info">
                    <div class="rating">⭐${movie.rating}</div>
                    <div class="movie-title">${movie.title}</div>
                </div>
            </div>
        `;
    }
    sortBy(keyToSortBy, direction) {
        return this.list.sort(function(a, b) {
          if (keyToSortBy === "rating") {
            a[keyToSortBy] = +a[keyToSortBy];
            b[keyToSortBy] = +b[keyToSortBy];
          }
          if (a[keyToSortBy] > b[keyToSortBy]) {
            return direction === "up" ? 1 : -1;
          } else if (b[keyToSortBy] > a[keyToSortBy]) {
            return direction === "up" ? -1 : 1;
          }
          return 0;
        });
      }
    sortMovies(sortFilter, direction){
        let sortedMovies = this.sortBy(sortFilter, direction);

        // clear current library
        $("#library-container").empty();

        // populate library with sorted movies
        for (let movie of sortedMovies) {
            const htmlforMovie = this.createMovie(movie);
            
            $("#library-container").append(htmlforMovie);
        }

    }
    add(movie){
        // use existing movie.id or add new movie with id === mylibrary.currentId
        movie.id = movie.id ? movie.id : this.currentId;
        
        this.list.push(movie);

        let moviecard = this.createMovie(movie);

        $("#library-container").append(moviecard);
    }
    remove(currmovie){
        // index of movie
        let idx = this.list.findIndex(movie => movie.id == +$(currmovie).closest(".movie-poster").data("id"));
        
        // remove movie from movies list
        this.list.splice(idx, 1);
    }
}

class Movie{
    constructor(id, title, rating){
        this.id = id;
        this.title = title;
        this.rating = rating;
    }
}

document.addEventListener("DOMContentLoaded", function() {
    let mylibrary = new MovieLibrary();

    // submit new movie
    $("#movie-form").on("submit", function(evt) {
        evt.preventDefault();

        // create new movie with mylibrary.currentId + 1
        let title = $("#title").val();
        let rating = $("#rating").val();

        let newMovie = new Movie(++mylibrary.currentId, title, rating);

        mylibrary.add(newMovie);
    
        $("#movie-form").trigger("reset");
    });

    // sort
    $(".form-select").on('change', function(e){
        let sortFilter = this.value;
        let selectBox = e.target;
        let direction = selectBox.options[selectBox.selectedIndex].className === "asc" ? "up" : "down";

        mylibrary.sortMovies(sortFilter, direction);
    })

    // delete
    $("#library").on('click', '.delete', function(e){
        let currMovie = e.target;

        mylibrary.remove(currMovie);
        $(currMovie).closest(".movie-poster").remove();
    })

});