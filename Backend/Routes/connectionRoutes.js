import express from 'express';
import User from '../Models/User.js';
import Message from '../Models/Message.js';
import authMiddleware from '../Middleware/authMiddleware.js';
const router = express.Router();

router.post('/connect-request', async (req, res) => {
  const { senderId, receiverId } = req.body;
  
  try {
    const receiverUser = await User.findById(receiverId)
    const senderUser=await User.findById(senderId)
    if (!receiverUser||!senderUser) return res.status(404).json({ error: "Receiver not found" });

    if (receiverUser.pendingRequests.some(id => id.toString() === senderId.toString())) {
  return res.status(400).json({ message: 'Request already sent' });
}

    receiverUser.pendingRequests.push(senderId)
    receiverUser.notifications.push({type:"connect",
      sender:senderId,
      receiver:receiverUser._id,
      username: senderUser.username,
      avatar: senderUser.avatar,})
  
    await receiverUser.save();
    res.status(201).json({ message: 'Connection request sent successfully' });
  } catch (error) {
    console.error('Error sending connection request:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/accept', async (req, res) => {
  const { senderId, receiverId } = req.body;  

  try {
    const senderUser = await User.findById(senderId);
    const receiverUser = await User.findById(receiverId);


    if (!senderUser || !receiverUser) {
      return res.status(404).json({ message: 'One or both users not found' });
    }

    // Avoid duplicate match entries
    if (!senderUser.matches.includes(receiverId)) {
      senderUser.matches.push(receiverId);
    }

    if (!receiverUser.matches.includes(senderId)) {
      receiverUser.matches.push(senderId);
    }

    receiverUser.pendingRequests = receiverUser.pendingRequests.filter(
      (id) => id.toString() !== senderId
    );

    receiverUser.notifications = receiverUser.notifications.filter(
      (n) => n.sender.toString() !== senderId
    );

    await senderUser.save();
    await receiverUser.save();

    res.json({ message: "Connection accepted" });


  } catch (error) {
    console.error('Error accepting connection request:', error);
    res.status(500).json({ message: 'Internal server error' });
  }     
});

router.post('/reject', async (req, res) => {
  const { senderId, receiverId } = req.body;      
  try {
      const receiverUser=await User.findById(receiverId)

      receiverUser.pendingRequests = receiverUser.pendingRequests.filter(
      (id) => id.toString() !== senderId);

      receiverUser.notifications = receiverUser.notifications.filter(
      (n) => n.sender.toString() !== senderId);
    

    res.status(200).json({ message: 'Connection request rejected successfully' });
  } catch (error) {
    console.error('Error rejecting connection request:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
})

router.post('/skip', async (req, res) => {
  const { senderId, receiverId } = req.body;

  try {
    const connection = await Connections.findOneAndDelete({
      sender: senderId,
      receiver: receiverId,
    });

    if (!connection) {
      return res.status(404).json({ message: 'Connection request not found' });
    }

    res.status(200).json({ message: 'Connection request skipped successfully' });
  } catch (error) {
    console.error('Error skipping connection request:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.get("/notifications", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate("pendingRequests", "username name avatar"); // ✅ add fields you need

    // Shape data so frontend always gets the same structure as socket
    const notifications = user.pendingRequests.map(sender => ({
      type: "connect",
      sender: {
        _id: sender._id,
        name: sender.name || sender.username,
        avatar: sender.avatar
      },
      receiver: req.user.id
    }));

    res.json(notifications);
  } catch (error) {
    console.error("Error loading notifications:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/matches", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id; // Assuming token payload sets req.user
    const user = await User.findById(userId)
      .populate("matches", "username avatar age _id") // only fetch these fields
      .lean();

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ matches: user.matches }); // Already populated user objects
  } catch (err) {
    console.error("Error fetching matches:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/matches-with-last-messages/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId).populate("matches", "-password");

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
          lastMessage: lastMessage?.content || "", // fallback to "" if none
        };
      })
    );

    res.json(profilesWithLastMessages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch matches and last messages" });
  }
});




export default router;