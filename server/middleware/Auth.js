import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key";

export const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: "No token provided" });
    
    const token = authHeader.split(" ")[1];
    
    if (!token) return res.status(401).json({ message: "No token provided" });
    
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // decoded me user id aur email hota hai
    next();
  } catch (error) {
    res.status(401).json({ message: "Unauthorized", error: error.message });
  }
};
