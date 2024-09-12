const EntitySchema = require('typeorm').EntitySchema;

const PostVisibility = new EntitySchema({
  name: 'PostVisibility',
  tableName: 'post_visibility',
  columns: {
    id: {
      primary: true,
      type: 'int',
      generated: true,
    },
    name: {
      type: 'varchar',
    },
  },
});

module.exports = { PostVisibility };
