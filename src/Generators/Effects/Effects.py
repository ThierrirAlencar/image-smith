import os
import sys
import uuid
import cv2 as cv
import numpy as np
import requests
from PIL import Image
from io import BytesIO

parameters = sys.argv[1:]

effectsNameList = [
    "",
    "Grayscale","Blur","Canny","Pixelate",
    "BGR2RGB","BGR2HSV", "BGR2HLS","BGR2LUV",
    "RGB_Boost","Negative","Brightness","Skin_Whitening",
    "Heat","Sepia","Cartoon","Pencil_Sketh"
]

input_path = parameters[0] # URl de entrada
effect = int(parameters[1])  # Efeito a ser aplicado
Amount = int(parameters[2])  # Intensidade a ser aplicada
AmountG = int(parameters[3]) # Em G se preciso
AmountB = int(parameters[4]) # Em B se preciso
file_name = effectsNameList[effect]+"-"+str(uuid.uuid4())
output_path = "./uploads/finished/effect/"+effectsNameList[effect] # URL de saída

# Faz download da imagem da URL pública do Supabase
response = requests.get(input_path)
response.raise_for_status()  # Garante que a resposta é válida

# Abre a imagem diretamente da memória
img = Image.open(BytesIO(response.content)).convert("RGBA")

if not os.path.exists(output_path):
    os.makedirs(output_path)
    
img = cv.cvtColor(np.array(img), cv.COLOR_RGBA2BGRA)

def pixelate(img,h=16,w=16):
    # Get input size
    height, width, _ = img.shape

    # Desired "pixelated" size
    #h, w = (16, 16)

    # Resize img to "pixelated" size
    temp = cv.resize(img, (w, h), interpolation=cv.INTER_LINEAR)

    # Initialize output image
    return cv.resize(temp, (width, height), interpolation=cv.INTER_NEAREST)
def rgb_boost(img, amount):
    # Garante que a imagem está no formato BGR
    img = img.astype('int32')  # Para evitar overflow
    img[..., 2] = cv.min(img[..., 2] + amount[0], 255)  # R
    img[..., 1] = cv.min(img[..., 1] + amount[1], 255)  # G
    img[..., 0] = cv.min(img[..., 0] + amount[2], 255)  # B
    return img.astype('uint8')
def change_brigthness(img, amount):
    hsv = cv.cvtColor(img, cv.COLOR_BGR2HSV)
    h, s, v = cv.split(hsv)
    v = cv.add(v, amount)
    v = cv.min(v, 255)
    final_hsv = cv.merge((h, s, v))
    return cv.cvtColor(final_hsv, cv.COLOR_HSV2BGR)
def skin_whitening(img, amount):
       # Separar canal alpha se existir
    has_alpha = img.shape[2] == 4
    if has_alpha:
        bgr = img[:, :, :3]
        alpha = img[:, :, 3]
    else:
        bgr = img

    # Converter para YCrCb para identificar tons de pele
    ycrcb = cv.cvtColor(bgr, cv.COLOR_BGR2YCrCb)

    # Máscara de pele
    skin_mask = cv.inRange(ycrcb, (0, 135, 85), (255, 180, 135))

    # Suavizar e clarear
    blur_strength = amount | 1
    blurred = cv.GaussianBlur(bgr, (blur_strength, blur_strength), 0)
    brightened = change_brigthness(blurred, amount)

    # Aplicar clareamento só na pele
    result_bgr = bgr.copy()
    result_bgr[skin_mask > 0] = brightened[skin_mask > 0]

    # Reconstruir com alpha se necessário
    if has_alpha:
        result = cv.merge((result_bgr, alpha))
    else:
        result = result_bgr

    return result

def heatmap_filter(img):
    # Converter para escala de cinza
    gray = cv.cvtColor(img, cv.COLOR_BGR2GRAY)
    # Aplicar o colormap 'HOT'
    heatmap = cv.applyColorMap(gray, cv.COLORMAP_HOT)
    return heatmap
def sepia_filter(img):
    # Converter a imagem para float64 para evitar estouro de valores
    img_sepia = img.astype(np.float64)
    # Matriz de transformação para o efeito sépia
    sepia_matrix = np.array([[0.272, 0.534, 0.131],
                             [0.349, 0.686, 0.168],
                             [0.393, 0.769, 0.189]])
    # Aplicar a transformação
    img_sepia = cv.transform(img_sepia, sepia_matrix)
    # Garantir que os valores estejam no intervalo [0, 255]
    img_sepia = np.clip(img_sepia, 0, 255)
    # Converter de volta para uint8
    return img_sepia.astype(np.uint8)
