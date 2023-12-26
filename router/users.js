const express = require('express');
const { default: mongoose } = require('mongoose');
const router = express.Router();
require('../server');

const userSchema = new mongoose.Schema({
    firstname: String,
    lastname: String, 
    email: String,
  });

const User = mongoose.model('Users', userSchema);

// Sample data (replace with MongoDB queries)
router.get('/finduser', async (req, res) => {
    firstname = req.query.firstname
    
    try {
      const user = await User.find({'firstname': firstname});
      if(user.length>0)
      {
        res.json(user);
      }
      else{
        res.status(404).json({ error: 'This user doesnt exist in our db'});
      }
    } 
    catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

router.post('/createuser', async (req, res) => {

    userData = req.body;
    try{
        const newUser = new User(userData);
        await newUser.save();
        res.status(201).json({ message: 'User added successfully', user: newUser });
    }
    catch (error) {
        console.error('Error adding user:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
});

router.put('/updateuseremail', async (req, res) => {
    const id = req.body.id;
    const newemail = req.body.email;
    try{
        const userexists = await User.findById(id);
        if (!userexists) {
            res.status(404).json({ error: 'User not found' });
          }
        else{
        userobj = await User.findById(id)
        userobj.email = newemail;
        userobj.save()
        res.status(204).json({message: 'Sucessfully updated new email', id:id});
        }
    }
    catch (error) {
        console.error('Error updating the new email:', error);
        res.status(500).json({ error:'Internal Server Error'});
    }
});

router.post('/deleteuser/:id', async (req, res) => {
    const id = req.params.id;
    try {
      const userexists = await User.findById(id);
      if (!userexists) {
        res.status(404).json({ error: 'User not found' });
      } else {
        await User.findByIdAndDelete(id);
        res.status(204).json({ message: 'User deleted successfully' });
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
module.exports = router;