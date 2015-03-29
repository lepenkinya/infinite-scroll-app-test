import webtest
import unittest
import json

from main import app

class MainApplicationTest(unittest.TestCase):
    def setUp(self):
        self.testapp = webtest.TestApp(app)

    def test_get_range_of_entries(self):
        response = self.testapp.get('/entries?start=0&end=3')
        json_response = json.loads(response.body)
        self.assertEqual(response.status_int, 200)
        expected = self.entry_names_to_data(['Entry 0', 'Entry 1', 'Entry 2'])
        self.assertListEqual(json_response, expected)


    def test_get_random_range_of_entries(self):
        response = self.testapp.get('/entries?start=17&end=21')
        json_response = json.loads(response.body)
        self.assertEqual(response.status_int, 200)
        expected = self.entry_names_to_data(['Entry 17', 'Entry 18', 'Entry 19', 'Entry 20'])
        self.assertListEqual(json_response, expected)

    def entry_names_to_data(self, entries):
        result = []
        for entry in entries:
            result.append({'name': entry})
        return result


