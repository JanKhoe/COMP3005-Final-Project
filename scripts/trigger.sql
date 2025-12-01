CREATE FUNCTION check_new_instructor()
returns TRIGGER
language plpgsql
AS 
$$
begin