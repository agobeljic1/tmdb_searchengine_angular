import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { ApiConstants, ImageConstants } from 'src/common/Constants';

@Injectable({
  providedIn: 'root',
})
export class MovieService {
  constructor(private http: HttpClient) {}

  getTopRatedMovies = () => {
    const { API_ROOT_URL, API_KEY } = ApiConstants;
    return this.http
      .get(`${API_ROOT_URL}/movie/top_rated?api_key=${API_KEY}`)
      .pipe(
        map((data: any) => {
          for (let result of data.results) {
            result = this.mapMovieData(result);
          }
          return data;
        })
      );
  };

  searchMoviesByTerm = (searchTerm: string) => {
    const { API_ROOT_URL, API_KEY } = ApiConstants;

    return this.http
      .get(
        `${API_ROOT_URL}/search/movie?api_key=${API_KEY}&language=en-US&page=1&include_adult=false&query=${searchTerm}`
      )
      .pipe(
        map((data: any) => {
          for (let result of data.results) {
            result = this.mapMovieData(result);
          }
          return data;
        })
      );
  };

  getMovieById(id: number) {
    const { API_ROOT_URL, API_KEY } = ApiConstants;

    const movieApiUrl = `${API_ROOT_URL}/movie/${id}?api_key=${API_KEY}`;

    return this.http
      .get(movieApiUrl)
      .pipe(map((result: any) => this.mapMovieData(result)));
  }

  private mapMovieData = (movie: any) => {
    const { IMAGE_ROOT_URL } = ApiConstants;

    movie.portrait =
      movie.poster_path !== null
        ? IMAGE_ROOT_URL + movie.poster_path
        : ImageConstants.PORTRAIT_EMPTY;
    movie.landscape =
      movie.backdrop_path !== null
        ? IMAGE_ROOT_URL + movie.backdrop_path
        : ImageConstants.LANDSCAPE_EMPTY;
    movie.title = movie.original_name || movie.title;
    return movie;
  };
}
