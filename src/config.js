export const TOKEN_SECRET = "alguna llave secreta" || process.env.TOKEN_SECRET
export const secretKey = process.env.JWT_SECRET || 'secreto';
export const origin = process.env.ORIGIN || 'http://localhost:5173' 
export const dbConnect = "mongodb+srv://admin:admin@cluster0.49jaesh.mongodb.net/motorBike" || process.env.DBCONNECT
export const port = 3000 || process.env.PORT