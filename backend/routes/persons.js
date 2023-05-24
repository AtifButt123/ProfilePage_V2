const router = require('express').Router();
const Person = require('../models/person.model');

// Get all persons
router.get('/', (req, res) => {
  Person.find()
    .then(persons => res.json(persons))
    .catch(err => res.status(400).json('Error: ' + err));
});

// Route for searching persons by name or publicKey
router.get('/search', async (req, res) => {
  const { name, publicKey } = req.query;

  try {
    let results = [];

    if (name && publicKey) {
      results = await Person.find({
        $or: [
          { name: { $regex: `^${name}`, $options: 'i' } },
          { publicKey },
        ],
      });
    } else if (name) {
      results = await Person.find({ name: { $regex: `^${name}`, $options: 'i' } });
    } else if (publicKey) {
      results = await Person.find({ publicKey });
    } else {
      return res.status(400).json({ message: 'Invalid search parameters' });
    }

    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});


// Add a new person to the db
router.post('/add', (req, res) => {
  const { name, nickName, age, publicKey } = req.body;

  const newPerson = new Person({
    name,
    nickName,
    age: Number(age),
    publicKey,
  });

  newPerson.save()
    .then(() => res.json('Person added!'))
    .catch(err => res.status(400).json('Error: ' + err));
});

// Get all friends of a person by publicKey
router.get('/:publicKey/friends', async (req, res) => {
  try {
    const { publicKey } = req.params;
    const person = await Person.findOne({ publicKey });

    if (!person) {
      return res.status(404).json({ message: 'Person not found' });
    }

    const friends = person.friends;
    const friendNames = [];

    for (const friendId of friends) {
      const friend = await Person.findOne({ publicKey: friendId });

      if (friend) {
        friendNames.push(friend.name);
      }
    }

    res.json({ friendNames });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get a person by publicKey
router.get('/:publicKey', (req, res) => {
  const { publicKey } = req.params;

  Person.findOne({ publicKey })
    .then(person => {
      if (person) {
        res.json(person);
      } else {
        res.status(404).json({ message: 'Person not found' });
      }
    })
    .catch(err => res.status(400).json('Error: ' + err));
});

// Send a friend request from currentPublicKey to friendId
router.post('/:currentPublicKey/sendFriendRequest', async (req, res) => {
  try {
    const { currentPublicKey } = req.params;

    const currentPerson = await Person.findOne({ publicKey: currentPublicKey });
    const friendPerson = await Person.findOne({ publicKey: req.body.publicKey });

    if (!currentPerson) {
      return res.status(404).json({ message: 'Current person not found' });
    }

    if (!friendPerson) {
      return res.status(404).json({ message: 'Friend person not found' });
    }


    // Check if the current person's public key already exists in the friend's friendRequests array
    if (friendPerson.friendRequests.includes(currentPublicKey)) {
      return res.status(400).json({ message: 'Friend request already received' });
    }

    friendPerson.friendRequests.push(currentPublicKey);
    await friendPerson.save();

    res.json({ message: 'Friend request sent successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Accept a friend request from friendId to currentPublicKey
router.post('/:currentPublicKey/acceptFriendRequest', async (req, res) => {
  try {
    const { currentPublicKey } = req.params;
    const currentPerson = await Person.findOne({ publicKey: currentPublicKey });
    const friendPerson = await Person.findOne({ publicKey: req.body.publicKey }); // Access publicKey property

    if (!currentPerson) {
      return res.status(404).json({ message: 'Current person not found' });
    }

    if (!friendPerson) {
      return res.status(404).json({ message: 'Friend person not found' });
    }

    currentPerson.friendRequests = currentPerson.friendRequests.filter(id => id !== friendPerson.publicKey); // Use friendPerson.publicKey
    currentPerson.friends.push(friendPerson.publicKey); // Use friendPerson.publicKey
    await currentPerson.save();

    friendPerson.friends.push(currentPublicKey);
    await friendPerson.save();
    window.alert("Friend request accepted successfully");
    res.json({ message: 'Friend request accepted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});


// Route for fetching friend requests for a specific user
router.get('/:publicKey/friendRequests', async (req, res) => {
  try {
    const { publicKey } = req.params;

    // Find the person by publicKey
    const person = await Person.findOne({ publicKey });

    if (!person) {
      return res.status(404).json({ message: 'Person not found' });
    }

    const friendRequests = person.friendRequests;

    res.json({ friendRequests });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/:publicKey/friendCount', async (req, res) => {
  try {
    const { publicKey } = req.params;
    const person = await Person.findOne({ publicKey });

    if (!person) {
      return res.status(404).json({ message: 'Person not found' });
    }

    const friendCount = person.friends.length;

    res.json({ friendCount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});


module.exports = router;
