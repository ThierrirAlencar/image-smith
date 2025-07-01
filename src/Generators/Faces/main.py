import os
import uuid
import cv2 as cv
import numpy as np
import sys
import uuid

# 🛠️ Entrada de parâmetros via CLI
parameters = sys.argv[1:]

file_path = parameters[0]        # Caminho da imagem de entrada      
# Diretório de saída
action = int(parameters[1])      # Ação: 1 = crop rosto, 2 = pixelar rosto

file_name = "FaceAction-" + str(uuid.uuid4()) + ".png"
output_path = "./uploads/finished/face/effect/" # URL de saída

cascade_path = os.path.join(os.path.dirname(__file__), "haar_face.xml")
# 📷 Leitura da imagem
img = cv.imread(file_path)
if img is None:
    print("Erro ao carregar imagem.")
    sys.exit(1)

gray = cv.cvtColor(img, cv.COLOR_BGR2GRAY)
blank = np.zeros_like(gray)

# 📚 Carregamento do classificador Haar
haar_cascade = cv.CascadeClassifier(cascade_path)

# 🔍 Detecção de rostos
faces_rec = haar_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=1)
print(f"{len(faces_rec)} rosto(s) detectado(s).")

# 📁 Garante que o diretório existe
if not os.path.exists(output_path):
    os.makedirs(output_path)

# 🎯 Ações disponíveis

def crop_face(image, mask, faces):
    for (x, y, w, h) in faces:
        cv.rectangle(mask, (x, y), (x + w, y + h), (255), -1)
    result = cv.bitwise_and(image, image, mask=mask)
    return result

def pixelate_region(image, faces):
    for (x, y, w, h) in faces:
        roi = image[y:y+h, x:x+w]
        roi_height, roi_width = roi.shape[:2]
        temp = cv.resize(roi, (16, 16), interpolation=cv.INTER_LINEAR)
        pixelated = cv.resize(temp, (roi_width, roi_height), interpolation=cv.INTER_NEAREST)
        image[y:y+h, x:x+w] = pixelated
    return image

# 🎬 Executa ação
match action:
    case 1:
        img = crop_face(img, blank, faces_rec)
    case 2:
        img = pixelate_region(img, faces_rec)
    case _:
        print("Ação inválida.")
        sys.exit(1)

# 💾 Salva o resultado

cv.imwrite(output_path+file_name, img)
print(f"Imagem salva em: {output_path}")