import axios, { AxiosError, AxiosResponse } from 'axios';

import { SearchAllRequest, SearchResponse, SearchResourceRequest } from '../types';

export function searchAll(action: SearchAllRequest) {
  const { term, options } = action;
  let baseUrl = '/api/search/v0';
  return axios.all([
      axios.get(`${baseUrl}/table?query=${term}&page_index=${options.tableIndex || 0}`),
      axios.get(`${baseUrl}/user?query=${term}&page_index=${options.userIndex || 0}`),
    ]).then(axios.spread((tableResponse: AxiosResponse<SearchResponse>, userResponse: AxiosResponse<SearchResponse>) => {
      return {
        searchTerm: tableResponse.data.search_term,
        tables: tableResponse.data.tables,
        users: userResponse.data.users,
      }
  })).catch((error: AxiosError) => {
    // TODO - handle errors
  });
}


export function searchResource(action: SearchResourceRequest) {
  const { term, pageIndex, resource } = action;
  return axios.get(`/api/search/v0/${resource}?query=${term}&page_index=${pageIndex}`)
    .then((response: AxiosResponse) => {
      const { data } = response;
      return {
        searchTerm: data.search_term,
        tables: data.tables,
        users: data.users,
      }
    }).catch((error: AxiosError) => {
      // TODO - handle errors
    });
}
