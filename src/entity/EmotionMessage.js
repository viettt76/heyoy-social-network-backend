const EntitySchema = require('typeorm').EntitySchema;

const EmotionMessage = new EntitySchema({
  name: 'EmotionMessage',
  tableName: 'emotion_message',
  columns: {
    id: {
      primary: true,
      type: 'uuid',
      generated: 'uuid',
    },
    messageId: {
      type: 'uuid',
    },
    userId: {
      type: 'uuid',
    },
    emo: {
      type: 'varchar',
    },
    createdAt: { type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)' },
    updatedAt: {
      type: 'timestamp',
      default: () => 'CURRENT_TIMESTAMP(6)',
      onUpdate: 'CURRENT_TIMESTAMP(6)',
    },
  },
});

module.exports = { EmotionMessage };
