import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { ApiConstants, ImageConstants } from 'src/common/Constants';

@Injectable({
  providedIn: 'root',
})
export class TvShowService {
  constructor(private http: HttpClient) {}

  getTopRatedTvShows = () => {
    const { API_ROOT_URL, API_KEY } = ApiConstants;
    return this.http
      .get(`${API_ROOT_URL}/tv/top_rated?api_key=${API_KEY}`)
      .pipe(
        map((data: any) => {
          for (let result of data.results) {
            result = this.mapTvShowData(result);
          }
          return data;
        })
      );
  };

  searchTvShowsByTerm = (searchTerm: string) => {
    const { API_ROOT_URL, API_KEY } = ApiConstants;

    return this.http
      .get(
        `${API_ROOT_URL}/search/tv?api_key=${API_KEY}&language=en-US&page=1&include_adult=false&query=${searchTerm}`
      )
      .pipe(
        map((data: any) => {
          for (let result of data.results) {
            result = this.mapTvShowData(result);
          }
          return data;
        })
      );
  };

  getTvShowById(id: number) {
    const { API_ROOT_URL, API_KEY } = ApiConstants;
    const tvShowApiUrl = `${API_ROOT_URL}/tv/${id}?api_key=${API_KEY}`;

    return this.http
      .get(tvShowApiUrl)
      .pipe(map((result: any) => this.mapTvShowData(result)));
  }

  private mapTvShowData = (tvShow: any) => {
    const { IMAGE_ROOT_URL } = ApiConstants;

    tvShow.portrait =
      tvShow.poster_path !== null
        ? IMAGE_ROOT_URL + tvShow.poster_path
        : ImageConstants.PORTRAIT_EMPTY;
    tvShow.landscape =
      tvShow.backdrop_path !== null
        ? IMAGE_ROOT_URL + tvShow.backdrop_path
        : ImageConstants.LANDSCAPE_EMPTY;
    tvShow.title = tvShow.original_name || tvShow.title;
    return tvShow;
  };
}
