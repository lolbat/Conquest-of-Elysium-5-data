SELECT DISTINCT t.typeName 
FROM types as t, categories as k, commandID as c
WHERE c.Type = t.typeID AND c.Category = k.categoryID and c.Category = 1
ORDER BY t.typeName