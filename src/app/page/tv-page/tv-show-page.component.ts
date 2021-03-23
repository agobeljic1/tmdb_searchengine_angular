import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';
import { ApiConstants, ImageConstants } from 'src/common/Constants';

@Component({
  selector: 'app-tv-show-page',
  templateUrl: './tv-show-page.component.html',
  styleUrls: ['./tv-show-page.component.css'],
})
export class TvShowPageComponent implements OnInit {
  tvShow: any = {
    id: 0,
  };
  relatedTvShows = [];

  constructor(private http: HttpClient, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.tvShow.id = params.id;
      this.fetchTvShowById();
    });
  }

  scrollWindowToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  extractFirstWord(sentence) {
    for (let i = 0; i < sentence.length; i++) {
      if (sentence[i] === ' ') {
        return sentence.substring(0, i);
      }
    }
    return sentence;
  }

  fetchRelatedTvShows = () => {
    const { API_ROOT_URL, API_KEY, IMAGE_ROOT_URL } = ApiConstants;
    const firstWordOfTitle = this.extractFirstWord(this.tvShow.title);
    const tvShowApiUrl = `${API_ROOT_URL}/search/tv?api_key=${API_KEY}&language=en-US&page=1&include_adult=false&query=${firstWordOfTitle}`;
    this.http
      .get(tvShowApiUrl)
      .pipe(
        map((response: any) => {
          for (let result of response.results) {
            result.portrait =
              result.poster_path !== null
                ? IMAGE_ROOT_URL + result.poster_path
                : ImageConstants.PORTRAIT_EMPTY;
            result.landscape =
              result.backdrop_path !== null
                ? IMAGE_ROOT_URL + result.backdrop_path
                : ImageConstants.LANDSCAPE_EMPTY;
            result.title = result.original_name || result.title;
          }
          return response;
        })
      )
      .subscribe((httpResponse: any) => {
        if (httpResponse?.results) {
          const RELATED_TV_SHOWS_SIZE = 3;
          this.relatedTvShows = httpResponse.results
            .filter((related) => related.id !== this.tvShow.id)
            .slice(0, RELATED_TV_SHOWS_SIZE);
        }
      });
  };

  fetchTvShowById(tvShowId?) {
    const { API_ROOT_URL, API_KEY, IMAGE_ROOT_URL } = ApiConstants;
    tvShowId = tvShowId || this.tvShow.id;
    const tvShowApiUrl = `${API_ROOT_URL}/tv/${tvShowId}?api_key=${API_KEY}`;

    this.http
      .get(tvShowApiUrl)
      .pipe(
        map((result: any) => {
          result.portrait =
            result.poster_path !== null
              ? IMAGE_ROOT_URL + result.poster_path
              : ImageConstants.PORTRAIT_EMPTY;
          result.landscape =
            result.backdrop_path !== null
              ? IMAGE_ROOT_URL + result.backdrop_path
              : ImageConstants.LANDSCAPE_EMPTY;
          result.title = result.original_name || result.title;
          return result;
        })
      )
      .subscribe((httpResponse: any) => {
        if (httpResponse) {
          this.tvShow = httpResponse;
          this.fetchRelatedTvShows();
        }
      });
  }

  onRelatedTvShowClick = () => {
    this.scrollWindowToTop();
  };
}
