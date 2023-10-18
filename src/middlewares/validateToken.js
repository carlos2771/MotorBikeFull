// se hace esta carpeta ya que son las funciones que se van a ejecutar antes de que la ruta se ejecute
// el next dice continua despues de esta funcion
import jwt from "jsonwebtoken";
import { TOKEN_SECRET } from "../config.js";

export const authRequired = (req, res, next) => {
  const { token } = req.cookies;
  if (!token)
    return res.status(401).json({ message: "no hay token, no hay autorizacion" });
    jwt.verify(token, TOKEN_SECRET, (err, user) => {
        if (err) return res.status(401).json({ message: "toke invalido" });
        req.user = user
        next();
  });

};
