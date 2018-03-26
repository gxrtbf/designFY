from aip import AipFace

APP_ID = '10998309'
API_KEY = 'dUblO2vFd0LIHiMtPKVqpE9m'
SECRET_KEY = 'aLvY1F34DOD6gLNCP3twi4DZXmagRssO'

aipFace = AipFace(APP_ID, API_KEY, SECRET_KEY)

aipFace.setConnectionTimeoutInMillis(5000)
aipFace.setSocketTimeoutInMillis(3000)

options = {
	'max_face_num': 2,
	'face_fields': "age,beauty,expression,faceshape",
}

def get_file_content(filePath):
	with open(filePath, 'rb') as fp:
		return fp.read()

def findBdapiTest():
	print(type(get_file_content('C:/Users/Administrator/Desktop/12.png')))
	result = aipFace.detect(get_file_content('C:/Users/Administrator/Desktop/12.png'), options)
	print(result)


if __name__ == '__main__':
	findBdapiTest()

