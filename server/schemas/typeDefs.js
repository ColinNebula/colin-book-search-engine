const { gql } = require('apollo-server-express');

// TypeDefs construct
const typeDefs = gql`
type User {
  _id: ID!
  username: String!
  email: String
  bookCount: Int
  savedBooks: [Book]
}

  type Book {
    bookId: String! 
    title: String
    author: String
    image: String
    pages: Int
    link: String
    description: String
  }

  type Auth {
    token: ID!
    user: User
  }

  type Query {
    me: User
  }

  input savedBook {
    authors: [String]
    description: String!
    bookId: String!
    image: String
    link: String
    title: String!
  }

  
  type Mutation {
    agreementsPost(agreement: AgreementInput): String
    loginUser(email: String!, password: String!): Auth
    addUser(username: String!, email: String!, password: String!): Auth
    addBook(username: String!, email: String!, password: String!): Auth
    saveBook(input: savedBook!): User
    removeBook(bookId: ID!): User
  }
  
  type Agreement {
    id: Int
  }
  
  input AgreementInput {
    id: Int
  }
`;

module.exports = typeDefs;
