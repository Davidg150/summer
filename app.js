var express = require("express"); //call in express framework

var app = express();

app.set("view engine", "ejs");

app.use(express.static("views"));
app.use(express.static("style"));
app.use(express.static("scripts"));
app.use(express.static("images"));

var mysql = require('mysql');

var fs = require('fs')
var bodyParser = require("body-parser")
app.use(bodyParser.urlencoded({extended:true}));



// ###################### Start of SQL

const db = mysql.createConnection({

host: 'den1.mysql1.gear.host',
user: 'davidg15',
password: 'Pm08Vu_O9R!b',
database: 'davidg15'



});


db.connect((err) =>{

    if(err){
        console.log("go back and check the connection details. Something is wrong")
        
    }

    else{

        console.log('Looking good the database is connected')
    }

})



//app.get('/createtable', function(req,res){
//
  //      let sql = 'CREATE TABLE cars (Id int NOT NULL AUTO_INCREMENT PRIMARY KEY, Name varchar(255), Price int, Image varchar(255), Extras varchar(255))';
    //    
      //  let query = db.query(sql, (err, res) => {
//
  //              if(err) throw err;
//
  //              console.log(res);
//
  //      });
//
  //      res.send("Youve created a DB table")


//})



//app.get('/insert', function(req,res){

  //  let sql = 'INSERT INTO cars (Name, Price, Image, Extras) VALUES ("BMW M5", 80000, "bmwm5.jpg", "Alloys") ';

  //  let query = db.query(sql, (err, res) => {

     //       if(err) throw err;

    //        console.log(res);

 //   });

 //   res.send("Youve created a Product")


//})

//url to get products


app.get('/products', function(req,res){

    let sql = 'SELECT * FROM cars';

    let query = db.query(sql, (err, result) => {

            if(err) throw err;

            console.log(result);

        res.render('products', {result})

    });

   // res.send("Youve created a Product")


})




app.get('/addproduct', function(req,res){

   

        res.render('addproduct')

    });



    app.post('/addproduct', function(req,res){

    let sql = 'INSERT INTO cars (Name, Price, Image, Extras) VALUES ("'+req.body.name+'", "'+req.body.price+'", "'+req.body.image+'", "'+req.body.extras+'") ';

      let query = db.query(sql, (err, res) => {
  
             if(err) throw err;
  
             console.log(res);
  
      });
      res.redirect('/products')
   })




app.get('/editproduct/:id', function(req,res){

    let sql = 'SELECT * FROM cars WHERE Id = "'+req.params.id+'" ';

    let query = db.query(sql, (err, result) => {

            if(err) throw err;

            console.log(result);

        res.render('editproduct', {result})

    });



})


app.post('/editproduct/:id', function(req,res){

    let sql = 'UPDATE cars SET Name="'+req.body.name+'", Price="'+req.body.price+'",  Image="'+req.body.image+'", Extras= "'+req.body.extras+'" WHERE Id = "'+req.params.id+'" ';

      let query = db.query(sql, (err, res) => {
  
             if(err) throw err;
  
             console.log(res);
  
      });
      res.redirect('/products')
   })



   app.get('/delete/:id', function(req,res){

    let sql = 'DELETE FROM cars WHERE Id = "'+req.params.id+'" ';

      let query = db.query(sql, (err, res) => {
  
             if(err) throw err;
  
             console.log(res);
  
      });
      res.redirect('/products')
   })

// ###################### End of SQL





var contact = require("./model/contact.json"); // allow the app to access the contact.json 


//call the first function on a get request to render something on the screen

app.get("/", function(req, res){

res.render("index") // we set the response to send back the string hello world
console.log("Text sent... app is working") // used to output activity in the console
});

app.get("/contacts", function(req, res){
res.render("contacts", {contact});
    console.log("heres the contacts page");

});


app.get("/add", function(req, res){
    res.render("add");
        console.log("heres another page");
    
    });

    app.post("/add", function(req,res){

        // Stp 1 is to find the largest id in the JSON file
        
                function getMax(contacts, id){ // function is called getMax
                var max // the max variable is declared here but still unknown
        
                    for(var i=0; i<contacts.length; i++){ // loop through the contacts in the json fil as long as there are contcats to read
                        if(!max || parseInt(contact[i][id])> parseInt(max[id]))
                        max = contacts[i];
                            }
        
                return max;
                 }
    
                 
                 // make a new ID for the next item in the JSON file
                 
                  maxCid = getMax(contact, "id") // calls the gstMax function from above and passes in parameters 
                 
                 var newId = maxCid.id + 1; // add 1 to old largest to make ne largest
                 
                 // show the result in the console
                 console.log("new Id is " + newId)
                 
                 
                 // we need to get access to what the user types in the form
                 // and pass it to our JSON file as the new data
                 
                 var contactsx = {
                     
                     
                     id: newId,
                     name: req.body.name,
                     Comment: req.body.comment,
                     email: req.body.email
                     
                     
                 }
                 
                 
        fs.readFile('./model/contact.json', 'utf8',  function readfileCallback(err){
            
            if(err) {
                throw(err)
                
            } else {
                
                contact.push(contactsx); // add the new data to the JSON file
                json = JSON.stringify(contact, null, 4); // this line structures the JSON so it is easy on the eye
                fs.writeFile('./model/contact.json',json, 'utf8', function(){})
                
            }
            
        })         
                 
         res.redirect('/contacts') ;
        
    });





    app.get('/editcontact/:id', function(req, res){
        function chooseContact(indOne){
            return indOne.id === parseInt(req.params.id)
            }

            var indOne = contact.filter(chooseContact);
        
        
        
        
        res.render('editcontact', {res:indOne});
     
     });
    









//Code fo the edit JSON data

app.post('/editcontact/:id', function(req, res){

    var json = JSON.stringify(contact);

    var keyToFind = parseInt(req.params.id); // call name from the url
   
   
    var index = contact.map(function(contact) {return contact.id}).indexOf(keytoFind)

    var z = parseInt(req.params.id);
    var x = req.body.name
    var y = req.body.comment

    contact.splice(index, 1, {name: x, Comment: y, email: req.body.email, id: z });

    json = JSON.stringify(contact, null, 4);
    fs.writeFile('./model/contact.json', json, 'utf8', function(){});

    res.redirect("/contacts");

 });



 app.get('/deletecontact/:id', function(req, res) {
   
    var json = JSON.stringify(contact);
  
    var keyToFind = parseInt(req.params.id); // call name from the url
      
    var data = contact; //this declares data = str2
     
    var index = data.map(function(contact) {return contact.id;}).indexOf(keyToFind)
      
    contact.splice(index ,1); // deletes one item from position represented by index  (its position) from above
  
    json = JSON.stringify(contact, null, 4);
 
    fs.writeFile('./model/contact.json', json, 'utf8', function(){}); // Writing the data back to the file
              console.log("RContact Deleted");
     
  
  res.redirect("/contacts");
  });
  
        

 
    
//The final step is to set up somewhere for our application to run.
// this code provides the server port for our application to run on
app.listen(process.env.PORT || 3000, process.IP || "0.0.0.0", function() {
console.log("Thanks be to god :)")
  
});
