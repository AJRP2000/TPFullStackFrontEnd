const PORT = 5000;
const HOST = "localhost"

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

function getImagen(archivo, idImagen){

    // Create an image element
    var img = document.createElement("img");

    img.id=idImagen;
    img.setAttribute("class", "imagen");
    img.src = "./imagenes/" + archivo;
    return img;
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
        const imagenPersonaje = getImagen(currentObject.archivoPersonaje, "Personaje" + (i+1).toString());
        const imagenRopaSuperior = getImagen(currentObject.archivoRopaSuperior, "RopaSuperior" + (i+1).toString());
        const imagenRopaInferior = getImagen(currentObject.archivoRopaInferior, "RopaInferior" + (i+1).toString());
        const imagenZapatos = getImagen(currentObject.archivoZapatos, "Zapatos" + (i+1).toString());


        const personaje = document.getElementById("personaje" + (i+1).toString());

        personaje.appendChild(imagenPersonaje);
        personaje.appendChild(imagenRopaSuperior);
        personaje.appendChild(imagenRopaInferior);
        personaje.appendChild(imagenZapatos);
    }
}

//Function to retrieve created characters
async function getListaPersonajes(nombre, offset, limit){
    const url = `http://${HOST}:${PORT}/personajesCreadosPorUser?nombreUsuario=${nombre}&limit=${limit}&offset${offset}`

    let listaPersonajes = await fetch(url,{
        method: 'GET',
        headers: {
          'Authorization': token,
        }
    })
        .then(response => response.json())
        .catch(error => {
            console.error('Error:', error);
        });
    
    return listaPersonajes;
}


//Function to set up the screen for the character creation
function armarPantallaCreacionPersonajes(){
}


//Function to set up the screen to show the characters created
async function armarPantallaMostrarPersonajes(){
    let personajesCreados = document.getElementById("PersonajesCreados");
    personajesCreados.style.display = "block";

    let crearPersonaje = document.getElementById("CrearPersonaje");
    crearPersonaje.style.display = "none";

    let listaPersonajes = await getListaPersonajes(nombre, offset, limit);
    if(listaPersonajes.length<5){
        limiteAlcanzado = true;
    }
    mostrarPersonajes(listaPersonajes);
}



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

}
else {
    limit = 5;
    offset  = 0;
    armarPantallaMostrarPersonajes();
}


async function cargarDerecha(){
    if(!limiteAlcanzado){
        offset += 5;
        let listaPersonajes = await getListaPersonajes(nombre, offset, limit);
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
        let listaPersonajes = await getListaPersonajes(nombre, offset, limit);
        mostrarPersonajes(listaPersonajes);
    }
    else{
        alert("Ya se encuentra en los personajes mas recientes");
    }
}