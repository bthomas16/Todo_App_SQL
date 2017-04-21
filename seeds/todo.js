// title - text
// priority - integer 1, 2, 3
// description - text
// done - boolean
// date - boolean


exports.seed = function(knex, Promise) {
  return knex('todo').del()
    .then(() => {
      const todos = [{
        title: 'Build a crud app',
        description: 'Quickly!',
        priority: 1,
        date: new Date()
      },
      {
        title: 'Take big poop',
        description:"I'm talking huge",
        priority: 2,
        date: new Date()
      },
      {
        title: 'Wipe It Up',
        description: "And don't make a mess!",
        priority: 5,
        date: new Date()
      }];
      return knex('todo').insert(todos)
    });
};
