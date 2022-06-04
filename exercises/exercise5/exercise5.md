
# Options

You can choose to set up the Neo4j database locally or you can use an existing Neo4j Aura database. 

* Neo4j Local Database: follow the instructions below - 
[Instructions for Setting up the Neo4j Database locally](#Instructions for Setting up the Neo4j Database locally)
* Neo4j Aura Database: skip to the bottom - [Query the Data](#Query the Data)

# Instructions for Setting up the Neo4j Database locally

1. Open Neo4j Desktop Create a Project or Select an existing Project

2. Click +Add > Local DBMS 

3. Enter the following

- Name: `GraphConnectSankey`
- Password: <password>
- Version should be 4.4.X (older versions will probably also work) - mine is 4.4.6
- Click Create

4. Install APOC
- Click on `GraphConnectSankey`
- Click on Plugins
- Click Install

5. Start `GraphConnectSankey`

# Load the Data

1. Click on ... next to GraphConnectSankey

2. Click on Terminal

3. cd import

4. Copy the `foodstuff_transport_w_header.csv` file to the import directory

```
cp <project_folder>/exercises/exercise5/data/foodstuff_transport_w_header.csv .
```

5. Open up Neo4j Browser at http://localhost:7474

6. Login with the username/password you entered above

7. In Neo4j Browser, run the following constraint commands before loading the data:

```cypher
CREATE CONSTRAINT FOR (gt:GeoType) REQUIRE (gt.name) IS NODE KEY;
CREATE CONSTRAINT FOR (g:Geo) REQUIRE (g.id) IS NODE KEY;
CREATE CONSTRAINT FOR (t:TransportMode) REQUIRE (t.id) IS NODE KEY;
CREATE CONSTRAINT FOR (c:Commodity) REQUIRE (c.id) IS NODE KEY;
CREATE CONSTRAINT FOR (stat:CommodityStat) REQUIRE (stat.id) IS NODE KEY;
```

8. In Neo4j Browser, load the data with the following command:

```cypher
:auto USING PERIODIC COMMIT LOAD CSV WITH HEADERS FROM 'file:///foodstuff_transport_w_header.csv' AS line
WITH line
WHERE line.DDESTGEO IS NOT NULL 
MERGE (unknown:GeoType {name:'Unknown'})
MERGE (state:GeoType {name:'State'})
MERGE (division:GeoType {name:'Division'})

WITH
    unknown, 
    state,
    division,
    line,
    line.GEO_ID + '_' + line.DDESTGEO + '_' + line.COMM + '_' + line.DMODE as statId,
    CASE 
        WHEN line.GEOTYPE = '02' THEN state
        WHEN line.GEOTYPE = '12' THEN division
        ELSE unknown
    END as sourceGeoType,
    CASE 
        WHEN line.DDESTGEO STARTS WITH '03' THEN division
        WHEN line.DDESTGEO STARTS WITH '04' THEN state
        ELSE unknown
    END as destGeoType

WITH line, statId, sourceGeoType, destGeoType

MERGE (sourceGeo:Geo {id: line.GEO_ID})
SET sourceGeo.name = line.GEO_TTL

MERGE (destGeo:Geo {id: line.DDESTGEO})
SET destGeo.name = line.DDESTGEO_TTL

MERGE (sourceGeo)-[:TYPE]->(sourceGeoType)
MERGE (destGeo)-[:TYPE]->(destGeoType)

MERGE (stat:CommodityStat {id: statId})

MERGE (mode:TransportMode {id: line.DMODE})
SET mode.name = line.DMODE_TTL

MERGE (commodity:Commodity {id: line.COMM})
SET commodity.name = line.COMM_TTL

MERGE (sourceGeo)-[:SENT]->(stat)
MERGE (stat)-[:COMMODITY]->(commodity)
MERGE (stat)-[:TO]->(destGeo)
MERGE (stat)-[:BY]->(mode)

SET stat += {
  avgMilesPerShipment: toInteger(line.AVGMILE),
  tonMilesInMillions: toInteger(line.TMILE),
  dollarValueInMillions: toInteger(line.VAL),
  tonsInThousands: toInteger(line.TON)
}
```

# Query the Data

1. Open Neo4j Browser

* If you installed the database locally, this will most likely already be open.
* If you are using the Neo4j Aura database, please go here:

https://browser.neo4j.io/?connectURL=neo4j%2Bs%3A%2F%2Fneo4j%40033df296.databases.neo4j.io%2F&_ga=2.79294291.690573303.1654353665-207984786.1641826653&_gac=1.19861962.1652485996.Cj0KCQjwg_iTBhDrARIsAD3Ib5i_w2OUPoawle7qu4nmzsfomvV0gNnOHXhcH2cuW-PDfz3a5AtISaEaAo1aEALw_wcB

2. Run this Cypher statement to verify you can get results back.

```cypher
WITH {
    geotype: 'Division',
    commodityType: '02'
} as params
MATCH (stat:CommodityStat)-[:COMMODITY]->(c:Commodity {id: params.commodityType}), (geoType:GeoType {name:params.geotype})
MATCH (geoType)<-[:TYPE]-(sender:Geo)-[:SENT]->(stat:CommodityStat)-[:TO]->(dest:Geo)-[:TYPE]->(geoType)
WITH sender.name as sender, sum(stat.tonsInThousands) as tons1000, dest.name as dest
WHERE tons1000 > 0
RETURN sender, tons1000, dest
```

The data should return 34 records. Here are the first 5:

| sender | tons1000 | dest |
| ------ | -------- | ---- |
| "West North Central Division" | 117777 | "West South Central Division" |
| "East South Central Division" | 105 | "East North Central Division" |
| "West North Central Division" | 3539 | "Middle Atlantic Division" |
| "South Atlantic Division" | 4209 | "Middle Atlantic Division" |
| "Mountain Division" | 11112 | "West North Central Division" |

