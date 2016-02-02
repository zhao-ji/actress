#!/usr/bin/env python
# -*- coding: utf-8 -*-

import logbook
from redis import StrictRedis
from twitter import Api

from auth import access_token_key, access_token_secret
from auth import consumer_key, consumer_secret
from auth import redis_db, redis_psw

redis = StrictRedis(db=redis_db, password=redis_psw)

api = Api(
    consumer_key, consumer_secret,
    access_token_key, access_token_secret,
    )

if __name__ == "__main__":
    for status in api.GetUserStream(withuser='followings'):
        from pprint import pprint
        if u'entities' in status and u'media' in status['entities']:
            pprint(status)
            media_list = status['entities']['media']
            media_url = map(lambda media: media['media_url'], media_list)
            for item in media_url:
                redis.rpush("media_url", item)
                logbook.info(item)
