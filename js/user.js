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

// Get the data parameter from the URL
var dataParam = getParameterByName("data");

// Parse the JSON data
var jsonData = JSON.parse(decodeURIComponent(dataParam));
usuario = jsonData.usuario;
token = jsonData.token;

ingresarNombre(usuario.nombre);

