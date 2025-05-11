import os
import sys
import uuid
import cv2 as cv
import numpy as np

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
AmountB = int(parameters[3]) # Em B se preciso
file_name = effectsNameList[effect]+"-"+str(uuid.uuid4())
output_path = "./uploads/finished/effect/"+effectsNameList[effect] # URL de saída


if not os.path.exists(output_path):
    os.makedirs(output_path)
    
img = cv.imread(input_path)

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
    # Converter para YCrCb para identificar tons de pele
    ycrcb = cv.cvtColor(img, cv.COLOR_BGR2YCrCb)
    y, cr, cb = cv.split(ycrcb)

    # Criar máscara para tons de pele (valores empíricos)
    skin_mask = cv.inRange(ycrcb, (0, 133, 77), (255, 173, 127))

    # Suavizar a pele usando um blur suave
    blurred = cv.GaussianBlur(img, (amount | 1, amount | 1), 0)

    # Aumentar brilho nas regiões da pele
    brightened = change_brigthness(blurred, amount)

    # Combinar a imagem original com a pele clareada
    result = img.copy()
    result[skin_mask > 0] = brightened[skin_mask > 0]

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
def cartoon_filter(img):
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
    # Combinar bordas e imagem suavizada
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

if(effect>len(effectsNameList)or effect<0):
    print("Error, invalid effect");

else:
    match (effect):   
        case 1: # grayscale image
            img = cv.cvtColor(img,cv.COLOR_BGR2GRAY)
            pass;
        case 2: 
            img = cv.GaussianBlur(img,(Amount,Amount),cv.BORDER_DEFAULT) # Intensidade Máxima 7
            pass
        case 3:
            img = cv.Canny(img,Amount*10,(Amount*10)+125) # Intensidade Máxima 7
            pass
        case 4:
            img = pixelate(img,Amount,Amount) # Intensidade define a resolução, máxima 132, miníma 16
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
            img = cv.bitwise_not(img) # Nao utiliza Amount
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