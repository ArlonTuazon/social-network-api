const {Users} = require('../models');

const usersController = {
    createUsers({body}, res) {
        Users.create(body)
        .then(dbUsers => res.json(dbUsers))
        .catch(err => res.status(400).json(err));
    },

    // Get All Users
    getAllUsers(req, res) {
        Users.find({})
           .populate({
               path: 'thoughts', 
               select: '-__v'
            })
            .populate({
                path: 'friends',
                select: '-__v'
            })
           .select('-__v')
           .sort({_id: -1})
        .then(dbUsers => res.json(dbUsers))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
    },

     getUsersById({params}, res) {
        Users.findOne({_id: params.id })
        .populate({
            path: 'thoughts', 
            select: '-__v'
        })
        .populate({
            path: 'friends',
            select: '-__v'
        })
        .select('-__v')
        .then(dbUsers => {
            if(!dbUsers) {
                res.status(404).json({message: 'No User with this ID!'});
                return; 
            }
            res.json(dbUsers)
        })
        .catch(err => {
            console.log(err);
            res.status(400).json(err)
        })
    },

    // Update a current User by ID
    updateUsers({params, body}, res) {
        Users.findOneAndUpdate({_id: params.id}, body, {new: true, runValidators: true})
        .then(dbUsers => {
            if(!dbUsers) {
                res.status(404).json({message: 'No User with this particular ID!'});
                return;
            }
            res.json(dbUser);
        })
        .catch(err => res.json(err))
    },

    deleteUsers({params}, res) {
        Users.findOneAndDelete({_id: params.id})
        .then(dbUsers => {
            if(!dbUsers) {
                res.status(404).json({message: 'No User with this particular ID!'});
                return;
            }
            res.json(dbUser);
        })
        .catch(err => res.status(400).json(err));
    },

    // Delete a current user by ID
    addFriend({params}, res) {
        Users.findOneAndUpdate(
            {_id: params.id}, 
            {$push: { friends: params.friendId}}, 
            {new: true})
        .populate(
            {path: 'friends', 
            select: ('-__v')
        })
        .select('-__v')
        .then(dbUsers => {
            if (!dbUsers) {
                res.status(404).json({message: 'No User with this ID!'});
                return;
            }
        res.json(dbUsers);
        })
        .catch(err => res.json(err));
    },

    // Delete a current Friend
    deleteFriend({ params }, res) {
        Users.findOneAndUpdate(
            {_id: params.id}, 
            {$pull: { friends: params.friendId}},
            {new: true})
        .populate({
            path: 'friends',
            select: '-__v'
        })
        .select('-__v')
        .then(dbUsers => {
            if(!dbUsers) {
                res.status(404).json({message: 'No User with this particular ID!'});
                return;
            }
            res.json(dbUsers);
        })
        .catch(err => res.status(400).json(err));
    }

};

// Export module users controller
module.exports = usersController; 