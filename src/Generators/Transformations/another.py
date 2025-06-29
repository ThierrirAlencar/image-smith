
from io import BytesIO
import uuid
from PIL import Image
import sys 
import os
import cv2 as cv
import numpy as np
import requests


TransformationsNameList = [
    "",
    "rescaleFrame","translate","rotate","cardinal_scale",
    "flip_horizontal","crop","flip_horizontal"
]

##recebe os parametros a partir do script, ignora o parametro 0 pois este é o nome do arquivo
parameters = sys.argv[1:]

inputPath = parameters[0] # URl de entrada
transformIndex = int(parameters[1])

p1 = float(parameters[2]) if len(parameters) > 2 else 0
p2 = float(parameters[3]) if len(parameters) > 3 else 0
p3 = int(parameters[4]) if len(parameters) > 4 else 0
p4 = int(parameters[5]) if len(parameters) > 5 else 0

output_path = "./uploads/finished/effect/"+TransformationsNameList[transformIndex] # URL de saída

file_name = str(uuid.uuid4())

# Faz download da imagem da URL pública do Supabase
response = requests.get(inputPath)
response.raise_for_status()  # Garante que a resposta é válida

# Abre a imagem diretamente da memória
img = Image.open(BytesIO(response.content)).convert("RGBA")

img = cv.cvtColor(np.array(img), cv.COLOR_RGBA2BGRA)

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
    return img[int(y):int(y+h), int(x):int(x+w)]

if(transformIndex>0 and transformIndex<len(TransformationsNameList)):
    match(transformIndex):
        case 1:
            img = rescaleFrame(img,p1) # Requires only the first param 
        case 2:
            img = translate(img, int(p1), int(p2)) # Requires both p1 and p2
        case 3:
            img = rotate(img,p1) # Requires p1
        case 4:
            img = cardinal_scale(img,p1,p2) # Uses both p1 and p2
        case 5:
            img = crop(img,p1,p2,p3,p4) # Uses all params (p1,p2,p3,p4)
        case 6: 
            img = flip_horizontal(img) # uses none

# Garante que o diretório de saída existe
os.makedirs(output_path, exist_ok=True)

# Salva a imagem final
absolute_path = os.path.abspath(f"{output_path}/{file_name}.png").strip()
cv.imwrite(absolute_path, img)

# Imprime o caminho da imagem gerada
print(absolute_path)