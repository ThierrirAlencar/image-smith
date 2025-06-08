import os
import sys
import uuid
import cv2 as cv
import numpy as np
import requests
from PIL import Image
from io import BytesIO

parameters = sys.argv[1:]

FiltersNameList = [
    "",  # índice 0 reservado (sem efeito)
    "sepia",
    "clarendon",
    "lark",
    "moon",
    "gingham",
    "inkwell",
    "toaster",
    "vintage",
    "cool_blue",
    "warm_glow"
]

input_path = parameters[0] # URl de entrada
effect = int(parameters[1])  # Efeito a ser aplicado
file_name = FiltersNameList[effect]+"-"+str(uuid.uuid4())
output_path = "./uploads/finished/effect/"+FiltersNameList[effect] # URL de saída

# Faz download da imagem da URL pública do Supabase
response = requests.get(input_path)
response.raise_for_status()  # Garante que a resposta é válida

# Abre a imagem diretamente da memória
img = Image.open(BytesIO(response.content)).convert("RGBA")

if not os.path.exists(output_path):
    os.makedirs(output_path)
    
img = cv.cvtColor(np.array(img), cv.COLOR_RGBA2BGRA)
func_list = [
noone():
    return 0
,
sepia(img):
    sepia_filter = np.array([
        [0.272, 0.534, 0.131, 0],
        [0.349, 0.686, 0.168, 0],
        [0.393, 0.769, 0.189, 0],
        [0,     0,     0,     1]
    ])
    return cv.transform(img, sepia_filter)
,
reel(img):
    return cv.convertScaleAbs(img, alpha=1.2, beta=30)
,

clarendon(img):
    img = cv.convertScaleAbs(img, alpha=1.4, beta=10)
    b, g, r, a = cv.split(img)
    b = cv.add(b, 20)
    return cv.merge([b, g, r, a])
,
lark(img):
    hsv = cv.cvtColor(img, cv.COLOR_BGRA2BGR)
    hsv = cv.cvtColor(hsv, cv.COLOR_BGR2HSV)
    hsv[..., 1] = np.clip(hsv[..., 1] * 1.15, 0, 255)  # Saturação
    hsv[..., 2] = np.clip(hsv[..., 2] * 1.2, 0, 255)   # Brilho
    bgr = cv.cvtColor(hsv, cv.COLOR_HSV2BGR)
    return cv.cvtColor(bgr, cv.COLOR_BGR2BGRA)
,
moon(img):
    gray = cv.cvtColor(img, cv.COLOR_BGRA2GRAY)
    equalized = cv.equalizeHist(gray)
    return cv.cvtColor(equalized, cv.COLOR_GRAY2BGRA)
,
gingham(img):
    img_sepia = sepia(img)
    rows, cols = img.shape[:2]
    mask = np.zeros((rows, cols), dtype=np.float32)

    # Vinheta radial
    for i in range(rows):
        for j in range(cols):
            dx = (i - rows / 2) / (rows / 2)
            dy = (j - cols / 2) / (cols / 2)
            distance = np.sqrt(dx * dx + dy * dy)
            mask[i, j] = 1 - 0.4 * distance

    mask = np.clip(mask, 0.6, 1.0)
    vignette = cv.merge([img_sepia[..., c] * mask for c in range(3)] + [img_sepia[..., 3]])
    return vignette.astype(np.uint8)
,
inkwell(img):
    gray = cv.cvtColor(img, cv.COLOR_BGRA2GRAY)
    return cv.cvtColor(gray, cv.COLOR_GRAY2BGRA)
,
toaster(img):
    # Aumenta brilho e contraste
    img = cv.convertScaleAbs(img, alpha=1.3, beta=30)

    # Adiciona tonalidade avermelhada
    b, g, r, a = cv.split(img)
    r = cv.add(r, 30)
    g = cv.add(g, 10)
    toaster_img = cv.merge([b, g, r, a])

    # Vinheta vermelha
    rows, cols = img.shape[:2]
    center_x, center_y = cols // 2, rows // 2
    vignette = np.zeros((rows, cols), dtype=np.float32)

    for i in range(rows):
        for j in range(cols):
            dx = (j - center_x) / (cols / 2)
            dy = (i - center_y) / (rows / 2)
            distance = dx * dx + dy * dy
            vignette[i, j] = np.clip(1.2 - distance, 0.4, 1.0)

    r = r * vignette
    toaster_img = cv.merge([b, g, r.astype(np.uint8), a])
    return toaster_img
,
vintage(img):
    img = cv.convertScaleAbs(img, alpha=0.9, beta=0)
    b, g, r, a = cv.split(img)
    r = cv.add(r, 15)
    g = cv.add(g, 10)
    return cv.merge([b, g, r, a])
,
cool_blue(img):
    b, g, r, a = cv.split(img)
    b = cv.add(b, 20)
    r = cv.subtract(r, 10)
    return cv.merge([b, g, r, a])
,
warm_glow(img):
    b, g, r, a = cv.split(img)
    r = cv.add(r, 25)
    g = cv.add(g, 10)
    b = cv.subtract(b, 10)
    return cv.merge([b, g, r, a]),
    
]

if(effect>len(FiltersNameList)or effect<0):
    print("Error, invalid effect");

else:
