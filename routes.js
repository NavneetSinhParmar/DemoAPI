const Register = require("./models/Register");

function routes(
    app,
    db
  ) {
    app.get("/users", async (req,res) => {
       try{
        let name11 = req.query.name11;
        const userDetails = await Register.find({ name11: name11});
        res.status(200).json({ status: "success", name11: name11, db_results: userDetails });
        return;
       } catch (err) {
        console.log(err);
        res.status(400).json({ status: "failure", msg: "Exception fired in /get-users-details GET api", error: err.toString() });
       } 
    })
    app.post("/register", async (req, res) => {
        try {
          let name = req.body.name;
          let num1 = req.body.num1;
          let date = req.body.date;
          let num2 = req.body.num2;
          let num3 = req.body.num3;
          let name2 = req.body.name2;
          let name3 = req.body.name3;
          let name4 = req.body.name4;
          let name5 = req.body.name5;
          let name6 = req.body.name6;
          let name7 = req.body.name7;
          let name8 = req.body.name8;
          let name9 = req.body.name9;
          let name10 = req.body.name10;
          let name11 = req.body.name11;
          let name12 = req.body.name12;
          // Save record to mongo db.
          const new_register = new Register({
            name: name,
            num1: num1,
            date: date,
            num2: num2,
            num3: num3,
            name2: name2,
            name3: name3,
            name4: name4,
            name5: name5,
            name6: name6,
            name7: name7,
            name8: name8,
            name9: name9,
            name10: name10,
            name11: name11,
          });
          await Register.init();
          await new_register.save();
          res.status(200).json({
            status: "success",
            msg: `Registered Data name: ${name} -  date: ${date} by the ${name}`,
          });
        } catch (err) {
          console.log(err);
          res.status(400).json({ status: "failure", msg: "Exception fired in /register post api", error: err });
        }
      });
  }

  module.exports = routes;
