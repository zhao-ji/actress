#!/usr/bin/env python
# -*- coding: utf-8 -*-

import logbook
from redis import StrictRedis
from twitter import Api

redis = StrictRedis(db=15, password='srjdZ5weyil')

api = Api(
    access_token_key='161182645-L4cMztxf6YgcmlBSriNdsjydExahQXLytSZW7Iv0',
    access_token_secret='cElYTDaPLExWmt5YFS9ocmFLMqy5zFCEtJuwlxCFh8UNg',
    consumer_key='PNe5Qd1Q31HrMnshPoNxGKUSn',
    consumer_secret='OZ081oxLHyQOrTHnsuSuHJJJ65sJw3mRAQbP3MAueOwZxfwVWE',)

if __name__ == "__main__":
    for status in api.GetUserStream(withuser='followings'):
        if u'entities' in status and u'media' in status['entities']:
            media_list = status['entities']['media']
            media_url = map(lambda media: media['media_url'], media_list)
            for item in media_url:
                redis.rpush("media_url", item)
                logbook.info(item)
