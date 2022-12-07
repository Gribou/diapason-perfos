from rest_framework import status
from django.core import mail

from api.tests.base import *
from api.views import ContactFormView


class ContactFormApiTestCase(ApiTestCase):

    def test_submit(self):
        request = self.factory.post(
            "/api/contact/", {"message": "Message", "related_type": "TEST", "redactor": "moi"})
        response = ContactFormView.as_view()(request)
        self.assertTrue(status.is_success(response.status_code))
        self.assertEqual(len(mail.outbox), 1)
        self.assertEqual(mail.outbox[0].to, ["root@localhost"])
        self.assertIn("TEST", mail.outbox[0].body)

    def test_missing_message(self):
        request = self.factory.post(
            "/api/contact/", {"related_type": "TEST", "redactor": "moi"})
        response = ContactFormView.as_view()(request)
        self.assertTrue(status.is_client_error(response.status_code))
        self.assertIn("message", response.data)
