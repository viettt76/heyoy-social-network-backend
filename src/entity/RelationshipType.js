const EntitySchema = require('typeorm').EntitySchema;

const RelationshipType = new EntitySchema({
  name: 'RelationshipType',
  tableName: 'relationship_type',
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

module.exports = { RelationshipType };
