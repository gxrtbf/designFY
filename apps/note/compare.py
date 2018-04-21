from keras.models import load_model
from keras import backend as K
from PIL import Image
from django.conf import settings
import numpy as np

def contrastive_loss(y_true, y_pred):
	margin = 1.
	return K.mean((1. - y_true) * K.square(y_pred) + y_true * K.square(K.maximum(margin - y_pred, 0.)))

def loadImg(depth_file1, depth_file2):

    img = Image.open(depth_file1)
    img = np.asarray(img)
    img = img[:,:,:3]
    img = (img - np.mean(img)) / np.max(img)

    img2 = Image.open(depth_file2)
    img2 = np.asarray(img2)
    img2 = img2[:,:,:3]
    img2 = (img2 - np.mean(img2)) / np.max(img2)
    
    return np.array([img, img2])

def compareScore(depth_file1, depth_file2):
	cop = loadImg(depth_file1, depth_file2)
	score = MODEL.predict([cop[0].reshape((1,200,200,3)), cop[1].reshape((1,200,200,3))])
	return score

MODEL = load_model('E:/env/designFY/model/model_faceId_test.h5', {'contrastive_loss':contrastive_loss})
score = compareScore('E:/env/designFY/media/base.png', 'E:/env/designFY/media/temp.png')
print(score)
