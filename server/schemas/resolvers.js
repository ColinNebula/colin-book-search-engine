const { AuthenticationError } = require('apollo-server-express');
const { User } = require('../models');
const { signToken } = require('../utils/auth');

// Resolvers
const resolvers = {

  
  Query: {
    me: async (parent, args, context) => {
      if (context.user) {
        const userData = await User.findOne({ _id: context.user._id})
        .select('-__v -password')
        populate('books')
        return userData;
      }

      throw new AuthenticationError('You need to be logged in!');

    },

    Mutation: {
        addUser: async (parent, args) => {
        const user = await User.create(args);
        const token = signToken(user);

        return { token, user };
      },
      // user login
      loginUser: async (parent, { email, password }) => {
        const user = await User.findOne({ email });

        if (!user) {
          throw new AuthenticationError('No user found with this email address');
        }

        const correctPw = await user.isCorrectPassword(password);

        if (!correctPw) {
          throw new AuthenticationError('Incorrect credentials');
        }
        const token = signToken(user);

        return { token, user };
      },

      // Save Book
      saveBook: async (parent, { args }, context) => {
        if (context.user) {
          const updatedUser = await User.findByIdAndUpdate(
            { _id: context.user._id },
            { $addToSet: { savedBooks: args.input } },
            { new: true, runValidators: true },
          );

          return updatedUser;

        }
        throw new AuthenticationError('You need to be logged in!');
      },
      // remove Books
      removeBook: async (parent, args, context) => {
        if (context.user) {
          const updatedUser = await User.findByIdAndUpdate(
            { _id: context.user._id },
            { $pull: { savedBooks: { bookId: args.bookId } } },
            { new: true },
          );
          return updatedUser;

        }

        throw new AuthenticationError('Not logged in!');
      }
    }
  }
};

module.exports = resolvers;

