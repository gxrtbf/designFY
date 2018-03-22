import os
from PIL import Image

def reduce_quantile(path,size):
	im = Image.open(path)
	im.save(path, quality = int(40000/size))
