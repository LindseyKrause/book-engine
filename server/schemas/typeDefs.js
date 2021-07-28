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
        users: [User]
    }
    type Book {
        authors: [String]
        description: String
        bookId: String
        image: String
        link: String
        title: String
    }
    type Query {
        books: [Book]
    }
    type Auth {
        token: String
        user: User

    }

`

module.exports = { typeDefs };