import { Component, OnInit } from '@angular/core';
import { map } from "rxjs/operators";
import { HttpClient } from '@angular/common/http';

import { ApiConstants } from "../../common/Constants";

@Component({
  selector: 'app-search-page',
  templateUrl: './search-page.component.html',
  styleUrls: ['./search-page.component.css']
})
export class SearchPageComponent implements OnInit {

  landscapeEmpty = "assets/landscapeEmpty.jpg";
  portraitEmpty = "assets/portraitEmpty.jpg";
  topRatedResults = [];
  searchResults = [];
  searchType: string = "movie";
  searchQuery: string = "";

  isFetching: boolean = false;

  constructor(private http: HttpClient){}

  ngOnInit(){
    this.fetchResults();
  }


  onMovieSearch(){
    this.searchType = "movie";
    this.fetchResults();
  }

  onTvSearch(){
    this.searchType = "tv";
    this.fetchResults();
  }


  fetchResults(){
    if(this.searchQuery.length > 3){
      this.fetchSearchResults();
    }
    else{
      this.fetchTopRatedResults();
    }    
  }

  fetchTopRatedResults(){
    const { API_ROOT_URL, API_KEY, IMAGE_ROOT_URL } = ApiConstants;

    this.isFetching = true;
    this.http.get(`${API_ROOT_URL}/${this.searchType}/top_rated?api_key=${API_KEY}`).pipe(map((data: any)=>{
      for(let result of data.results){
        result.portrait = result.poster_path !== null ? IMAGE_ROOT_URL + result.poster_path : this.portraitEmpty;
        result.landscape = result.backdrop_path !== null ? IMAGE_ROOT_URL + result.backdrop_path : this.landscapeEmpty;
        result.title = result.original_name || result.title;
      }
      return data;
    })).subscribe((response: any)=>{
      this.topRatedResults = response.results;
      this.isFetching = false;
    });
  }

  fetchSearchResults(){
    const { API_ROOT_URL, API_KEY, IMAGE_ROOT_URL } = ApiConstants;

    this.isFetching = true;
    this.http.get(`${API_ROOT_URL}/search/${this.searchType}?api_key=${API_KEY}&language=en-US&page=1&include_adult=false&query=${this.searchQuery}`).pipe(map((data: any)=>{
      for(let result of data.results){
        result.portrait = result.poster_path !== null ? IMAGE_ROOT_URL + result.poster_path : this.portraitEmpty;
        result.landscape = result.backdrop_path !== null ? IMAGE_ROOT_URL + result.backdrop_path : this.landscapeEmpty;
        result.title = result.original_name || result.title;
      }
      return data;
    })).subscribe((response: any)=>{
      this.searchResults = response.results;
      this.isFetching = false;
    });
  }
}
