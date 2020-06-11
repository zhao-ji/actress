# -*- coding: utf-8 -*-
# flake8: noqa
from qiniu import Auth
from qiniu import BucketManager

access_key = "WSzjNxJFwZ2VuCo_L0BvSVTyNlX-aTonE-r_kn2R"
secret_key = "qbcgCI500pJrsFzjDO13d9-8FbgqbgMqCnp9MdWd"
bucket_name = "elfin"

#初始化Auth状态
q = Auth(access_key, secret_key)

#初始化BucketManager
bucket = BucketManager(q)

#你要测试的空间， 并且这个key在你空间中存在
bucket_name = 'elfin'

#将文件从文件key 移动到文件key2，可以实现文件的重命名 可以在不同bucket移动
bucket_name2 = 'twitter'
key2 = 197434

with open("hey.txt") as f:
	for line in f:
		key = line.strip("\n")
		print key, key2
		ret, info = bucket.copy(bucket_name, key, bucket_name2, str(key2))
		assert ret == {}
		key2 += 1
