const typeDefs = `
type Query {
  me: User
}

type User {
  _id: ID!
  username: String!
  email: String!
  bookCount: Int
  savedBooks: [Book]!
}

type Book {
  bookId: String!
  authors: [String!]!
  description: String!
  title: String!
  image: String
  link: String
}

type Auth {
  token: ID!
  user: User
}

input BookInput {
  authors: [String!]!
  description: String!
  title: String!
  bookId: String!
  image: String
  link: String
}

input LoginInput {
  email: String!
  password: String!
}


type Mutation {
  login(input: LoginInput!): Auth
  addUser(username: String!, email: String!, password: String!): Auth
  saveBook(book: BookInput!): User
  removeBook(bookId: String!): User
}
`;

module.exports = typeDefs;
