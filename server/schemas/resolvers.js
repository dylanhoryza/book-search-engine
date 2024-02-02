// import user model
const { User } = require('../models');
// import sign token function from auth
const { signToken, AuthenticationError } = require('../utils/auth');



const resolvers = {
  Query: {
    me: async (_, __, context) => {
      // Ensure the user is logged in
      if (context.user) {
        return context.user;
      }
      throw new AuthenticationError('Not logged in');
    },
  },
  Mutation: {
    createUser: async (_, { input }, res) => {
      const user = await User.create(input);

      if (!user) {
        throw new Error('Something went wrong!');
      }

      const token = signToken(user);
      return { token, user };
    },

    login: async (_, { input }, res) => {
      const user = await User.findOne({
        $or: [{ username: input.username }, { email: input.email }],
      });

      if (!user) {
        throw new AuthenticationError("Can't find this user");
      }

      const correctPw = await user.isCorrectPassword(input.password);

      if (!correctPw) {
        throw new AuthenticationError('Wrong password!');
      }

      const token = signToken(user);
      return { token, user };
    },

    saveBook: async (_, { book }, context) => {
      // Ensure the user is logged in
      if (context.user) {
        const updatedUser = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $addToSet: { savedBooks: book } },
          { new: true, runValidators: true }
        );
        return updatedUser;
      }

      throw new AuthenticationError('Not logged in');
    },

    deleteBook: async (_, { bookId }, context) => {
      // Ensure the user is logged in
      if (context.user) {
        const updatedUser = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $pull: { savedBooks: { bookId } } },
          { new: true }
        );

        if (!updatedUser) {
          throw new Error("Couldn't find user with this id!");
        }

        return updatedUser;
      }

      throw new AuthenticationError('Not logged in');
    },
  },
}





module.exports = resolvers;