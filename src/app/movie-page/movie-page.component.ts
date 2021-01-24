import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ɵConsole } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';

import { ApiConstants, ImageConstants } from 'src/common/Constants';

@Component({
  selector: 'app-movie-page',
  templateUrl: './movie-page.component.html',
  styleUrls: ['./movie-page.component.css']
})
export class MoviePageComponent implements OnInit {
  movie: any = {
    id: 0
  };
  relatedMovies = [];

  constructor(private http: HttpClient, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.params.subscribe((params)=>{
     this.movie.id = params.movieId;
     this.fetchMovieById();

    })
  }

  scrollWindowToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  extractFirstWord(sentence) {
    for (let i = 0; i < sentence.length; i++) {
      if (sentence[i] === " ") {
        return sentence.substring(0, i);
      }
    }
    return sentence;
  }

  fetchRelatedMovies = () => {
    const { API_ROOT_URL, API_KEY, IMAGE_ROOT_URL } = ApiConstants;
    const firstWordOfTitle = this.extractFirstWord(this.movie.title);
    const movieApiUrl = `${API_ROOT_URL}/search/movie?api_key=${API_KEY}&language=en-US&page=1&include_adult=false&query=${firstWordOfTitle}`;
    this.http.get(movieApiUrl).pipe(map((response: any)=>{
      for(let result of response.results){
        result.portrait = result.poster_path !== null ? IMAGE_ROOT_URL + result.poster_path : ImageConstants.PORTRAIT_EMPTY;
        result.landscape = result.backdrop_path !== null ? IMAGE_ROOT_URL + result.backdrop_path : ImageConstants.LANDSCAPE_EMPTY;
        result.title = result.original_name || result.title;
      }
      return response;
    })).subscribe((httpResponse: any) => {
      if (httpResponse?.results) {
        const RELATED_MOVIES_SIZE = 3;
        this.relatedMovies = httpResponse.results
        .filter((related) => related.id !== this.movie.id)
        .slice(0, RELATED_MOVIES_SIZE);
      }
    });
  }
 

  fetchMovieById(movieId?) {
    const { API_ROOT_URL, API_KEY, IMAGE_ROOT_URL } = ApiConstants;
    movieId = movieId || this.movie.id;
    const movieApiUrl = `${API_ROOT_URL}/movie/${movieId}?api_key=${API_KEY}`;

    this.http.get(movieApiUrl).pipe(map((result: any)=>{
      result.portrait = result.poster_path !== null ? IMAGE_ROOT_URL + result.poster_path : ImageConstants.PORTRAIT_EMPTY;
      result.landscape = result.backdrop_path !== null ? IMAGE_ROOT_URL + result.backdrop_path : ImageConstants.LANDSCAPE_EMPTY;
      result.title = result.original_name || result.title;
      return result;
    })).subscribe((httpResponse: any) => {
      if (httpResponse) {
        this.movie = httpResponse;
        this.fetchRelatedMovies();
      }
    });
  }

  onRelatedMovieClick = () => {
    this.scrollWindowToTop();
  }
}
