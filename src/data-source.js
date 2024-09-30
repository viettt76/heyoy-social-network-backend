const { DataSource } = require('typeorm');

const AppDataSource = new DataSource({
  type: 'mysql',
  host: 'johnny.heliohost.org',
  port: 3306,
  username: 'viettt75_admin',
  password: 'CZuAa4@zzxoi',
  database: 'viettt75_heyoy_social',
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