def sepia(img):
    sepia_filter = np.array([[0.272, 0.534, 0.131, 0],
                             [0.349, 0.686, 0.168, 0],
                             [0.393, 0.769, 0.189, 0],
                             [0, 0, 0, 1]])
    return cv.transform(img, sepia_filter)

def cartoon_filter(img):
    # Garantir que a imagem está em BGR (não BGRA)
    if img.shape[2] == 4:
        img = cv.cvtColor(img, cv.COLOR_BGRA2BGR)

    # Converter para escala de cinza
    gray = cv.cvtColor(img, cv.COLOR_BGR2GRAY)

    # Aplicar blur para reduzir ruído
    gray_blur = cv.medianBlur(gray, 5)

    # Detectar bordas usando threshold adaptativo
    edges = cv.adaptiveThreshold(gray_blur, 255,
                                 cv.ADAPTIVE_THRESH_MEAN_C,
                                 cv.THRESH_BINARY, 9, 9)

    # Aplicar filtro bilateral para suavizar cores
    color = cv.bilateralFilter(img, 9, 250, 250)

    # Combinar bordas com imagem suavizada
    cartoon = cv.bitwise_and(color, color, mask=edges)

    return cartoon
def pencil_sketch_filter(img):
    # Converter para escala de cinza
    gray = cv.cvtColor(img, cv.COLOR_BGR2GRAY)
    # Inverter a imagem em escala de cinza
    inverted = cv.bitwise_not(gray)
    # Aplicar um desfoque gaussiano
    blurred = cv.GaussianBlur(inverted, (21, 21), sigmaX=0, sigmaY=0)
    # Inverter a imagem borrada
    inverted_blur = cv.bitwise_not(blurred)
    # Criar o efeito de desenho a lápis
    sketch = cv.divide(gray, inverted_blur, scale=256.0)
    return sketch

def negative_filter(img):
    if img.shape[2] == 4:
        # Separar canal alpha
        b, g, r, a = cv.split(img)
        # Inverter apenas os canais de cor
        b = cv.bitwise_not(b)
        g = cv.bitwise_not(g)
        r = cv.bitwise_not(r)
        # Reunir com alpha original
        return cv.merge([b, g, r, a])
    else:
        # Imagem sem canal alpha
        return cv.bitwise_not(img)
    
if(effect>len(effectsNameList)or effect<0):
    print("Error, invalid effect");

else:
    match (effect):   
        case 1: # grayscale image
            img = cv.cvtColor(img,cv.COLOR_BGR2GRAY)
            pass;
        case 2: 
            Amount = Amount if Amount % 2 == 1 else Amount + 1;
            img = cv.GaussianBlur(img,(Amount,Amount),cv.BORDER_DEFAULT) # Intensidade Máxima 7
            pass
        case 3:
            img = cv.Canny(img,Amount*10,(Amount*10)+125) # Intensidade Máxima 7
            pass
        case 4:
            img = pixelate(img,Amount,AmountG) # Intensidade define a resolução, máxima 132, miníma 16
            pass
        case 5:
            img = cv.cvtColor(img,cv.COLOR_BGR2RGB); pass;
        case 6:
            img = cv.cvtColor(img,cv.COLOR_BGR2HSV); pass;
        case 7:
            img = cv.cvtColor(img,cv.COLOR_BGR2HLS); pass;
        case 8:
            img = cv.cvtColor(img,cv.COLOR_BGR2LUV); pass;
        case 9:
            img = rgb_boost(img,[Amount,AmountG,AmountB]) # Passa sustento como (r,g,b) = (Amount,AmountG,AmountB)
            pass;
        case 10:
            img = negative_filter(img) # Nao utiliza Amount
            pass;
        case 11:
            img = change_brigthness(img,Amount) # Amount Entre -200 e 200
            pass;
        case 12:
            img = skin_whitening(img,Amount) # Amount Entre -200 e 200
            pass;
        case 13:
            img = heatmap_filter(img) # Amount desnecessário
            pass;
        case 14:
            img = sepia_filter(img) # Amount desnecessário
            pass;
        case 15:
            img = cartoon_filter(img) # Amount desnecessário
            pass;
        case 16:
            img = pencil_sketch_filter(img) # Amount desnecessário
            pass;
    
    absolute_path = (os.path.abspath(output_path)+"/"+file_name+".png").strip();
    cv.imwrite(absolute_path,img);
    print(absolute_path);
    
    pass;