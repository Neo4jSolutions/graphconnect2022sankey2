WITH {
    geotype: 'Division',
    commodityType: '02'
} as params
MATCH (stat:CommodityStat)-[:COMMODITY]->(c:Commodity {id: params.commodityType}), (geoType:GeoType {name:params.geotype})
MATCH (geoType)<-[:TYPE]-(sender:Geo)-[:SENT]->(stat:CommodityStat)-[:TO]->(dest:Geo)-[:TYPE]->(geoType)
WITH sender.name as sender, sum(stat.tonsInThousands) as tons1000, dest.name as dest
WHERE tons1000 > 0
RETURN sender, tons1000, dest
