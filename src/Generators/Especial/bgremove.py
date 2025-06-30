from io import BytesIO
import uuid
from rembg import remove
from PIL import Image
import sys 
import os
import requests


##recebe os parametros a partir do script, ignora o parametro 0 pois este é o nome do arquivo
parameters = sys.argv[1:]
outputPath = "./uploads/finished/effect/bgremove"
inputPath = parameters[0] # URl de entrada

# Faz download da imagem da URL pública do Supabase
response = requests.get(inputPath)
response.raise_for_status()  # Garante que a resposta é válida

file_name = str(uuid.uuid4())

# Abre a imagem diretamente da memória
img = Image.open(BytesIO(response.content)).convert("RGBA")


if not os.path.exists(outputPath):
    os.makedirs(outputPath)
    



output = remove(img)
output.save(os.path.join(outputPath, file_name+".png"))

absolute_path = os.path.abspath(outputPath) + "/ " + file_name + ".png"

print(absolute_path.strip())


#input = Image.open(parameters[0])
#output = remove(input)

#output.save("img/"+parameters[0]+".png")
