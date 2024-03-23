const { v4 : uuid } = require('uuid');

exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('users').del()
  await knex('users').insert([
      {
        id : uuid(),
        username : "IngenHouzs",
        email : "farreldinar@gmail.com",
        password : "$2a$12$gJxx5.4WVLwFLYpuU36kwub939iKE/OK8/0KqppRG.5Bc6PjIFoqK" // 12345678
      },
      {
        id : uuid(),        
        username : "HouzsIngen",
        email : "farreldinarta12@gmail.com",
        password : "$2a$12$gJxx5.4WVLwFLYpuU36kwub939iKE/OK8/0KqppRG.5Bc6PjIFoqK" // 12345678
      },
      {
        id : uuid(),        
        username : "farreldxza",
        email : "farreldinarta@gmail.com",
        password : "$2a$12$gJxx5.4WVLwFLYpuU36kwub939iKE/OK8/0KqppRG.5Bc6PjIFoqK" // 12345678
      }            
  ]);
};