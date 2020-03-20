import axios, { AxiosResponse } from 'axios';
import { Issue, CreateIssuePayload, NotificationPayload } from 'interfaces';
import { notificationsEnabled } from 'config/config-utils';

export const API_PATH = '/api/issue';
export const NOTIFICATION_API_PATH = '/api/mail/v0/notification';

export type IssuesAPI = {
  issues: {
    issues: Issue[]; 
    remaining: number;  
    remaining_url: string; 
  }
}

export type IssueApi = {
  issue: Issue; 
}

export function getIssues(tableKey: string) {
  return axios.get(`${API_PATH}/issues?key=${tableKey}`)
  .then((response: AxiosResponse<IssuesAPI>) => {
    return response.data.issues;
  });
}

export function createIssue(payload: CreateIssuePayload, notificationPayload: NotificationPayload) {
  return axios.post(`${API_PATH}/issue`, {
    key: payload.key, 
    title: payload.title, 
    description: payload.description
  })
  .then((response: AxiosResponse<IssueApi>) => {
      return response.data.issue; 
  }).then((response) => {
    if (notificationsEnabled()) {
      notificationPayload.options.data_issue_url = response.url; 
      axios.post(NOTIFICATION_API_PATH, notificationPayload);
    }
    return response;
  });
}

