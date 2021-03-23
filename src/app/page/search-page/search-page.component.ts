import { Component, OnInit } from '@angular/core';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  map,
  switchMap,
} from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

import { ApiConstants, SearchTypes } from '../../../common/Constants';
import { of, Subject } from 'rxjs';
import { MovieService } from 'src/app/service/movie.service';
import { TvShowService } from 'src/app/service/tv-show.service';

@Component({
  selector: 'app-search-page',
  templateUrl: './search-page.component.html',
  styleUrls: ['./search-page.component.css'],
})
export class SearchPageComponent implements OnInit {
  landscapeEmpty = 'assets/landscapeEmpty.jpg';
  portraitEmpty = 'assets/portraitEmpty.jpg';
  topRatedResults = [];
  searchResults = [];

  searchType: string = SearchTypes.MOVIE;
  private searchTerms = new Subject<string>();
  searchTerm: string = '';

  isFetching: boolean = true;
  loadedResultsCount: number = 0;
  finishedLoadingItems: boolean = false;

  get displayItems(): any[] {
    return this.searchTerm?.length > 3
      ? this.searchResults
      : this.topRatedResults;
  }

  fetchResults() {
    return this.searchTerm?.length > 3
      ? this.fetchSearchResults()
      : this.fetchTopRatedResults();
  }

  constructor(
    private movieService: MovieService,
    private tvShowService: TvShowService
  ) {}

  ngOnInit() {
    this.fetchResults();
    this.searchTerms
      .pipe(
        debounceTime(600),
        distinctUntilChanged(),
        catchError((error) => {
          return of([]);
        })
      )
      .subscribe(() => {
        this.resetLoadingStatuses();
        this.fetchResults();
      });
  }

  resetLoadingStatuses() {
    this.loadedResultsCount = 0;
    this.finishedLoadingItems = false;
  }

  onMovieSearch() {
    this.resetLoadingStatuses();
    this.searchType = SearchTypes.MOVIE;
    this.fetchResults();
  }

  onTvShowSearch() {
    this.resetLoadingStatuses();
    this.searchType = SearchTypes.TV_SHOW;
    this.fetchResults();
  }

  onSearchTermChange(searchTerm: string) {
    this.searchTerms.next(searchTerm);
  }

  onLoad() {
    this.loadedResultsCount++;
    if (
      !this.isFetching &&
      this.loadedResultsCount === this.displayItems.length
    ) {
      this.finishedLoadingItems = true;
    }
  }

  getTopRatedResults() {
    switch (this.searchType) {
      case SearchTypes.MOVIE: {
        return this.movieService.getTopRatedMovies();
      }
      case SearchTypes.TV_SHOW: {
        return this.tvShowService.getTopRatedTvShows();
      }
      default: {
        return of([]);
      }
    }
  }

  getSearchResults() {
    switch (this.searchType) {
      case SearchTypes.MOVIE: {
        return this.movieService.searchMoviesByTerm(this.searchTerm);
      }
      case SearchTypes.TV_SHOW: {
        return this.tvShowService.searchTvShowsByTerm(this.searchTerm);
      }
      default: {
        return of([]);
      }
    }
  }

  fetchSearchResults() {
    this.isFetching = true;
    this.getSearchResults().subscribe((response: any) => {
      this.searchResults = response.results;
      this.isFetching = false;
    });
  }

  fetchTopRatedResults() {
    this.isFetching = true;
    this.getTopRatedResults().subscribe((response: any) => {
      this.topRatedResults = response.results;
      this.isFetching = false;
    });
  }
}
