<p align="center" text-align="center"><img src="https://github.com/user-attachments/assets/d6e13713-ae46-409f-b178-55163df23c02"/></p>
<p align="center" text-align="center">A image manipulation API with built-in effects, transformation and conversion for images.</p>

# Features 💫

- Image Conversion
- Image Resize
- Effects
- Background remover
- Vídeo Effects
- Facial Detection functions

# Project Setup 🚀


Install the dependencies 
```bash
$ npm i --force
```

Setup the database (be sure to configure you .env)
```bash 
$ npx prisma migrate dev
```

Project Enviroment (for linux deploy)
```bash
$ npm run deploy
```
Or execute [build file](buid.sh)

# Tech Stack 🖥️

- **NestJS (Fastify)**
- **BullMQ + Redis**
- **Sharp** 
- **Multer**
- **PostgreSQL** 
- **Swagger (NestJS OpenAPI)**
- **Winston**
- **OpenCV**
- **Python**

# The Python and Javascript async use

It's not a doubt that python is a fast and usefull tool for building aplications with easy, while javascript with its due support of nodeJs and typescript can power up a robust backend api. In this project the relation between these two languages was explored and enhanced. Python provides us great tools for working with images and files, like OpenCV and Pillow that gives us an easy image manipulation alternative. 
A challenge of working with both techs was the lack of compatibility between then, this was fixed with the use of cmd scripting inside node
