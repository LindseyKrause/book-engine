/** @format */

import { gql } from "@apollo/client";

export default GET_ME = gql` {
	Query: {
		me: async (parent, args, context) => {
			if (context.user) {
				const userData = await User.findOne({ _id: context.user._id })
					.select("-__v -password")
					.populate("books");

				return userData;
			}

			throw new AuthenticationError("Not logged in");
		},
	},
};`


