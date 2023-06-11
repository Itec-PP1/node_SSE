require('dotenv').config();
const { Sequelize } = require('sequelize');
const path = require('path');
const process = require('process');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const configPath = path.resolve(__dirname, '../..', 'config/config.json');
const config = require(configPath)[env];

// Crea una instancia de Sequelize con la configuración de la base de datos
const sequelize = new Sequelize(process.env.DB_POSTGRES_NAME, config.username, config.password, config);

// Función para eliminar la base de datos
async function deleteDatabase() {
  try {
    // Elimina la base de datos
    await sequelize.query(`DROP DATABASE IF EXISTS ${config.database}`);
    console.log('Base de datos eliminada exitosamente.');
  } catch (error) {
    console.error('Error al eliminar la base de datos:', error);
  } finally {
    // Cierra la conexión a la base de datos
    await sequelize.close();
  }
}

// Ejecuta la función para eliminar la base de datos
deleteDatabase();