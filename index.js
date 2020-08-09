//importaciones de terceros
const express = require ('express');
const { response, request } = require('express');
const mongoose = require('mongoose');

const { config } = require('./config')

const app = express();
mongoose.connect(config.db.url, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(()=> console.log('Conectado!!'))
    .catch((err)=>console.log("Hubo un error de conexion", err));

    //Generar esquema => que es el que define las reglas dentro de una coleccion
    const equiposSchema = new mongoose.Schema({
        nombre: String,
        liga: String,
        titulos: Number,
        clasifico: Boolean
    })

    //Modelo, => un Objeto que meja interactuar con la coleccion de MongoDB
    const Equipos = mongoose.model('Equipos', equiposSchema)

app.get('/', (request, response)=>{
    response.send('It works')
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json({ extended: true }));

app.get('/equipos', (request, response)=>{
    Equipos.find()
    .then((resDB)=> response.status(200).json(resDB))
    .catch((err)=> response.status(400).json(err));
});

app.get("/equipos/:id", (request, response)=>{
    Equipos.findById(request.params.id)
    .then((resDB)=> response.status(200).json(resDB))
    .catch((err)=> response.status(400).json(err));

})

app.post('/equipos', (request, response)=>{
   // Recibir la info que manda el cliente 
    const{ body } = request;
    // Pedirle a la DB que cree un doc con la info del body
    const newEquipo = new Equipos(body)
    newEquipo.save()
    .then((resDB)=> response.status(201).json(resDB))
    .catch((err)=> response.status(400).json(err));
});

app.patch('/equipos/:id', (request, response)=>{
    Equipos.findByIdAndUpdate(request.params.id, request.body)
    .then((resDB)=> response.status(201).json(resDB))
    .catch((err)=> response.status(400).json(err));

});

app.delete('/equipos/:id', (request, response)=>{
    Equipos.findByIdAndDelete(request.params.id)
    .then((resDB)=> response.status(204).json(resDB))
    .catch((err)=> response.status(400).json(err));

});



app.listen (config.port, ()=> console.log(`Api Listening on port : ${config.port}`))

