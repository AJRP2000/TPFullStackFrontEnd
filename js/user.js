const PORT = 5000;
const HOST = "localhost"

//==========================================Funciones==================================================

// Function to parse the query parameter from the URL
function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

// Function to add the name of the user in the header
function ingresarNombre(nombre){
    header = document.getElementById("welcomeMessage");
    var welcomeMessage = document.createElement('h1');
    welcomeMessage.textContent  = "Bienvenido " + nombre +"!";
    header.appendChild(welcomeMessage)
}

function sobreEscribirImagen(archivo, idImagen){
    var img = document.getElementById(idImagen);
    img.src = "./imagenes/" + archivo;
    img.style.display = "block";
}

function borrarImagen(idImagen){
    var img = document.getElementById(idImagen);
    img.src = null;
    img.style.display = "none";
}

//Function to remove all the child elements of an html element.
function removerElementosHijos(idElemento){
    const parentElement = document.getElementById(idElemento);
    while (parentElement.firstChild) {
        parentElement.removeChild(parentElement.firstChild);
    }
}

//Function to remove all the character images
function removerElementosPersonajes() {
    for (let i = 1; i < 6; i++) {
        removerElementosHijos("personaje" + i.toString());
    }
}

//Function to show characters created
function mostrarPersonajes(listaPersonajes){
    for (let i = 0; i < listaPersonajes.length; i++) {
        const currentObject = listaPersonajes[i];
        sobreEscribirImagen(currentObject.archivoPersonaje, "ImagenPersonaje" + (i+1).toString());
        sobreEscribirImagen(currentObject.archivoRopaSuperior, "ImagenRopaSuperior" + (i+1).toString());
        sobreEscribirImagen(currentObject.archivoRopaInferior, "ImagenRopaInferior" + (i+1).toString());
        sobreEscribirImagen(currentObject.archivoZapatos, "ImagenZapatos" + (i+1).toString());
    }
    if(listaPersonajes.length<5){
        for(let i=listaPersonajes.length; i < 5; i++){
            borrarImagen("ImagenPersonaje" + (i+1).toString());
            borrarImagen("ImagenRopaSuperior" + (i+1).toString());
            borrarImagen("ImagenRopaInferior" + (i+1).toString());
            borrarImagen("ImagenZapatos" + (i+1).toString());
        }
    }
}

//Function to retrieve created characters
async function getListaPersonajes(){
    const url = `http://${HOST}:${PORT}/personajesCreadosPorUser?nombreUsuario=${nombre}&limit=${limit}&offset=${offset}`

    let listaPersonajes = await fetch(url,{
        method: 'GET',
        headers: {
          'Authorization': token,
        }
    })
        .then(response => response.json())
        .catch(error => {
            console.error('Error:', error);
            alert("Error: " + error.toString());
        });
    
    return listaPersonajes;
}

async function getListaArchivos(tipoArchivo){
    const url = `http://${HOST}:${PORT}/lista${tipoArchivo}`

    let listaArchivos = await fetch(url)
        .then(response => response.json())
        .catch(error => {
            console.error('Error:', error);
            alert("Error: " + error.toString());
        });
    
    return listaArchivos;
} 

//Function to set up the screen for the character creation
async function armarPantallaCreacionPersonajes(){
    let personajesCreados = document.getElementById("PersonajesCreados");
    personajesCreados.style.display = "none";

    let crearPersonaje = document.getElementById("CrearPersonaje");
    crearPersonaje.style.display = "block";

    listaPersonajes = await getListaArchivos("Personajes");
    listaRopaSuperior = await getListaArchivos("RopaSuperior");
    listaRopaInferior = await getListaArchivos("RopaInferior");
    listaZapatos = await getListaArchivos("Zapatos");

    sobreEscribirImagen(listaPersonajes[0].nombreArchivo, "imagenPersonaje");
    sobreEscribirImagen(listaRopaSuperior[0].nombreArchivo, "imagenRopaSuperior");
    sobreEscribirImagen(listaRopaInferior[0].nombreArchivo, "imagenRopaInferior");
    sobreEscribirImagen(listaZapatos[0].nombreArchivo, "imagenZapatos");

    textoPersonaje = document.getElementById("nombrePersonaje");
    textoPersonaje.textContent = listaPersonajes[0].nombre;
}


//Function to set up the screen to show the characters created
async function armarPantallaMostrarPersonajes(){
    let personajesCreados = document.getElementById("PersonajesCreados");
    personajesCreados.style.display = "block";

    let crearPersonaje = document.getElementById("CrearPersonaje");
    crearPersonaje.style.display = "none";

    let listaPersonajes = await getListaPersonajes();
    if(listaPersonajes.length<5){
        limiteAlcanzado = true;
    }
    mostrarPersonajes(listaPersonajes);
}

//======================Codigo one time run only==========================================

// Get the data parameter from the URL
var dataParam = getParameterByName("data");

// Parse the JSON data
var jsonData = JSON.parse(decodeURIComponent(dataParam));
usuario = jsonData.usuario;
token = jsonData.token;
isCharacterCreated = jsonData.personajeCreado;
nombre = usuario.nombre;


