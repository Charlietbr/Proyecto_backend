# userStack


### 0. Presentación

UserStack es una aplicación Node.js que permite a usuarios gestionar, a modo de red social, el registro de rutas de ocio, así como los vehículos utilizados en las mismas. 

Como práctica, abarca el desarrollo backend con MongoDB, Mongoose, Express y controladores RESTful.

El objetivo del proyecto es aprender, practicar y dominar el flujo de trabajo completo de una API REST, incluyendo autenticación, modelos de datos relacionales y pruebas con seeds.



### 1.Estructura del proyecto

userstack/
│
├── src/
│   ├── api/
│   │   ├── controllers/     # Controladores para las rutas
│   │   ├── models/          # Modelos Mongoose (User, Vehicle, Track)
│   │   ├── routes/          # Definición de rutas Express
│   ├── config/              # Configuración de la conexión a la base de datos
│   ├── middlewares/         # Middlewares como autenticación y manejo de errores
│   ├── utils/               # Scripts útiles (por ejemplo, seed.js para poblar la base de datos)
│   └── app.js               # Configuración principal de la app
│
├── .env                     # Variables de entorno
├── .gitignore
├── package.json
├── README.md                # Documentación




### 2. Instalación y Ejecución del Proyecto

        git clone https://github.com/tu-usuario/userstack.git

- ### Instalar dependencias

        npm install


- ### Configurar el entorno
    El archivo .env en la raíz del proyecto incluye las siguientes variables:

        PORT=3000
        MONGO_URI=mongodb://localhost:27017/userstack
        JWT_SECRET=clave_para_tokens

        CLOUDINARY_API_KEY=clave_para_cloudinary
        CLOUDINARY_API_SECRET=clave_para_cloudinary
        CLOUDINARY_CLOUD_NAME=nombre_de_la_nube



### Scripts en package.json para la ejecución del servidor y del seed


    npm run dev
    npm run seed


## 3. Endpoints definidos:

Las rutas están divididas en cuatro grupos correspondientes a la autenticación, la gestión de usuarios, la gestión de vehículos y la de rutas.
Dentro del modelo de usuario se incluyen sus rutas y vehículos, así como en los modelos de track y vehículo se muestra la relación con el usuario propietario.
    
            TABLA DE RUTAS

    | Método | Ruta               | Descripción                        | Autenticación |
    |--------|--------------------|------------------------------------|---------------|
    | POST   | /auth/register     | Registro de nuevo usuario          | X             |
    | POST   | /auth/login        | Login y token JWT                  | X             |
    | GET    | /users             | Obtener todos los usuarios         | √             |
    | GET    | /users/:id         | Obtener un usuario por ID          | √             |
    | PUT    | /users/:id         | Editar un usuario                  | √             |
    | DELETE | /users/:id         | Eliminar un usuario                | √             |
    | POST   | /vehicles          | Crear nuevo vehículo               | √             |
    | GET    | /vehicles          | Obtener lista de vehículos         | √             |
    | GET    | /vehicles/:id      | Obtener un vehículo por ID         | √             |
    | PUT    | /vehicles/:id      | Editar un vehículo                 | √             |
    | DELETE | /vehicles/:id      | Eliminar un vehículo               | √             |
    | POST   | /tracks            | Crear nueva ruta (track)           | √             |
    | GET    | /tracks            | Obtener lista de rutas             | √             |
    | GET    | /tracks/:id        | Obtener una ruta por ID            | √             |
    | PUT    | /tracks/:id        | Editar una ruta                    | √             |
    | DELETE | /tracks/:id        | Eliminar una ruta                  | √             |



## 4. Autenticación

La mayoría de las rutas requieren un token JWT en el encabezado:

        Authorization: Bearer <token>
    El token se genera al iniciar sesión con un usuario registrado mediante POST /auth/login.


## 5. Tecnologías Usadas

-    Node.js y Express – para la lógica del servidor.
-    MongoDB con Mongoose – base de datos NoSQL.
-    JWT – autenticación basada en tokens.
-    bcrypt – encriptación de contraseñas.
-    dotenv – gestión de variables de entorno.
-    nodemon – recarga automática en desarrollo.




## 5. Autor

Carlos Campillo.
Entrega de Proyecto Backend. {RTC - Desarrollo Web}.
Abril de 2025