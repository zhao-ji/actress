#!/usr/bin/env python
# coding: utf-8

from json import dumps
from pprint import pprint

from flask import Flask
from flask import request

import boto3
import logbook

app = Flask(__name__)
s3 = boto3.client(service_name='s3', region_name='ap-southeast-2', use_ssl=True)


def apply_logging():
    from os.path import abspath, exists, dirname, join

    server_log_file = join(dirname(abspath(__file__)), "record.log")
    if not exists(server_log_file):
        open(server_log_file, "w").close()

    logbook.set_datetime_format("local")
    local_log = logbook.FileHandler(server_log_file)
    local_log.format_string = (
        u'[{record.time:%Y-%m-%d %H:%M:%S}] '
        u'lineno:{record.lineno} '
        u'{record.level_name}:{record.message}')
    local_log.push_application()


@app.route("/", methods=['GET'])
def fetch():
    from_key = request.args.get("fromKey", None)
    limit = int(request.args.get("limit", 30))
    request_args = {
        "Bucket": "actress-image",
        "MaxKeys": limit,
    }
    if from_key:
        request_args["StartAfter"] = from_key

    response = s3.list_objects_v2(**request_args)
    result = response["Contents"]
    for i in result:
        i.pop('LastModified')
    return dumps(response["Contents"])


@app.route("/", methods=['DELETE'])
def remove():
    image = request.args.get("image", None)
    if image:
        s3.delete_object(Bucket="actress-image", Key=image)

    return dumps({})


def print_example():
    response = s3.list_objects_v2(
        Bucket="actress-image",
        MaxKeys=3,
        StartAfter="--B_I4aIwb_eFlD6.jpg",
    )
    pprint(response)


if __name__ == "__main__":
    apply_logging()
    app.run(host='127.0.0.1', port=8002)
