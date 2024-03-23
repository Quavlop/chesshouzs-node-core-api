// Update with your config settings.

const env = require('dotenv').config({path : '../.env'});


module.exports = {

  development: {
    client: 'pg',
    connection : process.env.DB_URL,
    migrations : {
      directory : "./data/migrations"
    },
    seeds : {
      directory : './data/seeds'
    }
  },

  staging: {
    client: 'pg',
    connection : process.env.DB_URL,    
    migrations : {
      directory : "./data/migrations"
    },
    seeds : {
      directory : './data/seeds'
    }    
  },

  production: {
    client: 'pg',
    connection : process.env.DB_URL,    
    migrations : {
      directory : "./data/migrations"
    },
    seeds : {
      directory : './data/seeds'
    }    
  }

};
