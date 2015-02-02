#!/usr/bin/env python
# -*- coding: utf-8 -*-

from time import time

import logbook
from qiniu import Auth, put_data
from redis import StrictRedis
from requests import get

redis = StrictRedis(db=15, password='srjdZ5weyil')

ACCESS_KEY = "WSzjNxJFwZ2VuCo_L0BvSVTyNlX-aTonE-r_kn2R"
SECRET_KEY = "qbcgCI500pJrsFzjDO13d9-8FbgqbgMqCnp9MdWd"
BUCKET_NAME = "elfin"

qiniu = Auth(ACCESS_KEY, SECRET_KEY)

def get_name():
    name = str(time())
    return name.replace(".", "")

def upload_media(media):
    key = get_name()
    data = media
    token = qiniu.upload_token(BUCKET_NAME)
    return put_data(token, key, data)

if __name__ == "__main__":
    while 1:
        media_url = redis.blpop("media_url")
        if media_url:
            media = get(url=media_url[1])
            try:
                ret, info = upload_media(media.content)
            except Exception, e:
                redis.rpush("media_url", media_url)
                logbook.error(e)
            else:
                media_name = ret["key"]
                redis.zadd("image_name", int(media_name), int(media_name))
            finally:
                logbook.info("work on {}".format(media_url))
