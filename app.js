const express = require('express');
const bodyParser = require('body-parser');
const date = require(__dirname + "/date.js")
const mongoose = require('mongoose');
const app = express();

const port = 3000;

app.set('view engine', "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

mongoose.connect("mongodb://127.0.0.1:27017/todolistDB");

const itemsSchema = {
  name: String
};

const Item = mongoose.model('Item', itemsSchema);

const item1 = new Item({
  name: "Eat Food"
});

const item2 = new Item({
  name: "Read Book"
});

const item3 = new Item({
  name: "Complete Assignment"
});

const defaultItems = [item1, item2, item3]; 


app.get('/', (req, res) => {
  let day = date.getDate();
  Item.find({}, function(err, foundItems){

    if(foundItems.length == 0){
      Item.insertMany(defaultItems, function(err){
        if(err){
          console.log(err);
        } else {
          console.log("Successfully saved default items to Database");
        }
      });
      res.redirect("/");
    }
    else{
      res.render("list", {listTitle: day, newListItems: foundItems});
    }   
  });
});

// Home Route

app.post("/", function (req, res) {
  const itemName = req.body.newItem;

  const item = new Item({
    name: itemName
  });

  item.save();
  res.redirect("/");
});

//Deletion 
app.post("/delete", function(req, res) {
  const deleteItem = req.body.delete;
  Item.findByIdAndRemove(deleteItem, function(err){
    if(!err){
      console.log("Successfully deleted the item");
      res.redirect("/");
      // Item.find({}, function(error, foundItems){
      //   if(foundItems.length == 0){
          
      //   }
      // })
    }
  })
});

// work Route

app.get("/work", function (req, res) {
  res.render("list", {listTitle: "Work List", newListItems: workItems});
});


app.listen(port, () => {
  console.log(`Server live on port ${port}`)
});