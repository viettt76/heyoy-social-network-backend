const EntitySchema = require('typeorm').EntitySchema;

const Comment = new EntitySchema({
  name: 'Comment',
  tableName: 'comment',
  columns: {
    id: {
      primary: true,
      type: 'uuid',
      generated: 'uuid',
    },
    postId: {
      type: 'uuid',
    },
    commentator: {
      type: 'uuid',
    },
    parentCommentId: {
      type: 'uuid',
      nullable: true,
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
    commentatorInfo: {
      target: 'User',
      type: 'many-to-one',
      joinColumn: {
        name: 'commentator',
        referencedColumnName: 'id',
      },
      onDelete: 'CASCADE',
    },
  },
});

module.exports = { Comment };
