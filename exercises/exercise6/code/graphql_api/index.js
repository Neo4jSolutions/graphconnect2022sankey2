const { gql, ApolloServer } = require("apollo-server");
const { Neo4jGraphQL } = require("@neo4j/graphql");
const neo4j = require("neo4j-driver");
require("dotenv").config();

const typeDefs = gql`
    type Geo {
      id: String!
      name: String
    }
`;

const driver = neo4j.driver(
  process.env.NEO4J_URI,
  neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD)
);

const neoSchema = new Neo4jGraphQL({ typeDefs, driver });

neoSchema.getSchema().then((schema) => {
    const server = new ApolloServer({
        schema: schema,
        context: { driverConfig: { database: process.env.NEO4J_DATABASE } }       
    });

    server.listen({ port: process.env.GRAPHQL_LISTEN_PORT }).then(({ url }) => {
        console.log(`GraphQL server ready on ${url}`);
    });
});