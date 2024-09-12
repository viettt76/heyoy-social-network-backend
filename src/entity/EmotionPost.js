const EntitySchema = require('typeorm').EntitySchema;

const EmotionPost = new EntitySchema({
  name: 'EmotionPost',
  tableName: 'emotion_post',
  columns: {
    id: {
      primary: true,
      type: 'uuid',
      generated: 'uuid',
    },
    postId: {
      type: 'uuid',
    },
    userId: {
      type: 'uuid',
    },
    emotionTypeId: {
      type: 'int',
    },
    createdAt: { type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)' },
    updatedAt: {
      type: 'timestamp',
      default: () => 'CURRENT_TIMESTAMP(6)',
      onUpdate: 'CURRENT_TIMESTAMP(6)',
    },
  },
  relations: {
    emotion: {
      target: 'EmotionType',
      type: 'many-to-one',
      joinColumn: {
        name: 'emotionTypeId',
        referencedColumnName: 'id',
      },
    },
    userInfo: {
      target: 'User',
      type: 'many-to-one',
      joinColumn: {
        name: 'userId',
        referencedColumnName: 'id',
      },
      onDelete: 'CASCADE',
    },
  },
});

module.exports = { EmotionPost };
