const EntitySchema = require('typeorm').EntitySchema;

const Post = new EntitySchema({
  name: 'Post',
  tableName: 'post',
  columns: {
    id: {
      primary: true,
      type: 'uuid',
      generated: 'uuid',
    },
    poster: {
      type: 'uuid',
    },
    visibilityTypeId: {
      type: 'int',
    },
    content: {
      type: 'text',
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
    visibility: {
      target: 'PostVisibility',
      type: 'many-to-one',
      joinColumn: {
        name: 'visibilityTypeId',
        referencedColumnName: 'id',
      },
    },
    pictures: {
      target: 'PictureOfPost',
      type: 'one-to-many',
      inverseSide: 'picture',
    },
    emotions: {
      target: 'EmotionPost',
      type: 'one-to-many',
    },
  },
});

module.exports = { Post };
