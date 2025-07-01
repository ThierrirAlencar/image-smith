import uuid
import os
import sys
import cv2 as cv
import numpy as np
from PIL import Image

# 🎯 Parâmetros da linha de comando
parameters = sys.argv[1:]

input_path = parameters[0]        # Caminho do GIF de entrada
effect = int(parameters[1])       # Efeito a ser aplicado
Amount = int(parameters[2])       # Intensidade geral
AmountG = int(parameters[3])      # Intensidade G (caso RGB Boost - ignorado aqui)
AmountB = int(parameters[4])      # Intensidade B (caso RGB Boost - ignorado aqui)

effectsNameList = [
    "", "Grayscale", "Blur", "Canny"
]

file_name = effectsNameList[effect] + "-" + str(uuid.uuid4())
output_path = f"./uploads/finished/effect/{effectsNameList[effect]}"

# 🗂️ Garante que o diretório de saída existe
if not os.path.exists(output_path):
    os.makedirs(output_path)

# 📽️ Abre o GIF
gif = cv.VideoCapture(input_path)

# 🎨 Função para aplicar o efeito em cada frame
def applyEffectToFrame(frame, Effect, Amount):
    match Effect:
        case 1:  # Grayscale
            img = cv.cvtColor(frame, cv.COLOR_BGR2GRAY)
            img = cv.cvtColor(img, cv.COLOR_GRAY2BGR)
        case 2:  # Blur
            Amount = Amount if Amount % 2 == 1 else Amount + 1  # kernel ímpar
            img = cv.GaussianBlur(frame, (Amount, Amount), cv.BORDER_DEFAULT)
        case 3:  # Canny (bordas)
            img = cv.Canny(frame, Amount * 10, (Amount * 10) + 125)
            img = cv.cvtColor(img, cv.COLOR_GRAY2BGR)
        case _:  # Nenhum ou inválido
            img = frame
    return img

# 🔄 Processamento frame a frame
frames = []
ret, frame = gif.read()

while ret:
    processed = applyEffectToFrame(frame, effect, Amount)
    rgb_frame = cv.cvtColor(processed, cv.COLOR_BGR2RGB)
    pil_frame = Image.fromarray(rgb_frame)
    frames.append(pil_frame)
    ret, frame = gif.read()

# 💾 Salvar o GIF final
if frames:
    absolute_path = os.path.abspath(f"{output_path}/{file_name}.gif")
    frames[0].save(absolute_path, save_all=True, append_images=frames[1:], loop=0, duration=100)
    print(absolute_path)

cv.destroyAllWindows()
