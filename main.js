const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
var cors = require("cors");
app.use(cors());
app.use(express.json());
const path = require("path");

mongoose
  .connect("mongodb://localhost:27017/kkm", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then((db) => {
    console.log("db connect");
  })
  .catch((err) => {
    console.log(err);
  });

let intialPath = path.join(__dirname, "public");

app.use(bodyParser.json());
app.use(express.static(intialPath));

app.get("/", (req, res) => {
  res.sendFile(path.join(intialPath, "crude.html"));
});


const sch = {
  StudentId: Number,
  StudentName: String,
  ChemistryMarks: Number,
  PhysicsMarks: Number,
  BiologyMarks: Number,
};
const monmodel = mongoose.model("post", sch);

app.post("/post", async (req, res) => {
  console.log("inside post function");

  const data = new monmodel({
    StudentId: req.body.StudentId,
    StudentName: req.body.StudentName,
    ChemistryMarks: req.body.ChemistryMarks,
    PhysicsMarks: req.body.PhysicsMarks,
    BiologyMarks: req.body.BiologyMarks,
  });
  const val = await data.save();
  res.send(val);
});

app.put("/update/:id", async (req, res) => {
  let upid = req.params.id;

  let upStudentId = req.body.StudentId;
  let upStudentName = req.body.StudentName;
  let upChemistryMarks = req.body.ChemistryMarks;
  let upPhysicsMarks = req.body.PhysicsMarks;
  let upBiologyMarks = req.body.BiologyMarks;

  const updatedData = {
    StudentId: upStudentId,
    StudentName: upStudentName,
    ChemistryMarks: upChemistryMarks,
    PhysicsMarks: upPhysicsMarks,
    BiologyMarks: upBiologyMarks,
  };

  try {
    const data = await monmodel.findOneAndUpdate(
      { _id: upid },
      updatedData,
      { new: true, useFindAndModify: false }
    );

    if (data == null) {
      res.status(404).json({ error: "Nothing found" });
    } else {
      res.json(data);
    }
  } catch (err) {
    res.status(500).json({ error: "An error occurred" });
  }
});

app.get("/fulldata", (req, res) => {
  monmodel.find((err, val) => {
    if (err) {
      console.log(err);
    } else {
      res.json(val);
    }
  });
});

app.put("/del/:id", function (req, res) {
  // let delStudentId = req.params.id;
  let delStudentId = mongoose.Types.ObjectId(req.params.id);
  monmodel.findOneAndDelete({ _id: delStudentId }, function (err, does) {
    if (err) {
      res.status(500).json({ error: "An error occurred" });
    } else {
      if (does == null) {
        res.status(404).json({ error: "Wrong id" });
      } else {
        res.json({ message: "Deleted successfully" });
      }
    }
  });
});

app.listen(3007, () => {
  console.log("on port 3007");
});
