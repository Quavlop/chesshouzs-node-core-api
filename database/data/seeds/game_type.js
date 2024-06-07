const { v4 : uuid } = require('uuid');

exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('game_type').del()
  await knex('game_type_variant').del()

  const gameTypes = await knex('game_type').insert([
    {
      id : uuid(), 
      name : "rapid", 
    }, 
    {
      id : uuid(), 
      name : "blitz", 
    }, 
    {
      id : uuid(), 
      name : "bullet", 
    }
  ]).returning('*'); 

  const gameTypeVariants = await knex('game_type_variant').insert([
    // rapid
    {
      id : uuid(), 
      game_type_id : gameTypes[0].id,
      duration : 600, 
    }, 
    {
      id : uuid(), 
      game_type_id : gameTypes[0].id,
      duration : 900, 
    }, 
    {
      id : uuid(), 
      game_type_id : gameTypes[0].id,
      duration : 1800, 
    },

    // bullet
    {
      id : uuid(), 
      game_type_id : gameTypes[1].id,
      duration : 60, 
    }, 
    {
      id : uuid(), 
      game_type_id : gameTypes[1].id,
      duration : 60, 
      increment : 1,
    }, 
    {
      id : uuid(), 
      game_type_id : gameTypes[1].id,
      duration : 120, 
    },

    // blitz
    {
      id : uuid(), 
      game_type_id : gameTypes[2].id,
      duration : 180, 
    }, 
    {
      id : uuid(), 
      game_type_id : gameTypes[2].id,
      duration : 180, 
      increment : 1,
    }, 
    {
      id : uuid(), 
      game_type_id : gameTypes[2].id,
      duration : 300, 
    },


  
  ])
};
