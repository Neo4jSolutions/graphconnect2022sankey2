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
