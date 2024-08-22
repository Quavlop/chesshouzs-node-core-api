const { v4 : uuid } = require('uuid');

exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('game_skill').del()
  await knex('game_skill').insert([
        {
          id: uuid(),
          name: 'Enlightened Apprentice',
          description: 'Enables pawn to move like king.',
          for_self: true,
          for_enemy: false,
          radius_x: 1,
          radius_y: 1,
          auto_trigger: false,
          duration: 0, // unlimited
          usage_count: 4,
          type : "buff", 
          permanent : true,
          created_at: knex.fn.now(),
          updated_at: knex.fn.now(), 
      },
      {
          id: uuid(),
          name: 'The Great Wall',
          description: 'Creates wall to block movement.',
          for_self: false,
          for_enemy: false,
          radius_x: 3,
          radius_y: 3,
          auto_trigger: false,
          duration: 4,
          usage_count: 2,
          row_limit : 3, 
          type : "buff", 
          permanent : true,
          created_at: knex.fn.now(),
          updated_at: knex.fn.now()
      },
      {
          id: uuid(),
          name: 'Fog Master',
          description: 'Hides half board vision for enemy',
          for_self: true,
          for_enemy: false,
          radius_x: 7,
          radius_y: 7,
          auto_trigger: true,
          duration: 3,
          usage_count: 1,
          type : "debuff", 
          permanent : false,
          created_at: knex.fn.now(),
          updated_at: knex.fn.now()
      }, 
      {
        id: uuid(),
        name: 'Freezing Wand',
        description: 'Disable enemy piece movement',
        for_self: false,
        for_enemy: true,
        radius_x: 0,
        radius_y: 0,
        auto_trigger: false,
        duration: 1,
        usage_count: 3,
        type : "debuff", 
        permanent : false,
        created_at: knex.fn.now(),
        updated_at: knex.fn.now()
      },
      {
        id: uuid(),
        name: 'Paralyzer',
        description: 'Disable enemy from using skills',
        for_self: false,
        for_enemy: true,
        radius_x: 0,
        radius_y: 0,
        auto_trigger: true,
        duration: 2,
        usage_count: 1,
        type : "debuff", 
        permanent : false,
        created_at: knex.fn.now(),
        updated_at: knex.fn.now()
      },
  ]);
};
