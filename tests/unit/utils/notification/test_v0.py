import unittest

from http import HTTPStatus
from typing import Dict, List

from flask import jsonify, make_response, Response

from amundsen_application import create_app
from amundsen_application.api.exceptions import MailClientNotImplemented
from amundsen_application.api.utils.notification_utils import get_notification_content, get_mail_client, \
    get_notification_template, get_notification_subject, send_notification, table_key_to_url

from amundsen_application.base.base_mail_client import BaseMailClient

local_app = create_app('amundsen_application.config.TestConfig', 'tests/templates')


class MockMailClient(BaseMailClient):
    def __init__(self, status_code: int, recipients: List = []) -> None:
        self.status_code = status_code

    def send_email(self,
                   sender: str = None,
                   recipients: List = [],
                   subject: str = None,
                   text: str = None,
                   html: str = None,
                   options: Dict = {}) -> Response:
        return make_response(jsonify({}), self.status_code)


class NotificationUtilsTest(unittest.TestCase):
    def setUp(self) -> None:
        self.mock_table_key = 'db://cluster.schema/table'

    def test_table_key_to_url(self) -> None:
        """
        Test successful conversion between key and url
        :return:
        """
        with local_app.app_context():
            url = table_key_to_url(table_key=self.mock_table_key)
            self.assertEqual('{}/table_detail/cluster/db/schema/table'.format(local_app.config['FRONTEND_BASE']), url)

    @unittest.mock.patch('amundsen_application.api.utils.notification_utils.render_template')
    @unittest.mock.patch('amundsen_application.api.utils.notification_utils.get_notification_template')
    @unittest.mock.patch('amundsen_application.api.utils.notification_utils.get_notification_subject')
    def test_get_notification_content(self, get_subject_mock, get_template_mock, render_template_mock) -> None:
        """
        :return:
        """
        with local_app.app_context():
            get_subject_mock.return_value = 'Test Subject'
            get_template_mock.return_value = 'test.html'
            render_template_mock.return_value = 'testHTML'

            test_notification_type = 'test'
            test_sender = 'test@test.com'
            test_options = {'resource_name': 'testtable'}

            result_dict = get_notification_content(notification_type=test_notification_type,
                                                   sender=test_sender,
                                                   options=test_options
                                                   )
            expected_dict = {
                'subject': 'Test Subject',
                'html': 'testHTML'
            }
            self.assertDictEqual(result_dict, expected_dict)
            get_subject_mock.assert_called_with(notification_type=test_notification_type, options=test_options)
            get_template_mock.assert_called_with(notification_type=test_notification_type)
            render_template_mock.assert_called_with('test.html', sender=test_sender, options=test_options)

    def test_get_notification_template(self) -> None:
        """
        :return:
        """
        for n in ['added', 'removed', 'edited', 'requested']:
            result = get_notification_template(notification_type=n)
            self.assertEqual(result, 'notifications/notification_{}.html'.format(n))

    def test_get_notification_subject_added(self) -> None:
        """
        :return:
        """
        result = get_notification_subject(notification_type='added', options={'resource_name': 'testtable'})
        self.assertEqual(result, 'You are now an owner of testtable')

    def test_get_notification_subject_removed(self) -> None:
        """
        :return:
        """
        result = get_notification_subject(notification_type='removed', options={'resource_name': 'testtable'})
        self.assertEqual(result, 'You have been removed as an owner of testtable')

    def test_get_notification_subject_edited(self) -> None:
        """
        :return:
        """
        result = get_notification_subject(notification_type='edited', options={'resource_name': 'testtable'})
        self.assertEqual(result, 'Your dataset testtable\'s metadata has been edited')

    def test_get_notification_subject_requested(self) -> None:
        """
        :return:
        """
        result = get_notification_subject(notification_type='requested', options={'resource_name': 'testtable'})
        self.assertEqual(result, 'Request for metadata on testtable')

    def test_get_mail_client_success(self) -> None:
        """
        :return:
        """
        with local_app.app_context():
            local_app.config['MAIL_CLIENT'] = unittest.mock.Mock()
            self.assertEqual(get_mail_client(), local_app.config['MAIL_CLIENT'])

    def test_get_mail_client_error(self) -> None:
        """
        :return:
        """
        with local_app.app_context():
            self.assertRaises(MailClientNotImplemented, get_mail_client)

    @unittest.mock.patch('amundsen_application.api.utils.notification_utils.get_notification_content')
    @unittest.mock.patch('amundsen_application.api.utils.notification_utils.get_mail_client')
    def test_send_notification_success(self, get_mail_client, get_notification_content) -> None:
        """
        :return:
        """
        with local_app.app_context():
            get_mail_client.return_value = MockMailClient(status_code=HTTPStatus.OK)

            test_recipients = ['test@test.com']
            test_sender = 'test2@test.com'
            test_notification_type = 'added'
            test_options = {}

            response = send_notification(
                notification_type=test_notification_type,
                options=test_options,
                recipients=test_recipients,
                sender=test_sender
            )

            get_mail_client.assert_called
            get_notification_content.assert_called_with(
                notification_type=test_notification_type,
                sender=test_sender,
                options=test_options
            )
            self.assertEqual(response.status_code, HTTPStatus.OK)
            # test sender is removed
            # test no recipients
            # test mail client fails and status is propagated
            # test general exception occurs
            # test catched mail_client_not_implemented
