import Chat from "../models/Chat.Model.js";

//new chat
export const createChat = async(req,res)=>{
    try {
        const userId= req.user._id;
        const chatData = {
            userId,
            message:[],
            name:'New Chat',
            userName:req.user.name
        }

        const newChat =await Chat.create(chatData)
        res.json({success:true,message:'Chat created',chat: newChat})
    } catch (error) {
        res.status(500).json({
          success: false,
          message: "Something went wrong in createChat",
          error: error.message,
          userId: req.user?._id,
          userName: req.user?.name,
        });
      }
}


//get all chats 
export const getAllChats = async(req,res)=>{
    try {
        const userId = req.user._id;
        const allChats = await Chat.find({userId}).sort({updatedAt:-1});
        if (allChats.length === 0) return res.json({ message:"No chat found",success:true ,chats:allChats});
        
        res.status(200).json({chats:allChats,success:true,message:"fetched all chats successfully"});

    } catch (error) {
        res.status(500).json({ message: "Something went wrong in getAllChats", error: error.message,success:false });
    }
};


//delete  chat
export const deleteChat = async(req,res)=>{
    try {
        const userId= req.user._id;
        const {chatId}=req.body;
        const delChat = await Chat.deleteOne({_id:chatId ,userId});
        if (!delChat || delChat.length===0 ) return res.status(404).json({ message: "chat not found",success:false });
        res.status(200).json({deletedChat:delChat, success:true, message:'chat deleted'});

    } catch (error) {
        res.status(500).json({ message: "Something went wrong in deleteChat", error: error.message,success:false });
    }
};