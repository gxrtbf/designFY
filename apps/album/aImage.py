import os
from PIL import Image

def reduce_quantile(path):
	im = Image.open(path)
	width,height = im.size
	im = im.resize((400,int(400*height/width)), Image.ANTIALIAS) 
	im.save(path, quality = 50)
