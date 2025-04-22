import os
import sys
import uuid
import cv2 as cv
from PIL import Image

## Abre o gif
gif = cv.VideoCapture("flipperMachine.gif")

def applyEffectToFrame(frame, Effect=1):
    img = frame
    Amount = 5
    match Effect:
        case 1:  # imagem em escala de cinza
            img = cv.cvtColor(img, cv.COLOR_BGR2GRAY)
            img = cv.cvtColor(img, cv.COLOR_GRAY2BGR)
        case 2:  # efeito de desfoque
            img = cv.GaussianBlur(img, (Amount, Amount), cv.BORDER_DEFAULT)
        case 3:  # efeito de borda
            img = cv.Canny(img, Amount * 10, (Amount * 10) + 125)
            img = cv.cvtColor(img, cv.COLOR_GRAY2BGR)
    return img

frames = []
ret, frame = gif.read()
frameNum = 0

# Processa cada quadro do gif
while ret:
    frameNum += 1
    frame_with_effect = applyEffectToFrame(frame, Effect=1)  # Alterne o valor de Effect para testar outros efeitos
    
    # Converte o quadro processado para RGB e o adiciona à lista de frames
    frame_rgb = cv.cvtColor(frame_with_effect, cv.COLOR_BGR2RGB)
    frames.append(Image.fromarray(frame_rgb))
    
    ret, frame = gif.read()

# Salva o GIF
if frames:
    output_path = f"processed_{uuid.uuid4()}.gif"
    frames[0].save(output_path, save_all=True, append_images=frames[1:], loop=0, duration=100)
    print(f"GIF salvo como {output_path}")

cv.destroyAllWindows()
