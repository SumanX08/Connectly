import express from 'express';
import User from '../Models/User.js';
import Message from '../Models/Message.js';
import authMiddleware from '../Middleware/authMiddleware.js';

const router = express.Router();

router.post('/connect-request', authMiddleware, async (req, res) => {
  const { senderId, receiverId } = req.body;
  try {
    const [receiverUser, senderUser] = await Promise.all([
      User.findById(receiverId).select('_id username name avatar pendingRequests notifications').lean(false),
      User.findById(senderId).select('_id username name avatar').lean(),
    ]);
    if (!receiverUser || !senderUser) return res.status(404).json({ error: 'User not found' });

    if (receiverUser.pendingRequests.some((id) => id.toString() === String(senderId))) {
      return res.status(400).json({ message: 'Request already sent' });
    }

    receiverUser.pendingRequests.push(senderId);
    receiverUser.notifications.push({
      type: 'connect',
      sender: senderId,
      receiver: receiverUser._id,
      username: senderUser.username,
      avatar: senderUser.avatar,
    });

    await receiverUser.save();
    res.status(201).json({ message: 'Connection request sent successfully' });
  } catch (error) {
    console.error('Error sending connection request:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/accept', authMiddleware, async (req, res) => {
  const { senderId, receiverId } = req.body;
  try {
    const [senderUser, receiverUser] = await Promise.all([
      User.findById(senderId).select('_id matches').lean(false),
      User.findById(receiverId).select('_id matches pendingRequests notifications').lean(false),
    ]);
    if (!senderUser || !receiverUser) return res.status(404).json({ message: 'One or both users not found' });

    if (!senderUser.matches.includes(receiverId)) senderUser.matches.push(receiverId);
    if (!receiverUser.matches.includes(senderId)) receiverUser.matches.push(senderId);

    receiverUser.pendingRequests = receiverUser.pendingRequests.filter((id) => id.toString() !== String(senderId));
    receiverUser.notifications = receiverUser.notifications.filter((n) => n.sender.toString() !== String(senderId));

    await Promise.all([senderUser.save(), receiverUser.save()]);
    res.json({ message: 'Connection accepted' });
  } catch (error) {
    console.error('Error accepting connection request:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/reject', authMiddleware, async (req, res) => {
  const { senderId, receiverId } = req.body;
  try {
    const receiverUser = await User.findById(receiverId).select('pendingRequests notifications').lean(false);
    if (!receiverUser) return res.status(404).json({ message: 'User not found' });

    receiverUser.pendingRequests = receiverUser.pendingRequests.filter((id) => id.toString() !== String(senderId));
    receiverUser.notifications = receiverUser.notifications.filter((n) => n.sender.toString() !== String(senderId));

    await receiverUser.save(); 
    res.status(200).json({ message: 'Connection request rejected successfully' });
  } catch (error) {
    console.error('Error rejecting connection request:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/notifications', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate('pendingRequests', 'username name avatar')
      .lean();

    const notifications = (user?.pendingRequests || []).map((sender) => ({
      type: 'connect',
      sender: { _id: sender._id, name: sender.name || sender.username, avatar: sender.avatar },
      receiver: req.user.id,
    }));

    res.json(notifications);
  } catch (error) {
    console.error('Error loading notifications:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/matches', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId)
      .populate('matches', 'username avatar age _id')
      .lean();
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({ matches: user.matches || [] });
  } catch (err) {
    console.error('Error fetching matches:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/matches-with-last-messages/:userId', authMiddleware, async (req, res) => {
  const { userId } = req.params;
  try {
    if (String(userId) !== String(req.user.id)) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const user = await User.findById(userId).populate('matches', '-password').lean(false);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const profilesWithLastMessages = await Promise.all(
      user.matches.map(async (match) => {
        const lastMessage = await Message.findOne({
          $or: [
            { senderId: userId, receiverId: match._id },
            { senderId: match._id, receiverId: userId },
          ],
        })
          .sort({ timestamp: -1 })
          .lean();

        return {
          ...match.toObject(),
          lastMessage: lastMessage?.content || '',
          lastMessageTime: lastMessage?.timestamp || null,
        };
      })
    );

    profilesWithLastMessages.sort((a, b) => {
      const timeA = a.lastMessageTime ? new Date(a.lastMessageTime).getTime() : 0;
      const timeB = b.lastMessageTime ? new Date(b.lastMessageTime).getTime() : 0;
      return timeB - timeA;
    });

    res.json(profilesWithLastMessages);
  } catch (err) {
    console.error('matches-with-last-messages error:', err);
    res.status(500).json({ error: 'Failed to fetch matches and last messages' });
  }
});

export default router;
