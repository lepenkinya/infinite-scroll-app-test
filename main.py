#!/usr/bin/env python
import json
import webapp2


class MainHandler(webapp2.RequestHandler):
    def get(self):
        range_start = self.request.get('start')
        range_end = self.request.get('end')

        result = []

        if len(range_start) > 0 and len(range_end) > 0:
            start = int(range_start)
            end = int(range_end)
            for i in range(start, end):
                result.append("Entry " + str(i))

        self.response.headers['Content-Type'] = "application/json"
        self.response.out.write(json.dumps(result))


app = webapp2.WSGIApplication([
    ('/', MainHandler)
], debug=True)
