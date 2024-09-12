const EntitySchema = require('typeorm').EntitySchema;

const FriendRequest = new EntitySchema({
  name: 'FriendRequest',
  tableName: 'friend_request',
  columns: {
    id: {
      primary: true,
      type: 'uuid',
      generated: 'uuid',
    },
    senderId: {
      type: 'uuid',
    },
    receiverId: {
      type: 'uuid',
    },
    createdAt: { type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)' },
    updatedAt: {
      type: 'timestamp',
      default: () => 'CURRENT_TIMESTAMP(6)',
      onUpdate: 'CURRENT_TIMESTAMP(6)',
    },
  },
  relations: {
    sender: {
      target: 'User',
      type: 'many-to-one',
      joinColumn: {
        name: 'senderId',
        referencedColumnName: 'id',
      },
      onDelete: 'CASCADE',
    },
    receiver: {
      target: 'User',
      type: 'many-to-one',
      joinColumn: {
        name: 'receiverId',
        referencedColumnName: 'id',
      },
      onDelete: 'CASCADE',
    },
  },
});

module.exports = { FriendRequest };
