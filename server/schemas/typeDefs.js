/** @format */

const { gql } = require("apollo-server-express");
const typeDefs = gql`
	type User {
		_id: String
		username: String
		email: String
		bookCount: String
		savedBooks: [Book]
		password: String
	}
	type Query {
		me: [User]
		user: [User]
		books: [Book]
		book: [Book]
	}
	type Book {
		authors: [String]
		description: String
		bookId: String
		image: String
		link: String
		title: String
	}
	type Auth {
		token: String
		user: User
	}
	input bookInput {
		authors: [String]
		description: String
		bookId: String
		image: String
		link: String
		title: String
	}
	type Mutation {
		login(email: String!, password: String!): Auth
		addUser(username: String!, email: String!, password: String!): Auth
		saveBook(input: bookInput): User
		deleteBook(bookId: Int!): User
        addBook(title: String!, author: String!, pages: Int!): Book
        
	}
`;

module.exports = typeDefs;
