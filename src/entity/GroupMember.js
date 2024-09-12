const EntitySchema = require('typeorm').EntitySchema;

const GroupMember = new EntitySchema({
  name: 'GroupMember',
  tableName: 'group_member',
  columns: {
    id: {
      primary: true,
      type: 'uuid',
      generated: 'uuid',
    },
    groupChatId: {
      type: 'uuid',
    },
    memberId: {
      type: 'uuid',
    },
    nickname: {
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

module.exports = { GroupMember };
