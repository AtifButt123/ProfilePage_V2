const router = require('express').Router();
let Person = require('../models/person.model');

// Get all persons
router.route('/').get((req, res) => {
  Person.find()
    .then(persons => res.json(persons))
    .catch(err => res.status(400).json('Error: ' + err));
});

// Route for searching persons by name or publicKey
router.get('/search', async (req, res) => {
  const { name, publicKey } = req.query;

  try {
    let results = [];

    if (name) {
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

// Add a new person
router.route('/add').post((req, res) => {
  const { name, age, publicKey } = req.body;

  const newPerson = new Person({
    name,
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

// Add a friend to the friend array
router.post('/:currentPublicKey/friends', async (req, res) => {
  try {
    const { currentPublicKey } = req.params;
    const { friendId } = req.body;

    // Find the current person
    const currentPerson = await Person.findOne({ publicKey: currentPublicKey });

    if (!currentPerson) {
      return res.status(404).json({ message: 'Current person not found' });
    }

    // Check if the friendId already exists in the friend array
    if (currentPerson.friends.includes(friendId)) {
      return res.status(400).json({ message: 'Friend already added' });
    }

    // Add the friendId to the friend array of the current person
    currentPerson.friends.push(friendId);
    await currentPerson.save();

    // Find the friend person
    const friendPerson = await Person.findOne({ publicKey: friendId });

    if (!friendPerson) {
      return res.status(404).json({ message: 'Friend person not found' });
    }

    // Check if the current person's public key already exists in the friend's friend array
    if (friendPerson.friends.includes(currentPublicKey)) {
      return res.status(400).json({ message: 'Current person already added as friend' });
    }

    // Add the current person's public key to the friend's friend array
    friendPerson.friends.push(currentPublicKey);
    await friendPerson.save();

    res.json({ message: 'Friend added successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get a person by publicKey
router.route('/:publicKey').get((req, res) => {
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

// Delete a person by ID
router.route('/:id').delete((req, res) => {
  Person.findByIdAndDelete(req.params.id)
    .then(() => res.json('Person deleted.'))
    .catch(err => res.status(400).json('Error: ' + err));
});

// Update a person by ID
router.route('/update/:id').post((req, res) => {
  Person.findById(req.params.id)
    .then(person => {
      if (!person) {
        return res.status(404).json({ message: 'Person not found' });
      }

      person.name = req.body.name;
      person.age = Number(req.body.age);
      person.friends = req.body.friends;

      person.save()
        .then(() => res.json('Person updated!'))
        .catch(err => res.status(400).json('Error: ' + err));
    })
    .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;
