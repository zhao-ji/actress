#!/usr/bin/env python
# coding: utf-8

from json import dumps
from pprint import pprint

from flask import Flask
from flask import request

import boto3

app = Flask(__name__)
s3 = boto3.client(service_name='s3', region_name='ap-southeast-2', use_ssl=True)


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
    app.run(host='127.0.0.1', port=8003)
