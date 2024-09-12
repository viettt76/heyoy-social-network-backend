const EntitySchema = require('typeorm').EntitySchema;

const Message = new EntitySchema({
  name: 'Message',
  tableName: 'message',
  columns: {
    id: {
      primary: true,
      type: 'uuid',
      generated: 'uuid',
    },
    sender: {
      type: 'uuid',
    },
    receiver: {
      type: 'uuid',
      nullable: true,
    },
    recipientGroup: {
      type: 'uuid',
      nullable: true,
    },
    message: {
      type: 'text',
      nullable: true,
    },
    picture: {
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
});

module.exports = { Message };
