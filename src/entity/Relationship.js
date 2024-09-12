const EntitySchema = require('typeorm').EntitySchema;

const Relationship = new EntitySchema({
  name: 'Relationship',
  tableName: 'relationship',
  columns: {
    id: {
      primary: true,
      type: 'uuid',
      generated: 'uuid',
    },
    user1: {
      type: 'uuid',
    },
    user2: {
      type: 'uuid',
    },
    relationshipTypeId: {
      type: 'int',
      nullable: true,
    },
    createdAt: { type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)' },
    updatedAt: {
      type: 'timestamp',
      default: () => 'CURRENT_TIMESTAMP(6)',
      onUpdate: 'CURRENT_TIMESTAMP(6)',
    },
  },
  relations: {
    user1: {
      target: 'User',
      type: 'many-to-one',
      joinColumn: {
        name: 'user1',
        referencedColumnName: 'id',
      },
      onDelete: 'CASCADE',
    },
    user2: {
      target: 'User',
      type: 'many-to-one',
      joinColumn: {
        name: 'user2',
        referencedColumnName: 'id',
      },
      onDelete: 'CASCADE',
    },
    relationship: {
      target: 'RelationshipType',
      type: 'many-to-one',
      joinColumn: {
        name: 'relationshipTypeId',
        referencedColumnName: 'id',
      },
    },
  },
  indices: [
    {
      name: 'IDX_RELATIONSHIP_USER1',
      columns: ['user1'],
    },
    {
      name: 'IDX_RELATIONSHIP_USER2',
      columns: ['user2'],
    },
  ],
});

module.exports = { Relationship };
