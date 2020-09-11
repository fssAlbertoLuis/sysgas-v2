const Umzug = require('umzug');
import db from './models';
import path from 'path';

export default () => {

  let umzug = new Umzug({
    migrations: {
      // indicates the folder containing the migration .js files
      path: path.join(__dirname, './migrations'),
      // inject sequelize's QueryInterface in the migrations
      params: [
        db.sequelize.getQueryInterface(),
        db.Sequelize,
      ]
    },
    // indicates that the migration data should be store in the database
    // itself through sequelize. The default configuration creates a table
    // named `SequelizeMeta`.
    storage: 'sequelize',
    storageOptions: {
      sequelize: db.sequelize
    }
  });
  
  (async () => {
    try {
      // checks migrations and run them if they are not already applied
      await umzug.up();
      console.log('All migrations performed successfully')
    } catch (e) {
      console.log(e);
    }

    umzug = new Umzug({
      migrations: {
        path: path.join(__dirname, './seeders'),
        params: [
          db.sequelize.getQueryInterface()
        ]
      },
      storage: 'sequelize',
      storageOptions: {
        sequelize: db.sequelize
      }
    });
    
    (async () => {
      try {
        await umzug.up()
        console.log('All seeding performed successfully');
      } catch (e) {
        console.log(e);
      }
    })();
  })();
}
