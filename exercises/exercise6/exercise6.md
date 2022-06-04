
# Instructions

1. Make a directory off of your project folder called `graphql_api`. Do not nest it under your React project.

```
mkdir graphql_api
```

2. Change directory to `graphql_api`

```
cd graphql_api
```

3. Initialize the project

```
npm init -y
```

4. Install Neo4j GraphQL, Apollo Server, and dependencies

```
npm install @neo4j/graphql neo4j-driver graphql apollo-server dotenv
```

5. Add a `.env` file to the `graphql_api` folder. 

Use the following for your .env file if you have set up the **local Neo4j** database.

```
NEO4J_USER=neo4j
NEO4J_PASSWORD=<use password from exercise 5>
NEO4J_URI=bolt://localhost:7687
NEO4J_DATABASE=neo4j

GRAPHQL_LISTEN_PORT=4001
```

If you are using the **Neo4j Aura** database, please use these settings:

```
NEO4J_USER=readonly
NEO4J_PASSWORD=password
NEO4J_URI=neo4j+s://033df296.databases.neo4j.io
NEO4J_DATABASE=neo4j

GRAPHQL_LISTEN_PORT=4001
```

These are environment variables that will be used in your API application. Make sure you save the file.

6. Add an `index.js` file with the following contents:

```javascript
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
```

Make sure you save the file.

7. Run your API application.

```
node index.js
```

You should see:
```
GraphQL server ready on http://localhost:4001/
```

8. In your Web Browser, goto http://localhost:4001/graphql. This is the Apollo Sandbox application.

9. Click `Query your server` to see some GraphQL endpoints.

10. Under `Operation` add the following:

```graphql
query Geos {
  geos {
    id
    name
  }
}
```

11. Click the blue `Geos` button to run the GraphQL. You should get a response back similar to this:

```json
{
  "data": {
    "geos": [
      {
        "id": "0300000US1",
        "name": "New England Division"
      },
      {
        "id": "0300000US2",
        "name": "Middle Atlantic Division"
      },
      {
        "id": "0300000US3",
        "name": "East North Central Division"
      },
      ...more...
    ]
  }
}
```