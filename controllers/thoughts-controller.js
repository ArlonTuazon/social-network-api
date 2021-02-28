const {Thoughts, Users} = require('../models');

const thoughtsController = {
    createThoughts({params, body}, res) {
        Thoughts.create(body)
        .then (({_id}) => {
            return Users.findOneAndUpdate(
                {_id: params.userId},
                {$push: {thoughts: _id}},
                { new: true, runValidators: true }
            )
        })
        .then(dbThoughts => {
            if(!dbThoughts) {
                res.status(404).json({message: 'No thoughts with this ID!'});
                return;
            }
            res.json(dbThoughts)
        })
        .catch(err => res.json(err)); 
    },
    getAllThoughts(req,res) {
        Thoughts.find({})
        .populate({
            path: 'reactions', 
            select: '-__v'
        })
        .select('-__v')
        .sort({_id: -1})
        .then(dbThoughts => res.json(dbThoughts))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
    },

    getThoughtsById({params}, res) {
        Thoughts.findOne({ _id: params.id })
        .populate({
            path: 'reactions',
            select: '-__v'
        })
        .select('-__v')
        .then(dbThoughts => {
            if(!dbThoughts) {
            res.status(404).json({message: 'No thoughts with this ID!'});
            return;
        }
        res.json(dbThoughts)
        })
        .catch(err => {
            console.log(err);
            res.sendStatus(400);
        });
    },

    updateThoughts({params, body}, res) {
        Thoughts.findOneAndUpdate({_id: params.id}, body, {new: true, runValidators: true})
        .populate({
            path: 'reactions', 
            select: '-__v'
        })
        .select('-___v')
        .then(dbThoughts => {
            if (!dbThoughts) {
                res.status(404).json({message: 'No thoughts with this ID!'});
                return;
            }
                res.json(dbThoughts);
        })
        .catch(err => res.json(err));
    },

    deleteThoughts({params}, res) {
        Thoughts.findOneAndDelete({_id: params.id})
        .then(dbThoughts => {
            if (!dbThoughts) {
                res.status(404).json({message: 'No thoughts with this ID!'});
                return;
            }
            res.json(dbThoughts);
            })
            .catch(err => res.status(400).json(err));
    },

    //Add the reaction

    addReaction({params, body}, res) {
        Thoughts.findOneAndUpdate({_id: params.thoughtId}, {$push: {reactions: body}}, {new: true, runValidators: true})
        .populate({path: 'reactions', select: '-__v'})
        .select('-__v')
        .then(dbThoughts => {
        if (!dbThoughts) {
            res.status(404).json({message: 'No thoughts with this particular ID!'});
            return;
        }
        res.json(dbThoughts);
        })
        .catch(err => res.status(400).json(err))

    },

    // Delete a reaction by ID
    deleteReaction({params}, res) {
        Thoughts.findOneAndUpdate(
            {_id: params.thoughtId}, 
            {$pull: {reactions: {reactionId: params.reactionId}}},
            {new : true})
        .then(dbThoughts => {
            if (!dbThoughts) {
                res.status(404).json({message: 'No thoughts with this particular ID!'});
                return;
            }
            res.json(dbThoughts);
        })
        .catch(err => res.status(400).json(err));
    }
}

module.exports = thoughtsController;