const { gql, ApolloServer } = require("apollo-server");
const { Neo4jGraphQL } = require("@neo4j/graphql");
const neo4j = require("neo4j-driver");
require("dotenv").config();

const typeDefs = gql`
  type Geo {
    id: String!
    name: String
  }

  type SankeyRelationship {
    start: String
    end: String
    value: Int
  }

  type Query {
    sankeyByGeoTypeAllCommoditiesByTransportMode(geoType: String!): [SankeyRelationship] @cypher(statement: """
      WITH {
          geotype: $geoType,
          ignoreModes: ['Multiple modes','All modes','Single modes']
      } as params
      MATCH (stat:CommodityStat)-[:COMMODITY]->(c:Commodity), (geoType:GeoType {name:params.geotype})
      MATCH (stat:CommodityStat)-[:BY]->(mode:TransportMode)
      WHERE NOT mode.name IN params.ignoreModes
      MATCH (geoType)<-[:TYPE]-(sender:Geo)-[:SENT]->(stat:CommodityStat)-[:TO]->(dest:Geo)-[:TYPE]->(geoType)
      WITH mode.name as mode, c.name as commodity, sum(stat.tonsInThousands) as tons1000
      WHERE tons1000 > 0
      RETURN {
        start: mode, 
        value: tons1000, 
        end: commodity
      } as result
      UNION
      WITH {
          geotype: $geoType,
          ignoreModes: ['Multiple modes','All modes','Single modes']
      } as params
      MATCH (stat:CommodityStat)-[:COMMODITY]->(c:Commodity), (geoType:GeoType {name:params.geotype})
      MATCH (stat:CommodityStat)-[:BY]->(mode:TransportMode)
      WHERE NOT mode.name IN params.ignoreModes
      MATCH (geoType)<-[:TYPE]-(sender:Geo)-[:SENT]->(stat:CommodityStat)-[:TO]->(dest:Geo)-[:TYPE]->(geoType)
      WITH c.name as commodity, sum(stat.tonsInThousands) as tons1000, dest.name as dest
      WHERE tons1000 > 0
      RETURN {
        start: commodity, 
        value: tons1000, 
        end: dest
      } as result
    """)
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