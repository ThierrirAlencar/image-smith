import os
import uuid
import cv2 as cv
import numpy as np
import sys

# configs
parameters = sys.argv[1:]

file_path = parameters[0]
output_path= parameters[1]
Action = int(parameters[2])

file_name = str(uuid.uuid4())

## To understand the following code, read readme.md
img = cv.imread(file_path)
blank = np.zeros((img.shape[0], img.shape[1]), dtype="uint8")
gray = cv.cvtColor(img,cv.COLOR_BGR2GRAY)

## creates a haar Cascade
haar_cascade = cv.CascadeClassifier("haar_face.xml")

## reads the trigger from the above cascade
# the cascade is an algorithm that will read anything provided by the haar method(imported from the xml file);
# when the cascade is configured(like what we did above) it can be used to detec the face presence.

## detects the position of the face in the provided image as an list of faces 
# params: image, scale, minNeighbors(greater is the value more hard will be to find a face)
faces_rec = haar_cascade.detectMultiScale(gray,scaleFactor=1.1,minNeighbors=1);

if not os.path.exists(output_path):
    os.makedirs(output_path)
    

## prints the amount of faces
print(len(faces_rec))

# crop out the face
def cropFace():
    # draws a rectangle at faces position
    for(x,y,w,h) in faces_rec:
        cv.rectangle(blank,(x,y),(x+w,y+h),(255,255,255),-1)

    sub = cv.bitwise_and(img,img,mask=blank)
    return sub

# pixelate the face
def pixelate(image):
    # Get input size
    height, width, _ = image.shape

    # Desired "pixelated" size
    h, w = (16, 16)

    # Resize image to "pixelated" size
    temp = cv.resize(image, (w, h), interpolation=cv.INTER_LINEAR)

    # Initialize output image
    return cv.resize(temp, (width, height), interpolation=cv.INTER_NEAREST)

def blur(image):
    image = cv.blur(img,img.shape)

match(Action):
    case 1: 
        img = cropFace()
        pass;
    case 2:
        for(x,y,w,h) in faces_rec:
            # ROI bounding box coordinates
            # x,y,w,h = 122,98,283,240

            # Extract ROI
            ROI = img[y:y+h, x:x+w]

            # Pixelate ROI
            pixelated_ROI = pixelate(ROI)

            # Paste pixelated ROI back into original image
            img[y:y+h, x:x+w] = pixelated_ROI
        pass;

# subtracts the remaining image and shows only the faces detected
absolute_path = (os.path.abspath(output_path)+"\ "+file_name+".png").strip()
cv.imwrite(absolute_path,img)