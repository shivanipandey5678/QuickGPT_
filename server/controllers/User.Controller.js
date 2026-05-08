import User from '../models/User.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Chat from '../models/Chat.Model.js';
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key";


//register
export const register = async (req, res) => {
    try {
      const { name, email, password } = req.body;
      
      // Check user exist karta hai ya nahi
      const existingUser = await User.findOne({ email });
      if (existingUser) return res.status(400).json({ message: "User already exists" });
      
   
      const newUser = new User({ name, email, password }); 
      await newUser.save();
      
     
      const token = jwt.sign({ _id: newUser._id, email: newUser.email ,name:newUser.name}, JWT_SECRET, {
        expiresIn: '1d',
      });
      
      res.status(201).json({ user: { _id: newUser._id, name: newUser.name, email: newUser.email, credit: newUser.credit }, token, success: true });
    } catch (error) {
      res.status(500).json({ message: "Something went wrong in register", error: error.message ,success:false});
    }
  };
  



//login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // User find karo email se
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Password compare karo hashed password se
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) return res.status(400).json({ message: "Invalid credentials" });

    // JWT token generate karo
    const token = jwt.sign({ _id: user._id, email: user.email ,name:user.name}, JWT_SECRET, {
      expiresIn: '1d',
    });

    // User info aur token bhejo response me
    res.status(200).json({ 
      user: { 
        _id: user._id,
        name: user.name, 
        email: user.email, 
        credit: user.credit 
      }, 
      token,
      success: true
    });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong in login ", error: error.message });
  }
};

//get current user
export const getUser = async(req,res)=>{
    try {
        const userId = req.user._id;
        const user = await User.findById(userId).select('-password');
        if (!user ) return res.status(404).json({ message: "user not found", success:false});
        res.status(200).json({user:user,success:true,message:"user data fetched successfully!"});

    } catch (error) {
        res.status(500).json({ message: "Something went wrong in user", error: error.message ,success:false});
    }
};

export const getPublishedImages = async(req,res)=> {
  try {
      const publishedImages = await Chat.aggregate([
          {$unwind:'$message'},
          {
              $match :{
                  'message.isImage':true,
                  'message.isPublished':true,
              }
          },
          {
              $project:{
                  _id:0,
                  imageUrl:'$message.content',
                  userName:'$userName'
              }
          }
      ])
      res.json({success:true,images:publishedImages.reverse()})
  } catch (error) {
      res.json({
          success: false,
          message: "Something went wrong",
          error: error.message,
        });
  }
}
