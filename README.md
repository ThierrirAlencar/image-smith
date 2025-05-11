<p align="center" text-align="center"><img src="https://github.com/user-attachments/assets/1c239555-822d-45ea-9b1f-87e5885c6b55"/></p>
<p align="center" text-align="center">A image manipulation API with built-in effects, transformation and <br> conversion for images.</p> <br>






<p align="center">
  <img src="https://github.com/user-attachments/assets/cf7d97b0-33da-40c7-aad0-80aa932ddc2c" width="100"> 
  <img src="https://github.com/user-attachments/assets/b38fc8b8-829c-458f-b248-3a7ccd24e2a7" width="100"> 
  <img src="https://cdn-icons-png.flaticon.com/256/5968/5968381.png" width="100">    
  <img src="https://github.com/user-attachments/assets/b38fc8b8-829c-458f-b248-3a7ccd24e2a7" width="100"> 
  <img src="https://cdn.iconscout.com/icon/free/png-256/free-python-logo-icon-download-in-svg-png-gif-file-formats--technology-social-media-vol-5-pack-logos-icons-2945099.png?f=webp&w=256" width="100">
</p>



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

run the app
```bash 
$ npm run start
```

(Optional) Setup Project Enviroment. Useful for venv dependency issues (for linux only)
```bash
$ npm run deploy
```

Or execute [build file](buid.sh)

# Known issues 🔎

- Redis and BulqMQ
- Some Effects aren't working as espected and needed to be removed
- Cache strategy not applied

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
