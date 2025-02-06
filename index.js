const mongoose = require('mongoose');
const MenuItems = require('./schema.js');
const express = require('express');
const { resolve } = require('path');
require('dotenv').config();

const app = express();
app.use(express.json());
const port = 3010;

app.use(express.static('static'));


const DB_URL = process.env.DB_URL;
app.get('/', (req, res) => {
  res.sendFile(resolve(__dirname, 'pages/index.html'));
});

mongoose.connect(DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch((err) => console.error('MongoDB connection error:', err));

app.post('/menu',(req,res)=>{
  const newMenu = new MenuItems(req.body);
  newMenu.save()
  .then(()=>res.status(201).json({message : "items added sucessfully"}))
  .catch((error)=>res.status(500).json({message:"error ahs occured"}))

})


app.get('/menu', async (req, res) => {
  try {
    const menuItems = await MenuItems.find();
    res.status(200).json({
      success: true,
      data: menuItems,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching menu items',
      error: error.message,
    });
  }
});


app.put('/menu/:id',(req,res)=>{
  const ids=req.params.id
  const Data=req.body
  MenuItems.findByIdAndUpdate(ids,Data,{new:true})
  .then((updatedItem)=>{
    if (!updatedItem){
      return res.status(404).json({ message: " item not found" });
    }
    res.status(200).json({ message: " item updated ", updatedItem })
  })
  .catch((err)=>{
    res.status(500).json({message:"error occured",error:err.message})
  })
})
app.delete('/menu/:id',(req,res)=>{
  const ids=req.params.id
  MenuItems.findByIdAndDelete(ids)
  .then((Item)=>{
    if(!Item){
        return res.status(404).json({ message: " item not found" });
      }
      return res.status(200).json(
        {
           message: " item deleted successfully", Item 
          });
  })
  .catch((error)=>{
    res.status(500).json(
      { 
        message : " error occurred", error: error.message 
      });
  })
})


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});








