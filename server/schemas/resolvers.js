//HINT: DEFINE THE QUERY AND MUTATION FUNCTIONALITY TO WORK WITH MONGOOSE MODELS

const { AuthenticationError } = require('apollo-server-express');
const { User } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
    Query: {
        user: async (parent, { username, params }) => {
            return User.findOne({ username })
                .select('-__v -password')
                .populate('books')
        },
        
        users: async () => {
            return User.find()
                .select('-__v -password')
                .populate('books')
                .populate('friends');
        },
        books: async (parent, { username }) => {
            const params = username ? { username } : {};
            return book.find(params).sort({ createdAt: -1 });
        },
        book: async (parent, { _id }) => {
            return book.findOne({ _id });
        }
    },

    Mutation: {
        addUser: async (parent, args) => {
            const user = await User.create(args);
            const token = signToken(user);

            return { token, user };
        },
        login: async (parent, { email, password }) => {
            const user = await User.findOne({ email });

            if (!user) {
                throw new AuthenticationError('Incorrect credentials');
            }

            const correctPw = await user.isCorrectPassword(password);

            if (!correctPw) {
                throw new AuthenticationError('Incorrect credentials');
            }

            const token = signToken(user);
            return { token, user };
        },
        addBook: async (parent, args, context) => {
            if (context.user) {
                const book = await book.create({ ...args, username: context.user.username });

                await User.findByIdAndUpdate(
                    { _id: context.user._id },
                    { $push: { books: book._id } },
                    { new: true }
                );

                return book;
            }

            throw new AuthenticationError('You need to be logged in!');
        },
        //TODO!  NEED TO ADD DELETE BOOK! 
    }
};

module.exports = resolvers;
