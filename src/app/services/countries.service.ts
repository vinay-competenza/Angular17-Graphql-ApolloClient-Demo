import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { Countries } from '../models/countries.model';
import { Apollo, gql } from 'apollo-angular';
import { Country } from '../models/country.model';


const baseUrl = 'http://localhost:8080/api/test';
const COUNTRIES = gql`
  {
    countries {
      name
      capital
      currency
      emoji
      phone
      
    }
  }
`;
const ADD_COUNTRY = gql`
  mutation AddCountry($input: Country!) {
    addCountry(input: $input) {
      name
      capital
      currency
      emoji
      phone     
    }
  }
`;

const DELETE_COUNTRY = gql`
  mutation DeleteCountry($name: String!) {
    deleteCountry(name: $name)

  }
`;

const UPDATE_COUNTRY = gql`
  mutation UpdateCountry($name: String!, $input: CountryInput!) {
    updateCountry(name: $name, input: $input) {
      name
      capital
      currency
      emoji
      phone      
    }
  }
`;
@Injectable({
  providedIn: 'root',
})
export class CountriesService {
  constructor(private http: HttpClient, private apollo: Apollo) { }
  dataChange: BehaviorSubject<Country[]> = new BehaviorSubject<Country[]>([]);
  dialogData: any;
  countries: any;

  getCountries(): Observable<Country[]> {
    return this.apollo
      .watchQuery<any>({
        query: COUNTRIES,
      })
      .valueChanges.pipe(map((result) =>
       result.data.countries
      ));
  }

  addCountry(input: Country): Observable<Country> {

    const data: any = this.apollo.client.cache.readQuery({ query: COUNTRIES });
      this.apollo.client.cache.writeQuery({
          query: COUNTRIES,
        data: { countries: [...data.countries, input] },
      });
    return data;

    ////Below code Usefull with Actual GraphQL Database
    //return this.apollo.mutate<any>({
    //  mutation: ADD_COUNTRY,
    //  variables: {
    //    input: input,
    //  },
    //  update: (cache, { data: { addCountry } }) => {
    //    const data: any = cache.readQuery({ query: COUNTRIES });
    //    cache.writeQuery({
    //      query: COUNTRIES,
    //      data: { countries: [...data.countries, addCountry] },
    //    });
    //  },
    //}).pipe(map(result => result.data.addCountry));
  }


  deleteCountry(name: string): Observable<any> {

    const data: any = this.apollo.client.cache.readQuery({ query: COUNTRIES });
    const filteredCountries = data.countries.filter(
      (country: any) => country.name !== name
    );

    this.apollo.client.cache.writeQuery({
      query: COUNTRIES,
      data: { countries: filteredCountries },
    });
    return data;

    ////Below code Usefull with Actual GraphQL Database
    //return this.apollo.mutate<any>({
    //  mutation: gql`
    //    mutation DeleteCountry($name: String!) {
    //      deleteCountry(name: $name) {
    //        success
    //        message
    //      }
    //    }
    //  `,
    //  variables: {
    //    name: name
    //  },
    //  update: (cache) => {
    //    const data: any = cache.readQuery({ query: COUNTRIES });
    //    const filteredCountries = data.countries.filter(
    //      (country: any) => country.name !== name
    //    );

    //    cache.writeQuery({
    //      query: COUNTRIES,
    //      data: { countries: filteredCountries },
    //    });
    //  },
    //}).pipe(map(result =>
    //  result.data.addCountry
    //));
  }


  updateCountry(name: string, input: Country): Observable<Country> {
    
    const data: any = this.apollo.client.cache.readQuery({ query: COUNTRIES });

    const filteredCountries = data.countries.map((t: Country) => {
      if (t.name === name) {
        return { name: input.name, capital: input.capital, currency: input.currency, emoji: input.emoji, phone: input.phone };
      } else {
        return t;
      }
    });

    this.apollo.client.cache.writeQuery({
      query: COUNTRIES,
      data: { countries: filteredCountries },
    });
    

    return filteredCountries;

  }
  
  findByTitle(title: any): Observable<Countries[]> {
    return this.http.get<Countries[]>(`${baseUrl}?title=${title}`);
  }

  getDialogData() {
    return this.dialogData;
  }


}
