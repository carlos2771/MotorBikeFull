export const validateSchema = (schema) => (req, res, next) => {
  try {
    schema.parse(req.body); // este parse lo proporciona el schema
    next();
  } catch (error) {
    return res.status(400).json({ error: error.errors.map(error => error.message) }); // el zod tiene un array que contiene un objeto asi que de ese array solo tomare el atributo mensaje
  }
};
