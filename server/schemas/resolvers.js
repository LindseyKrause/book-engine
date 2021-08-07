//HINT: DEFINE THE QUERY AND MUTATION FUNCTIONALITY TO WORK WITH MONGOOSE MODELS

const { AuthenticationError } = require('apollo-server-express');
const { User } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
    Query: {
        me: async (parent, args, context) => {
            if (context.user) {
                return User.findOne({_id: context.user_id})
                    .select('-__v -password')
                    .populate('books')
            }
        },
    },

    Mutation: {
        addUser: async (parent, args) => {
            const user = await User.create(args);
            const token = signToken(user);

            return { token, user };
        },
        login: async (parent, { email, password }) => {
            const user = await User.findOne({ email });
//conditional gates
            if (!user) {
                throw new AuthenticationError('No user exists ');
            }

            const correctPw = await user.isCorrectPassword(password);

            if (!correctPw) {
                throw new AuthenticationError('Incorrect credentials');
            }

            const token = signToken(user);
            return { token, user };
        },
        // books: async (parent, { username }) => {
        //     const params = username ? { username } : {};
        //     return book.find(params).sort({ createdAt: -1 });
        // },
        // book: async (parent, { _id }) => {
        //     return book.findOne({ _id });
        // },

        saveBook: async (parent, {bookData}, context) => {
            if (context.user) {
                const updatedUser = await User.findByIdAndUpdate(
                    { _id: context.user._id },
                    { $push: { savedBooks: bookData} },
                    { new: true }
                );

                return updatedUser;
            }

            throw new AuthenticationError('You need to be logged in!');
        },
        //TODO!  NEED TO ADD DELETE BOOK! 
        deleteBook: async (parent, { bookId }, context) => {
            if (context.user) {
                const user = await User.findByIdAndUpdate(
                    //where
                    { _id: context.user._id },
                    //how to update user
                    { $pull: { savedBooks: { bookId } } },
                    // create a new list
                    { new: true }
                );

                return user;
            }
            throw new AuthenticationError("You need to be logged in to do that!");
        },
    },
};

module.exports = resolvers;
