const API_KEY = "4cdea4f60da94c792bdaf01f031effbf";

async function obtenerClima(ciudad) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${ciudad}&appid=${API_KEY}&units=metric&lang=es`;

    try {
        const respuesta = await fetch(url);
        if (!respuesta.ok) {
            throw new Error(`Error en la petición: ${respuesta.status} ${respuesta.statusText}`);
        }
        const data = await respuesta.json();

        console.log("Datos del clima para", ciudad + ":");
        console.log(JSON.stringify(data, null, 2));

    } catch (error) {
        console.error("Error:", error.message);
    }
}

obtenerClima("Caracas");
