SELECT g.categoryName, c.Command, c.Hint, c."Default", c.Description
FROM CommandID AS c, categories AS g
WHERE c.Category = g.categoryID AND g.categoryID = 12
ORDER BY c.Command