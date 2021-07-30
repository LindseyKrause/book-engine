const { gql } = require('appolo-server-express');
const typeDefs = gql`
    type User {
        _id : String
        username: String
        email: String
        bookCount: String
        savedBooks: [Book]
        password: String
    }
    type Query {
        me: [User]
        users: [User]
        books: [Book]

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
        saveBook(input: BookInput): User
        removeBook(bookId: Int!): User

    }

`

module.exports = { typeDefs };