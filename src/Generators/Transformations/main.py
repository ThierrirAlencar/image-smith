import uuid
from rembg import remove
from PIL import Image
import sys 
import os


##recebe os parametros a partir do script, ignora o parametro 0 pois este é o nome do arquivo
parameters = sys.argv[1:]

inputPath = parameters[0] # URl de entrada
transformation_index = parameters[1]
outputPath = "./img/" # URL de saída

file_name = str(uuid.uuid4())

if not os.path.exists(outputPath):
    os.makedirs(outputPath)
    
input = Image.open(inputPath)




print(parameters[0])