limiteAlcanzado = false;

ingresarNombre(nombre);
if(!isCharacterCreated){
    listaPersonajes = null;
    currentPersonaje = 0;

    listaRopaSuperior = null;
    currentRopaSuperior = 0;

    listaRopaInferior = null;
    currentRopaInferior = 0;

    listaZapatos = null;
    currentZapatos = 0;

    armarPantallaCreacionPersonajes();
}
else {
    limit = 5;
    offset  = 0;
    armarPantallaMostrarPersonajes();
}


//================Funciones de Botones==========================

async function cargarDerecha(){
    if(!limiteAlcanzado){
        offset += 5;
        let listaPersonajes = await getListaPersonajes();
        mostrarPersonajes(listaPersonajes);
        if(listaPersonajes.length<5){
            limiteAlcanzado = true;
        }
    }
    else
    {
        alert("Ya se encuentra en los personajes mas antiguos");
    }
}

async function cargarIzquierda(){
    if(offset>0){
        offset-=5
        let listaPersonajes = await getListaPersonajes();
        mostrarPersonajes(listaPersonajes);
        limiteAlcanzado = false;
    }
    else{
        alert("Ya se encuentra en los personajes mas recientes");
    }
}

function cargarIzquierdaPersonaje(){
    if(currentPersonaje==0){
        currentPersonaje= listaPersonajes.length-1;
    }
    else{
        currentPersonaje--;
    }
    
    sobreEscribirImagen(listaPersonajes[currentPersonaje].nombreArchivo, "imagenPersonaje");
    textoPersonaje = document.getElementById("nombrePersonaje");
    textoPersonaje.textContent = listaPersonajes[currentPersonaje].nombre;
}

function cargarDerechaPersonaje(){
    if(currentPersonaje==listaPersonajes.length-1){
        currentPersonaje= 0;
    }
    else{
        currentPersonaje++;
    }
    
    sobreEscribirImagen(listaPersonajes[currentPersonaje].nombreArchivo, "imagenPersonaje");
    textoPersonaje = document.getElementById("nombrePersonaje");
    textoPersonaje.textContent = listaPersonajes[currentPersonaje].nombre;
}

function cargarIzquierdaRopaSuperior(){
    if(currentRopaSuperior==0){
        currentRopaSuperior= listaRopaSuperior.length-1;
    }
    else{
        currentRopaSuperior--;
    }
    
    sobreEscribirImagen(listaRopaSuperior[currentRopaSuperior].nombreArchivo, "imagenRopaSuperior");
}

function cargarDerechaRopaSuperior(){
    if(currentRopaSuperior==listaRopaSuperior.length-1){
        currentRopaSuperior= 0;
    }
    else{
        currentRopaSuperior++;
    }
    
    sobreEscribirImagen(listaRopaSuperior[currentRopaSuperior].nombreArchivo, "imagenRopaSuperior");
}

function cargarIzquierdaRopaInferior(){
    if(currentRopaInferior==0){
        currentRopaInferior= listaRopaInferior.length-1;
    }
    else{
        currentRopaInferior--;
    }
    
    sobreEscribirImagen(listaRopaInferior[currentRopaInferior].nombreArchivo, "imagenRopaInferior");
}

function cargarDerechaRopaInferior(){
    if(currentRopaInferior==listaRopaInferior.length-1){
        currentRopaInferior= 0;
    }
    else{
        currentRopaInferior++;
    }
    
    sobreEscribirImagen(listaRopaInferior[currentRopaInferior].nombreArchivo, "imagenRopaInferior");
}

function cargarIzquierdaZapatos(){
    if(currentZapatos==0){
        currentZapatos= listaZapatos.length-1;
    }
    else{
        currentZapatos--;
    }
    
    sobreEscribirImagen(listaZapatos[currentZapatos].nombreArchivo, "imagenZapatos");
}

function cargarDerechaZapatos(){
    if(currentZapatos==listaZapatos.length-1){
        currentZapatos= 0;
    }
    else{
        currentZapatos++;
    }
    
    sobreEscribirImagen(listaZapatos[currentZapatos].nombreArchivo, "imagenZapatos");
}

async function guardarPersonaje(){
    const idPersonaje = listaPersonajes[currentPersonaje]._id;
    const idRopaSuperior = listaRopaSuperior[currentRopaSuperior]._id;
    const idRopaInferior = listaRopaInferior[currentRopaInferior]._id;
    const idZapatos = listaZapatos[currentZapatos]._id;

    const url = `http://${HOST}:${PORT}/guardarPersonaje?nombreUsuario=${nombre}&idPersonaje=${idPersonaje}&idRopaSuperior=${idRopaSuperior}&idRopaInferior=${idRopaInferior}&idZapatos=${idZapatos}`

    fetch(url,{
        method: 'POST',
        headers: {
          'Authorization': token,
        }
    })
        .then(response => response.json())
        .then(data =>{
            alert(data.message);
            location.href = "./index.html";
        })
        .catch(error => {
            console.error('Error:', error);
            alert("Error: " + error.toString());
        });
    
}