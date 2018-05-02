# from keras.models import load_model
# from keras import backend as K
# from PIL import Image
# from django.conf import settings
# import numpy as np

# import os  
# os.environ["CUDA_VISIBLE_DEVICES"] = "2"

# def contrastive_loss(y_true, y_pred):
# 	margin = 1.
# 	return K.mean((1. - y_true) * K.square(y_pred) + y_true * K.square(K.maximum(margin - y_pred, 0.)))

# def loadImg(depth_file1, depth_file2):

#     img = Image.open(depth_file1)
#     img = np.asarray(img)
#     img = img[:,:,:3]
#     img = (img - np.mean(img)) / np.max(img)

#     img2 = Image.open(depth_file2)
#     img2 = np.asarray(img2)
#     img2 = img2[:,:,:3]
#     img2 = (img2 - np.mean(img2)) / np.max(img2)
    
#     return np.array([img, img2])

# def compareScore(depth_file1, depth_file2):
# 	cop = loadImg(depth_file1, depth_file2)
# 	score = MODEL.predict([cop[0].reshape((1,100,100,3)), cop[1].reshape((1,100,100,3))])
# 	return score

# MODEL = load_model(settings.MODEL_ROOT + '/model_faceId_new.h5', {'contrastive_loss':contrastive_loss})
# score = compareScore(settings.MEDIA_ROOT + '/base.png', settings.MEDIA_ROOT + '/temp.png')


from django.conf import settings
import dlib
import cv2
import numpy as np

# 模型路径
predictor_path = settings.MODEL_ROOT + "/shape_predictor_68_face_landmarks.dat"
face_rec_model_path = settings.MODEL_ROOT + "/dlib_face_recognition_resnet_model_v1.dat"

# 读入模型
detector = dlib.get_frontal_face_detector()
shape_predictor = dlib.shape_predictor(predictor_path)
face_rec_model = dlib.face_recognition_model_v1(face_rec_model_path)

def compareScore(face_descriptor1, face_descriptor2):

    score = np.sqrt(sum([(face_descriptor1[i] - face_descriptor2[i])**2 for i in range(128)]))
    
    return score

def score(depth_file):

    img = cv2.imread(depth_file, cv2.IMREAD_COLOR)
    b, g, r = cv2.split(img)
    img2 = cv2.merge([r, g, b])
    dets = detector(img, 1)

    shape = shape_predictor(img2, dets[0])
    face_descriptor = face_rec_model.compute_face_descriptor(img2, shape)
    face_descriptor = [x for x in face_descriptor]

    return face_descriptor