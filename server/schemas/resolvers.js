//HINT: DEFINE THE QUERY AND MUTATION FUNCTIONALITY TO WORK WITH MONGOOSE MODELS

const { AuthenticationError } = require('apollo-server-express');
const { User } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
    Query: {
        me: async (parent, args, context) => {
            if (context.user) {
                const userData = await User.findOne({_id: context.user_id})
                    .select('-__v -password')
                return userData;
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

        saveBook: async (parent, {bookData}, {user}) => {
            if (user) {
                const updatedUser = await User.findByIdAndUpdate(
                    { _id: user._id },
                    { $push: { savedBooks: bookData} },
                    { new: true, runValidators: true }
                );

                return updatedUser;
            }

            throw new AuthenticationError('You need to be logged in!');
        },
        //TODO!  NEED TO ADD DELETE BOOK! 
        deleteBook: async (parent, { bookId }, {user}) => {
            if (user) {
                const user = await User.findByIdAndUpdate(
                    //where
                    { _id: user._id },
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
