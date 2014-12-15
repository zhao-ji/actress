#!/usr/bin/env python
# coding: utf-8
# @Nightwish

import logbook
from redis import StrictRedis

from tornado.web import RequestHandler, Application
from tornado.ioloop import IOLoop
from tornado.httpserver import HTTPServer
from tornado.escape import json_encode


redis = StrictRedis(db=15)


class BaseHandler(RequestHandler):
    '''base handler of operate by cookie'''

    start, stop = None, None

    def initialize(self):
        start_in_cookie = self.get_secure_cookie("start")
        if start_in_cookie:
            self.start = start_in_cookie
            self.stop = self.get_secure_cookie("stop")

    def produce(self, media_list=None):
        if not media_list:
            return json_encode({})
        media_length = len(media_list)
        media_items = [{"image": name} for name in media_list]
        return json_encode({
            "total": media_length,
            "result": media_items,
            })


class RefreshByCookieHandler(BaseHandler):
    '''/actress/v1/refresh'''

    def get(self):
        if self.start:
            logbook.info(self.start)
            media_name_list = redis.zrevrangebyscore(
                "image_name", "+inf",
                "({}".format(self.start),
                )
            if media_name_list:
                self.set_secure_cookie("start", media_name_list[0])
                logbook.info("set start: {}".format(media_name_list[0]))
                self.write(self.produce(media_list=media_name_list))
                return
        elif not self.start or not media_name_list:
            media_name_list = redis.zrevrange("image_name", 0, 19)
            self.set_secure_cookie("start", media_name_list[0])
            self.set_secure_cookie("stop", media_name_list[-1])
            logbook.info("set start:{}, stop:{}".format(
                media_name_list[0], media_name_list[-1]))
            self.write(self.produce(media_list=media_name_list))
            return


class RecordByCookieHandler(BaseHandler):
    '''/actress/v1/record'''

    def get(self):
        logbook.info("start: {}, stop: {}".format(self.start, self.stop))
        if not self.stop:
            self.send_error(400)
            return
        else:
            stop_rank = redis.zrevrank("image_name", self.stop)
            media_name_list = redis.zrevrange(
                "image_name",
                int(stop_rank)+1,
                int(stop_rank)+11,
                )
            if media_name_list:
                self.set_secure_cookie("stop", media_name_list[-1])
                logbook.info("set stop: {}".format(media_name_list[-1]))
                self.write(self.produce(media_list=media_name_list))
                return


from tornado.options import define, options, parse_command_line
define('port', default=7001, type=int)
define('debug', default=True, type=bool)

handlers = [
    (r'/v1/refresh', RefreshByCookieHandler),
    (r'/v1/record', RecordByCookieHandler),
    # (r'/v2/refresh', RefreshByFrontHandler),
    # (r'/v2/record', RecordByFrontHandler),
    ]

if __name__ == '__main__':
    parse_command_line()
    app = Application(
        handlers=handlers,
        debug=options.debug,
        xsrf_cookies=True,
        cookie_secret='helloworld',
        )
    http_server = HTTPServer(app, xheaders=True)
    http_server.listen(options.port)
    logbook.info(
        "The server now is running on port {}".format(options.port)
        )
    IOLoop.instance().start()
