import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User Already Exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await User.create({
      name, email, password: hashedPassword
    });

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '5d' }

    );
    res.status(201).json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email
      },
      token
    });
  }
  catch (error) {
    console.error(`We Faced this error:${error}`);
    res.status(500).json({ message: 'Something went wrong ' });
  }
});

//Login

router.post('/login',async(req,res)=>{
  try{
    const {email,password}=req.body;
    const user=await User.findOne({email});
    
    if(!user){
      return res.status(404).json({message:'User Not Found'});
    }

    const pswdCorrect=await bcrypt.compare(password,user.password);
    if(!pswdCorrect){
      return res.status(400).json({message:'Wrong Password'});
    }

    const token=jwt.sign(
    {userId:user._id},
    process.env.JWT_SECRET,
    {expiresIn:'5d'},
    );

    res.status(200).json({
      user:{
        _id:user._id,
        name:user.name,
        email:user.email,
      },
      token
    });
  }catch(err){
    console.error(err);
    res.status(500).json({message:'Something went wrong'});
    
  }
});


export default router;