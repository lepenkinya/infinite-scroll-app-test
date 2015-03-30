#!/usr/bin/env python
import json
import webapp2


class EntriesHandler(webapp2.RequestHandler):
    def get(self):
        range_start = self.request.get('start')
        range_end = self.request.get('end')
        word = self.request.get('word')
        word = (word if len(word) > 0 else 'Nothing') + ' '


        result = []

        if len(range_start) > 0 and len(range_end) > 0:
            start = int(range_start)
            end = int(range_end)

            end = end if end < 500 else 500

            for i in range(start, end):
                result.append({'name': word + str(i)})

        self.response.headers['Content-Type'] = "application/json"
        self.response.out.write(json.dumps(result))


class MainHandler(webapp2.RedirectHandler):
    def get(self):
        self.response.out.write("Hello World")

app = webapp2.WSGIApplication([
    ('/entries', EntriesHandler)
], debug=True)
