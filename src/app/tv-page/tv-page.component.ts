import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';
import { ApiConstants, ImageConstants } from 'src/common/Constants';

@Component({
  selector: 'app-tv-page',
  templateUrl: './tv-page.component.html',
  styleUrls: ['./tv-page.component.css']
})
export class TvPageComponent implements OnInit {
  serie: any = {
    id: 0
  };
  relatedSeries = [];

  constructor(private http: HttpClient, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.params.subscribe((params)=>{
     this.serie.id = params.serieId;
     this.fetchSerieById();

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

  fetchRelatedSeries = () => {
    const { API_ROOT_URL, API_KEY, IMAGE_ROOT_URL } = ApiConstants;
    const firstWordOfTitle = this.extractFirstWord(this.serie.title);
    const serieApiUrl = `${API_ROOT_URL}/search/tv?api_key=${API_KEY}&language=en-US&page=1&include_adult=false&query=${firstWordOfTitle}`;
    this.http.get(serieApiUrl).pipe(map((response: any)=>{
      for(let result of response.results){
        result.portrait = result.poster_path !== null ? IMAGE_ROOT_URL + result.poster_path : ImageConstants.PORTRAIT_EMPTY;
        result.landscape = result.backdrop_path !== null ? IMAGE_ROOT_URL + result.backdrop_path : ImageConstants.LANDSCAPE_EMPTY;
        result.title = result.original_name || result.title;
      }
      return response;
    })).subscribe((httpResponse: any) => {
      if (httpResponse?.results) {
        const RELATED_SERIES_SIZE = 3;
        this.relatedSeries = httpResponse.results
        .filter((related) => related.id !== this.serie.id)
        .slice(0, RELATED_SERIES_SIZE);
      }
    });
  }
 

  fetchSerieById(serieId?) {
    const { API_ROOT_URL, API_KEY, IMAGE_ROOT_URL } = ApiConstants;
    serieId = serieId || this.serie.id;
    const serieApiUrl = `${API_ROOT_URL}/tv/${serieId}?api_key=${API_KEY}`;

    this.http.get(serieApiUrl).pipe(map((result: any)=>{
      result.portrait = result.poster_path !== null ? IMAGE_ROOT_URL + result.poster_path : ImageConstants.PORTRAIT_EMPTY;
      result.landscape = result.backdrop_path !== null ? IMAGE_ROOT_URL + result.backdrop_path : ImageConstants.LANDSCAPE_EMPTY;
      result.title = result.original_name || result.title;
      return result;
    })).subscribe((httpResponse: any) => {
      if (httpResponse) {
        this.serie = httpResponse;
        this.fetchRelatedSeries();
      }
    });
  }

  onRelatedSerieClick = () => {
    this.scrollWindowToTop();
  }
}
