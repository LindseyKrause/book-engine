/** @format */

import { gql } from "@apollo/client";
const GET_ME = {
    Query: {
        me: async (parent, args, context) => {
            if (context.user) {
                const userData = await User.findOne({ _id: context.user._id })
                    .select('-__v -password')
                    .populate('books')
                
                return userData;
            }

            throw new AuthenticationError('Not logged in');
        }
    }
};

export const GET_ME = gql`
	
`;
