const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const router = express.Router();

//import modelu usera
const User = require('../models/user');

// dodawanie konta
router.post('/signup', (req, res, next) => {
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (user) {
        res.status(409).json({ wiadomość: 'Użytkownik już istnieje' });
      } else {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            res.status(500).json({ error: err });
          } else {
            const user = new User({
              _id: new mongoose.Types.ObjectId(),
              email: req.body.email,
              password: hash,
            });
            user
              .save()
              .then((doc) => {
                res.status(201).json({
                  wiadomość: 'Utworzono nowego użytkownika',
                  szczegóły: doc,
                });
              })
              .catch((err) => res.status(500).json({ error: err }));
          }
        });
      }
    })
    .catch((err) => res.status(500).json({ error: err }));
});

//usuwanie konta
router.delete('/:userId', (req, res, next) => {
  User.findByIdAndDelete(req.params.userId)
    .then(() => {
      res.status(200).json({ wiadomość: 'Użytkownik został usunięty' });
    })
    .catch((err) => res.status(500).json({ error: err }));
});

module.exports = router;
