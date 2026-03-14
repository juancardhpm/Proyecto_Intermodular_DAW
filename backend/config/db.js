const { Sequelize } = require('sequelize'); //Importo la libreria Sequelize
require('dotenv').config();  //Esta linea de codigo carga las varibales del .env que vamos a poner para encriptar las mismas

// Ahora configuramos la instancia de sequelize
const sequelize = new Sequelize(
    process.env.DB_NAME,  //Pongo el nombre de la BBDD creado en .env
    process.env.DB_USER,   // Pongo la variable creada en .env referente al nombre de usuario de la BBDD
    process.env.DB_PASS,   //Pongo la variables creada en .env referenre a la contraseña de la BBDD
    {
        host: process.env.DB_HOST,  //Pongo la variable de .env diciendo donde esta la BBDD (localhost)
        dialect: 'mysql',  //Le confirmo a Sequelizo que voy a utilizar MySQL
        port: process.env.DB_PORT,   //Le señalo el puerto configurado en .env de la BBDD de MySQL
        logging: false,  //Para que la consola de VSc este limpia y no se llene de codigo SQL cada vez que se realiza alguna accion con el BBDD
        define: {  //Reglas de las tablas
            timestamps: false,  //De esta forma evito que Sequelize busque columnas createdAt o updatedAt y me debe error
            freezeTableName: true  //Con esto evito que Sequelize le cambie el nombre de las tablas a plural y busque la tabla con el nombre que tiene
        },
        pool: {
            max: 10,  //Maximo de conexiones abiertas que permito a la BBDD
            min: 0,  //Minimo de conexiones abiertas que permito BBDD
            acquire: 30000,  //Le indico el tiempo maximo que quiero que intente conectar Sequelize a la BBDD
            idle: 10000 //Si una conexion lleva 10 segundos sin hacer nada, la cierro para dejar sitio a otro conexion
        }
    }
);


// Creo una funcion para revisar que la conexion funcina correctamente le hago un try/catch con funcion asincrona, ya que esperamos respuesta de Sequelize
const conectarDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('Base de datos conectada correctamente');
        
    } catch (error) {
        console.error('Error en la conexion con la base de datos', error.message);
        process.exit(1); //Aqui detengo la app si no hay una base de datos conectada
    }
};

// Exporto los modulos
module.exports = {sequelize, conectarDB };