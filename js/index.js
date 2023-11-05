const PORT = 5000;
const HOST = "localhost"

//Function that logs in the user
function logInSubmit(event){
    event.preventDefault(); // Prevent the default form submission

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const url = `http://${HOST}:${PORT}/logIn?nombre=${username}&pinNumerico=${password}`;

    // You can use the URL for your GET request here
    console.log("GET request URL:", url);

    fetch(url)
        .then(response => response.json())
        .then(data => {
            console.log(data);

            // Convert the JSON object to a URL-encoded query string
            const queryString = encodeURIComponent(JSON.stringify(data));

            // Construct the URL with the query parameter
            const html = `user.html?data=${queryString}`;

            // Refresh the page with the new html
            location.href = html;
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function getImagen(archivo, idImagen){

    // Create an image element
    var img = document.createElement("img");

    img.id=idImagen;
    img.setAttribute("class", "imagen");
    img.src = "./imagenes/" + archivo;
    return img;
}

function mostrarPersonajes(listaPersonajes){
    for (let i = 0; i < listaPersonajes.length; i++) {
        const currentObject = listaPersonajes[i];
        const nombreUsuario = currentObject.nombreUsuario;
        const imagenPersonaje = getImagen(currentObject.archivoPersonaje, "Personaje" + (i+1).toString());
        const imagenRopaSuperior = getImagen(currentObject.archivoRopaSuperior, "RopaSuperior" + (i+1).toString());
        const imagenRopaInferior = getImagen(currentObject.archivoRopaInferior, "RopaInferior" + (i+1).toString());
        const imagenZapatos = getImagen(currentObject.archivoZapatos, "Zapatos" + (i+1).toString());
        
        creador = document.createElement('Creador' + (i+1).toString());
        creador.textContent =  "Creador: " + nombreUsuario;

        const personaje = document.getElementById("personaje" + (i+1).toString());

        personaje.appendChild(creador);
        personaje.appendChild(imagenPersonaje);
        personaje.appendChild(imagenRopaSuperior);
        personaje.appendChild(imagenRopaInferior);
        personaje.appendChild(imagenZapatos);
    }
}

//Function that extracts the 5 last characters created
function extraerPersonajes(){
    const url = `http://${HOST}:${PORT}/personajesCreadosRecientemente`;

    fetch(url)
    .then(response => response.json())
    .then(data => {
            mostrarPersonajes(data);
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

extraerPersonajes();