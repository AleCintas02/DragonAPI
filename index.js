const express = require("express");
const fs = require("fs/promises");


const app = express();

app.use(express.json());

const archivoPersonajes = "personajes.json";

app.get("/dbapi/personajes", async (req, res) => {
  try {
    const contenido = await fs.readFile(archivoPersonajes, "utf-8");
    const personajes = JSON.parse(contenido);
    res.json(personajes);
  } catch (error) {
    console.log("Error al leer el archivo JSON ", error);
    res.status(500).send("Error del servidor");
  }
});

app.get("/dbapi/personajes/:id", async (req, res) => {
  try {
    const contenido = await fs.readFile(archivoPersonajes, "utf-8");
    const data = JSON.parse(contenido);

    // Asegúrate de que hay un array llamado "personajes" en el JSON
    const personajes = data.personajes || [];

    const personaje = personajes.find((c) => c.id === parseInt(req.params.id));

    if (!personaje) {
      // Si no se encuentra el personaje, respondemos con un código de estado 404
      res.status(404).send("Personaje no encontrado");
      return;
    }

    res.json(personaje);
  } catch (error) {
    console.error("Error al leer el archivo JSON ", error);
    res.status(500).send("Error del servidor");
  }
});

app.post("/dbapi/personajes", async (req, res) => {
    try {
      const contenido = await fs.readFile(archivoPersonajes, "utf-8");
      const data = JSON.parse(contenido);
      const personajes = data.personajes || [];
  
      const nuevoPersonaje = {
        id: personajes.length + 1,
        nombre: req.body.nombre,
        descripcion: req.body.descripcion,
        imagen: req.body.imagen,
      };
      personajes.push(nuevoPersonaje);
  
      // Guardar los cambios en el archivo
      await fs.writeFile(archivoPersonajes, JSON.stringify(data, null, 2));
  
      res.status(201).json(nuevoPersonaje); // Devolver el nuevo personaje creado
    } catch (error) {
      console.error("Error al procesar la solicitud POST:", error);
      res.status(500).send("Error interno del servidor");
    }
  });
  

  app.delete('/dbapi/personajes/:id', async (req, res) => {
    try {
        const contenido = await fs.readFile(archivoPersonajes, 'utf-8');
        const data = JSON.parse(contenido);
        const personajes = data.personajes || [];

        const indexPersonaje = personajes.findIndex(c => c.id === parseInt(req.params.id));

        if (indexPersonaje === -1) {
            return res.status(404).send('Personaje no encontrado');
        } else {
            // Eliminar el personaje del array
            personajes.splice(indexPersonaje, 1);

            // Guardar los cambios en el archivo
            await fs.writeFile(archivoPersonajes, JSON.stringify(data, null, 2));

            res.send(personajes);
        }
    } catch (error) {
        console.log("Error:", error);
        res.status(500).send("Error interno del servidor");
    }
});



app.put('/dbapi/personajes/:id', async (req, res) => {
    try {
      const contenido = await fs.readFile(archivoPersonajes, 'utf-8');
      const data = JSON.parse(contenido);
      const personajes = data.personajes || [];
  
      const indexPersonaje = personajes.findIndex(c => c.id === parseInt(req.params.id));
  
      if (indexPersonaje === -1) {
        return res.status(404).send('Personaje no encontrado');
      }
  
      // Actualizar el personaje con los datos proporcionados en el cuerpo de la solicitud
      personajes[indexPersonaje] = {
        ...personajes[indexPersonaje],
        nombre: req.body.nombre || personajes[indexPersonaje].nombre,
        descripcion: req.body.descripcion || personajes[indexPersonaje].descripcion,
        imagen: req.body.imagen || personajes[indexPersonaje].imagen,
      };
  
      // Guardar los cambios en el archivo
      await fs.writeFile(archivoPersonajes, JSON.stringify(data, null, 2));
  
      res.json(personajes[indexPersonaje]);
    } catch (error) {
      console.error('Error al procesar la solicitud PUT:', error);
      res.status(500).send('Error interno del servidor');
    }
  });
  

app.use((req, res) => {
  res.status(404).send("Página no encontrada");
});
app.listen(3000);
console.log("server listening on http://localhost:3000");
