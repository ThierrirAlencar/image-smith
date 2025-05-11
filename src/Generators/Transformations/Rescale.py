import os
import sys
import uuid
import cv2 as cv
import numpy as np

parameters = sys.argv[1:]

ImageUrl = parameters[0]
Outurl = parameters[1]
scale = float(parameters[2])  # fator de escala geral (resize)

# parâmetros extras opcionais
translate_x = int(parameters[3]) if len(parameters) > 3 else 0
translate_y = int(parameters[4]) if len(parameters) > 4 else 0
rotation_angle = float(parameters[5]) if len(parameters) > 5 else 0
scale_x = float(parameters[6]) if len(parameters) > 6 else 1.0
scale_y = float(parameters[7]) if len(parameters) > 7 else 1.0
flip_x = parameters[8].lower() == "true" if len(parameters) > 8 else False
crop_x = int(parameters[9]) if len(parameters) > 9 else 0
crop_y = int(parameters[10]) if len(parameters) > 10 else 0
crop_w = int(parameters[11]) if len(parameters) > 11 else 0
crop_h = int(parameters[12]) if len(parameters) > 12 else 0

file_name = str(uuid.uuid4())

if not os.path.exists(Outurl):
    os.makedirs(Outurl)

def rescaleFrame(frame, scale):
    width = int(frame.shape[1] * scale)
    height = int(frame.shape[0] * scale)
    return cv.resize(frame, (width, height), interpolation=cv.INTER_AREA)

def translate(img, x, y):
    transMat = np.float32([[1, 0, x], [0, 1, y]])
    return cv.warpAffine(img, transMat, (img.shape[1], img.shape[0]))

def rotate(img, angle):
    (h, w) = img.shape[:2]
    center = (w // 2, h // 2)
    rotMat = cv.getRotationMatrix2D(center, angle, 1.0)
    return cv.warpAffine(img, rotMat, (w, h))

def cardinal_scale(img, sx, sy):
    width = int(img.shape[1] * sx)
    height = int(img.shape[0] * sy)
    return cv.resize(img, (width, height), interpolation=cv.INTER_LINEAR)

def flip_horizontal(img):
    return cv.flip(img, 1)

def crop(img, x, y, w, h):
    return img[y:y+h, x:x+w]

# lê e processa a imagem
img = cv.imread(ImageUrl)
img = rescaleFrame(img, scale)

# aplica transformações conforme parâmetros
if translate_x != 0 or translate_y != 0:
    img = translate(img, translate_x, translate_y)

if rotation_angle != 0:
    img = rotate(img, rotation_angle)

if scale_x != 1.0 or scale_y != 1.0:
    img = cardinal_scale(img, scale_x, scale_y)

if flip_x:
    img = flip_horizontal(img)

if crop_w > 0 and crop_h > 0:
    img = crop(img, crop_x, crop_y, crop_w, crop_h)

# salva o resultado
absolute_path = (os.path.abspath(Outurl) + "\\" + file_name + ".png").strip()
cv.imwrite(absolute_path, img)
print(absolute_path)
