import os
import sys
import uuid
import cv2 as cv


parameters = sys.argv[1:]

input_path = parameters[0] # URl de entrada
output_path = parameters[1] # URL de saída
effect = int(parameters[2])  # Efeito a ser aplicado
Amount = int(parameters[3])  # Intensidade a ser aplicada
file_name = str(uuid.uuid4())



if not os.path.exists(output_path):
    os.makedirs(output_path)
    
img = cv.imread(input_path)

# https://stackoverflow.com/questions/59780034/pixelate-roi-bounding-box-and-overlay-it-on-original-image-using-opencv
def pixelate(img,h=16,w=16):
    # Get input size
    height, width, _ = img.shape

    # Desired "pixelated" size
    #h, w = (16, 16)

    # Resize img to "pixelated" size
    temp = cv.resize(img, (w, h), interpolation=cv.INTER_LINEAR)

    # Initialize output image
    return cv.resize(temp, (width, height), interpolation=cv.INTER_NEAREST)

if(effect>8 or effect<0):
    print("Error, invalid effect");

else:
    match (effect):   
        case 1: # grayscale image
            img = cv.cvtColor(img,cv.COLOR_BGR2GRAY)
            pass;
        case 2: 
            img = cv.GaussianBlur(img,(Amount,Amount),cv.BORDER_DEFAULT)
            pass
        case 3:
            img = cv.Canny(img,Amount*10,(Amount*10)+125)
            pass
        case 4:
            img = pixelate(img,Amount,Amount)
            pass
        case 5:
            img = cv.cvtColor(img,cv.COLOR_BGR2RGB); pass;
        case 6:
            img = cv.cvtColor(img,cv.COLOR_BGR2HSV); pass;
        case 7:
            img = cv.cvtColor(img,cv.COLOR_BGR2HLS); pass;
        case 8:
            img = cv.cvtColor(img,cv.COLOR_BGR2LUV); pass;
            
    absolute_path = (os.path.abspath(output_path)+"\ "+file_name+".png").strip()
    cv.imwrite(absolute_path,img)
    print(absolute_path)
    pass