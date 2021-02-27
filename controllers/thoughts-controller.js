const {Thoughts, Users} = require('../models');

const thoughtsController = {
    createThought({params, body}, res) {
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
}