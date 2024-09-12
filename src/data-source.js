const { DataSource } = require('typeorm');

const AppDataSource = new DataSource({
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: null,
  database: 'social_network',
  synchronize: false,
  logging: false,
  entities: ['src/entity/*.js'],
  migrations: ['src/migration/*.js'],
  subscribers: [],
  cli: {
    migrationsDir: 'src/migration',
  },
});

module.exports = { AppDataSource };
