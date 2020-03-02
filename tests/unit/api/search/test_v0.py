import json
import responses
import unittest

from http import HTTPStatus
from unittest.mock import patch

from amundsen_application import create_app
from amundsen_application.api.search.v0 import SEARCH_ENDPOINT, SEARCH_USER_ENDPOINT

local_app = create_app('amundsen_application.config.TestConfig', 'tests/templates')

MOCK_TABLE_RESULTS = {
    'total_results': 1,
    'results': [
        {
            'cluster': 'test_cluster',
            'column_names': [
                'column_1',
                'column_2',
                'column_3'
            ],
            'database': 'test_db',
            'description': 'This is a test',
            'key': 'test_key',
            'last_updated_timestamp': 1527283287,
            'name': 'test_table',
            'schema': 'test_schema',
            'tags': [],
        }
    ]
}

MOCK_PARSED_TABLE_RESULTS = [
    {
        'type': 'table',
        'cluster': 'test_cluster',
        'database': 'test_db',
        'description': 'This is a test',
        'key': 'test_key',
        'last_updated_timestamp': 1527283287,
        'name': 'test_table',
        'schema': 'test_schema',
    }
]


class SearchTableQueryString(unittest.TestCase):
    def setUp(self) -> None:
        self.mock_table_results = MOCK_TABLE_RESULTS
        self.expected_parsed_table_results = MOCK_PARSED_TABLE_RESULTS
        self.search_url = local_app.config['SEARCHSERVICE_BASE'] + SEARCH_ENDPOINT

    def test_fail_if_term_is_none(self) -> None:
        """
        Test request failure if 'term' is not provided in the request json
        :return:
        """
        with local_app.test_client() as test:
            response = test.post('/api/search/v0/table', json={'pageIndex': 0})
            self.assertEqual(response.status_code, HTTPStatus.INTERNAL_SERVER_ERROR)

    def test_fail_if_page_index_is_none(self) -> None:
        """
        Test request failure if 'pageIndex' is not provided in the request json
        :return:
        """
        with local_app.test_client() as test:
            response = test.post('/api/search/v0/table', json={'term': ''})
            self.assertEqual(response.status_code, HTTPStatus.INTERNAL_SERVER_ERROR)

    @responses.activate
    @patch('amundsen_application.api.search.v0._search_table')
    def test_calls_search_table_log_helper(self, search_table_mock) -> None:
        """
        Test _search_table helper method is called with correct arguments for logging
        from the request_json
        :return:
        """
        test_filters = {'schema': 'test_schema'}
        test_term = 'hello'
        test_index = 1
        test_search_type = 'test'
        responses.add(responses.POST, self.search_url, json=self.mock_table_results, status=HTTPStatus.OK)

        with local_app.test_client() as test:
            test.post('/api/search/v0/table',
                      json={
                          'term': test_term,
                          'pageIndex': test_index,
                          'filters': test_filters,
                          'searchType': test_search_type})
            search_table_mock.assert_called_with(filters=test_filters,
                                                 page_index=test_index,
                                                 search_term=test_term,
                                                 search_type=test_search_type)

    @responses.activate
    @patch('amundsen_application.api.search.v0.generate_query_json')
    def test_calls_generate_query_json(self, mock_generate_query_json) -> None:
        """
        Test generate_query_json helper method is called with correct arguments
        from the request_json
        :return:
        """
        test_filters = {'schema': 'test_schema'}
        test_term = 'hello'
        test_index = 1
        responses.add(responses.POST, self.search_url, json=self.mock_table_results, status=HTTPStatus.OK)

        with local_app.test_client() as test:
            test.post('/api/search/v0/table',
                      json={'term': test_term, 'pageIndex': test_index, 'filters': test_filters})
            mock_generate_query_json.assert_called_with(filters=test_filters,
                                                        page_index=test_index,
                                                        search_term=test_term)

    @patch('amundsen_application.api.search.v0.generate_query_json')
    def test_catch_exception_generate_query_json(self, mock_generate_query_json) -> None:
        """
        Test that any execeptions thrown by generate_query_json are caught
        from the request_json
        :return:
        """
        test_filters = {'schema': 'test_schema'}
        test_term = 'hello'
        test_index = 1
        mock_generate_query_json.side_effect = Exception('Test exception')

        with local_app.test_client() as test:
            response = test.post('/api/search/v0/table',
                                 json={'term': test_term, 'pageIndex': test_index, 'filters': test_filters})
            data = json.loads(response.data)
            self.assertEqual(data.get('msg'), 'Encountered exception generating query json: Test exception')
            self.assertEqual(response.status_code, HTTPStatus.INTERNAL_SERVER_ERROR)

    @responses.activate
    def test_request_success(self) -> None:
        """
        Test that the response contains the expected data and status code on success
        :return:
        """
        test_filters = {'schema': 'test_schema'}
        test_term = 'hello'
        test_index = 1
        responses.add(responses.POST, self.search_url, json=self.mock_table_results, status=HTTPStatus.OK)

        with local_app.test_client() as test:
            response = test.post('/api/search/v0/table',
                                 json={'term': test_term, 'pageIndex': test_index, 'filters': test_filters})
            data = json.loads(response.data)
            self.assertEqual(response.status_code, HTTPStatus.OK)

            results = data.get('tables')
            self.assertEqual(results.get('total_results'), self.mock_table_results.get('total_results'))
            self.assertEqual(results.get('results'), self.expected_parsed_table_results)

    @responses.activate
    def test_request_fail(self) -> None:
        """
        Test that the response containes the failure status code from the search service on failure
        :return:
        """
        test_filters = {'schema': 'test_schema'}
        test_term = 'hello'
        test_index = 1
        responses.add(responses.POST, self.search_url, json={}, status=HTTPStatus.BAD_REQUEST)

        with local_app.test_client() as test:
            response = test.post('/api/search/v0/table',
                                 json={'term': test_term, 'pageIndex': test_index, 'filters': test_filters})
            data = json.loads(response.data)
            self.assertEqual(response.status_code, HTTPStatus.BAD_REQUEST)
            self.assertEqual(data.get('msg'), 'Encountered error: Search request failed')


