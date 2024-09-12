const EntitySchema = require('typeorm').EntitySchema;

const User = new EntitySchema({
  name: 'User',
  tableName: 'user',
  columns: {
    id: {
      primary: true,
      type: 'uuid',
      generated: 'uuid',
    },
    firstName: {
      type: 'varchar',
      length: 20,
    },
    lastName: {
      type: 'varchar',
      length: 20,
    },
    username: {
      type: 'varchar',
      length: 30,
    },
    password: {
      type: 'varchar',
      length: 100,
    },
    age: {
      type: 'integer',
    },
    gender: {
      type: 'enum',
      enum: ['male', 'female', 'other'],
      default: 'male',
    },
    homeTown: {
      type: 'varchar',
      length: 50,
      nullable: true,
    },
    school: {
      type: 'varchar',
      length: 50,
      nullable: true,
    },
    workplace: {
      type: 'varchar',
      length: 50,
      nullable: true,
    },
    avatar: {
      type: 'varchar',
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
    relationshipAsUser1: {
      target: 'Relationship',
      type: 'one-to-many',
      inverseSide: 'user1',
    },
    relationshipAsUser2: {
      target: 'Relationship',
      type: 'one-to-many',
      inverseSide: 'user2',
    },
    friendRequestAsSender: {
      target: 'Relationship',
      type: 'one-to-many',
      inverseSide: 'sender',
    },
    friendRequestAsReceiver: {
      target: 'Relationship',
      type: 'one-to-many',
      inverseSide: 'receiver',
    },
    comments: {
      target: 'Comment',
      type: 'one-to-many',
      inverseSide: 'commentatorInfo',
    },
  },
  indices: [
    {
      name: 'IDX_USER_HOME_TOWN',
      columns: ['homeTown'],
    },
    {
      name: 'IDX_USER_SCHOOL',
      columns: ['school'],
    },
    {
      name: 'IDX_USER_WORKPLACE',
      columns: ['workplace'],
    },
  ],
});

module.exports = { User };
