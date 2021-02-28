const { Schema, model, Types } = require('mongoose');

const dateFormat = require('../utils/dateformat');

const ReactionsSchema = new Schema (
    {
        reactionId: {
            type: Schema.Types.ObjectId,
            default: () => new Types.ObjectId()
        },
        
        reactionBody: {
            type: String,
            required: 'Reaction is required',
            maxlength: 280
        },

        username: {
            type: String,
            required: 'Username required'
        },

        createdAt: {
            type: Date,
            default: Date.now,
            get: createdAtVal => dateFormat(createdAtVal)
        }
    },
    {
        toJSON: {
            getters: true
        }
    }
);

//Thoughts Schema

const ThoughtsSchema = new Schema (
    {
        thoughtText: {
            type: String,
            required: 'Thoughts required',
            minlength: 1,
            maxlength: 280
        },

        createdAt: {
            type: Date,
            default: Date.now,
            get: createdAtVal => dateFormat(createdAtVal)
        },

        username: {
            type: String,
            reuired: 'Username required to create thoughts'
        },

        reactions: [ReactionsSchema]
    },

    {
        toJSON: {
            virtuals: true,
            getters: true
        },
        id: false
    }
);

// get total count of reactions
ThoughtsSchema.virtual('reactionCount').get(function() {
    return this.reactions.length;
});

const Thoughts = model('Thoughts', ThoughtsSchema);

module.exports = Thoughts;