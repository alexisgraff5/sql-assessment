INSERT INTO vehicles (make, model, year) VALUES ($1, $2, $3)
RETURNING *;