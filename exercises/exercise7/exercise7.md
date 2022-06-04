
# Instructions

1. Stop the `node index.js` process.

2. Open the `index.js` file under `graphql_api`.

3. Replace the contents of `const typeDefs = gql` as follows:

```javascript
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
```

We have added the SankeyRelationship and a Query definition with a @cypher directive to query the Neo4j database.

We are using UNION in this case to combine results to have multiple levels in the Sankey.

In `sankeyByGeoTypeAllCommoditiesByTransportMode` we first return 

```
{ start: mode, end: commodity, value: tons1000 }
```
then we add
```
{ start: commodity, end: dest, value: tons1000 }
```

This way we can see the end is the same as the start for `commodity` so we can draw a 3-level Sankey.

4. Restart your API application.

```
node index.js
```

5. Go back to the window http://localhost:4001/graphql hosting the Apollo Sandbox. The schema should automatically refresh. If not, you will need to reload the page.

6. Under `Operation` put the following:

```graphql
query SankeyByGeoTypeAllCommoditiesByTransportMode($geoType: String!) {
  sankeyByGeoTypeAllCommoditiesByTransportMode(geoType: $geoType) {
    start
    end
    value
  }
}
```

7. Under `Variables` put the following:

```
{
  "geoType": "Division"
}
```

8. Click the blue `SankeyByGeoTypeAllCommoditiesByTransportMode` button to run the GraphQL. You should get a response back similar to this:

```
{
  "data": {
    "sankeyByGeoTypeAllCommoditiesByTransportMode": [
      {
        "start": "Truck",
        "end": "Meat, poultry, fish, seafood, and their preparations",
        "value": 38907
      },
      {
        "start": "For-hire truck",
        "end": "Alcoholic beverages",
        "value": 14585
      },
      {
        "start": "Parcel, U.S.P.S. or courier",
        "end": "Meat, poultry, fish, seafood, and their preparations",
        "value": 1
      },
      ...more...
      ]
  }
}
```