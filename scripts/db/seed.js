require('dotenv').config();
const { exec } = require('child_process');

// Comando npm run seed-db
exec('npm run seed-db', (error, stdout, stderr) => {
  if (error) {
    console.error(`Error al ejecutar el comando: ${error.message}`);
    return;
  }
  if (stderr) {
    console.error(`Error en la salida del comando: ${stderr}`);
    return;
  }
  console.log(`Salida del comando: ${stdout}`);
});