import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ɵConsole } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';
import { MovieService } from 'src/app/service/movie.service';

import { ApiConstants, ImageConstants } from 'src/common/Constants';

@Component({
  selector: 'app-movie-page',
  templateUrl: './movie-page.component.html',
  styleUrls: ['./movie-page.component.css'],
})
export class MoviePageComponent implements OnInit {
  movie: any = {
    id: 0,
  };
  relatedMovies = [];

  constructor(
    private movieService: MovieService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.movie.id = params.id;
      this.fetchMovieById();
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

  fetchRelatedMovies = () => {
    const firstWordOfTitle = this.extractFirstWord(this.movie.title);
    this.movieService
      .searchMoviesByTerm(firstWordOfTitle)
      .subscribe((httpResponse: any) => {
        if (httpResponse?.results) {
          const RELATED_MOVIES_SIZE = 3;
          this.relatedMovies = httpResponse.results
            .filter((related) => related.id !== this.movie.id)
            .slice(0, RELATED_MOVIES_SIZE);
        }
      });
  };

  fetchMovieById(movieId?) {
    movieId = movieId || this.movie.id;

    this.movieService.getMovieById(movieId).subscribe((response: any) => {
      if (response) {
        this.movie = response;
        this.fetchRelatedMovies();
      }
    });
  }

  onRelatedMovieClick = () => {
    this.scrollWindowToTop();
  };
}
