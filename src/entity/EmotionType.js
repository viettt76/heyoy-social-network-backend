const EntitySchema = require('typeorm').EntitySchema;

const EmotionType = new EntitySchema({
  name: 'EmotionType',
  tableName: 'emotion_type',
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

module.exports = { EmotionType };
