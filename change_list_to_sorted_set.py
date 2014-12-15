#!/usr/bin/env python
# coding: utf-8

import logbook
from redis import StrictRedis

redis = StrictRedis(db=15)

def main():
    while 1:
        image_name = redis.lpop("media_name")
        if not image_name:
            logbook.info("change is over")
            break
        try:
            redis.zadd("image_name", int(image_name), int(image_name))
        except Exception, e:
            redis.lpush("media_name", image_name)
            logbook.error(
                "something happens"
                "while name is {}"
                "and the error is {}".format(image_name, e)
                )
        else:
            logbook.info("success {}".format(image_name))

if __name__ == "__main__":
    main()
