const { AppDataSource } = require('../data-source');
const { Message } = require('../entity/Message');
const { Relationship } = require('../entity/Relationship');

const relationshipRepository = AppDataSource.getRepository(Relationship);
const messageRepository = AppDataSource.getRepository(Message);

class ChatController {
  // [GET] /chat/messages?friendId=
  async getMessages(req, res, next) {
    const { id } = req.userToken;
    const { friendId } = req.query;
    const messages = await messageRepository
      .createQueryBuilder('message')
      .select([
        'message.id as id',
        'message.sender as sender',
        'message.receiver as receiver',
        'message.message as message',
      ])
      .where(
        `(sender = :id AND receiver = :friendId) OR (sender = :friendId AND receiver = :id)`
      )
      .setParameters({ id, friendId })
      .orderBy('message.createdAt')
      .getRawMany();

    res.status(200).json(messages);
  }

  // [POST] /chat/message
  async sendMessage(req, res, next) {
    const { io } = req;
    const { id } = req.userToken;
    const { friendId, message } = req.body;
    const newMessage = await messageRepository.save({
      sender: id,
      receiver: friendId,
      message: message,
    });

    io.to(`user-${friendId}`).emit('newMessage', newMessage);

    res.status(201).json({
      id: newMessage.id,
    });
  }
}

module.exports = new ChatController();