class SearchUserTest(unittest.TestCase):
    def setUp(self) -> None:
        self.mock_search_user_results = {
            'total_results': 1,
            'results': [
                {
                    'name': 'First Last',
                    'first_name': 'First',
                    'last_name': 'Last',
                    'team_name': 'Team Name',
                    'email': 'email@email.com',
                    'manager_email': 'manager@email.com',
                    'github_username': '',
                    'is_active': True,
                    'employee_type': 'teamMember',
                    'role_name': 'SWE',
                }
            ]
        }
        self.expected_parsed_search_user_results = [

            {
                'display_name': 'First Last',
                'email': 'email@email.com',
                'employee_type': 'teamMember',
                'first_name': 'First',
                'full_name': 'First Last',
                'github_username': '',
                'is_active': True,
                'last_name': 'Last',
                'manager_email': 'manager@email.com',
                'manager_fullname': None,
                'profile_url': '',
                'role_name': 'SWE',
                'slack_id': None,
                'team_name': 'Team Name',
                'type': 'user',
                'user_id': 'email@email.com'
            }
        ]
        self.bad_search_results = {
            'total_results': 1,
            'results': 'Bad results to trigger exception'
        }

    def test_search_user_fail_if_no_query(self) -> None:
        """
        Test request failure if 'query' is not provided in the query string
        to the search endpoint
        :return:
        """
        with local_app.test_client() as test:
            response = test.get('/api/search/v0/user', query_string=dict(page_index='0'))
            self.assertEqual(response.status_code, HTTPStatus.INTERNAL_SERVER_ERROR)

    def test_search_user_fail_if_no_page_index(self) -> None:
        """
        Test request failure if 'page_index' is not provided in the query string
        to the search endpoint
        :return:
        """
        with local_app.test_client() as test:
            response = test.get('/api/search/v0/user', query_string=dict(query='test'))
            self.assertEqual(response.status_code, HTTPStatus.INTERNAL_SERVER_ERROR)

    @responses.activate
    def test_search_user_success(self) -> None:
        """
        Test request success
        :return:
        """
        responses.add(responses.GET, local_app.config['SEARCHSERVICE_BASE'] + SEARCH_USER_ENDPOINT,
                      json=self.mock_search_user_results, status=HTTPStatus.OK)

        with local_app.test_client() as test:
            response = test.get('/api/search/v0/user', query_string=dict(query='test', page_index='0'))
            data = json.loads(response.data)
            self.assertEqual(response.status_code, HTTPStatus.OK)

            users = data.get('users')
            self.assertEqual(users.get('total_results'), self.mock_search_user_results.get('total_results'))
            self.assertCountEqual(users.get('results'), self.expected_parsed_search_user_results)

    @responses.activate
    def test_search_user_fail_on_non_200_response(self) -> None:
        """
        Test request failure if search endpoint returns non-200 http code
        :return:
        """
        responses.add(responses.GET, local_app.config['SEARCHSERVICE_BASE'] + SEARCH_USER_ENDPOINT,
                      json=self.mock_search_user_results, status=HTTPStatus.INTERNAL_SERVER_ERROR)

        with local_app.test_client() as test:
            response = test.get('/api/search/v0/user', query_string=dict(query='test', page_index='0'))
            self.assertEqual(response.status_code, HTTPStatus.INTERNAL_SERVER_ERROR)
