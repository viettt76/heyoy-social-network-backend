const EntitySchema = require('typeorm').EntitySchema;

const GroupChat = new EntitySchema({
  name: 'GroupChat',
  tableName: 'group_chat',
  columns: {
    id: {
      primary: true,
      type: 'uuid',
      generated: 'uuid',
    },
    name: {
      type: 'varchar',
    },
    avatar: {
      type: 'varchar',
      nullable: true,
    },
    administratorId: {
      type: 'uuid',
    },
    createdAt: { type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)' },
    updatedAt: {
      type: 'timestamp',
      default: () => 'CURRENT_TIMESTAMP(6)',
      onUpdate: 'CURRENT_TIMESTAMP(6)',
    },
  },
});

module.exports = { GroupChat };
