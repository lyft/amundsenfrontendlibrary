import axios, { AxiosResponse } from 'axios';

import { AnnouncementPost } from 'interfaces';

export type AnnouncementsAPI = {
  msg: string;
  posts: AnnouncementPost[];
};

export function getAnnouncements() {
  return axios({
    method: 'get',
    url: '/api/announcements/v0/',
  })
    .then((response: AxiosResponse<AnnouncementsAPI>) => {
      const { data, status } = response;

      return {
        posts: data.posts,
        statusCode: status,
      };
    })
    .catch((e) => {
      const { response } = e;
      const statusCode = response ? response.status || 500 : 500;

      return Promise.reject({
        posts: [],
        statusCode,
      });
    });
}
