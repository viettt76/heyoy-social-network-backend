const EntitySchema = require('typeorm').EntitySchema;

const PictureOfPost = new EntitySchema({
  name: 'PictureOfPost',
  tableName: 'picture_of_post',
  columns: {
    id: {
      primary: true,
      type: 'uuid',
      generated: 'uuid',
    },
    postId: {
      type: 'uuid',
    },
    picture: {
      type: 'varchar',
    },
    createdAt: { type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)' },
    updatedAt: {
      type: 'timestamp',
      default: () => 'CURRENT_TIMESTAMP(6)',
      onUpdate: 'CURRENT_TIMESTAMP(6)',
    },
  },
  relations: {
    picture: {
      target: 'Post',
      type: 'many-to-one',
      joinColumn: {
        name: 'postId',
        referencedColumnName: 'id',
      },
      onDelete: 'CASCADE',
    },
  },
});

module.exports = { PictureOfPost };
