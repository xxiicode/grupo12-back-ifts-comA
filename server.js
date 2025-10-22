import "dotenv/config.js";
import app from "./app.js";
import { conectarDB } from "./config/db.js";

const PORT = process.env.PORT || 3000;

// Conecto a Mongo y luego levanto el servidor
(async () => {
  await conectarDB();

  app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
  });
})();
