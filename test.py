import webtest
import unittest
import json

from main import app

class MainApplicationTest(unittest.TestCase):
    def setUp(self):
        self.testapp = webtest.TestApp(app)

    def test_get_range_of_entries(self):
        response = self.testapp.get('/?start=0&end=3')
        json_response = json.loads(response.body)
        self.assertEqual(response.status_int, 200)
        self.assertListEqual(json_response, ['Entry 0', 'Entry 1', 'Entry 2'])


    def test_get_random_range_of_entries(self):
        response = self.testapp.get('/?start=17&end=21')
        json_response = json.loads(response.body)
        self.assertEqual(response.status_int, 200)
        self.assertListEqual(json_response, ['Entry 17', 'Entry 18', 'Entry 19', 'Entry 20'])




