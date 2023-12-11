const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');
const express = require('express');
const bodyParser = require('body-parser');
const Register = require("./models/Register");
const fs = require('fs');
const { generatePDFContent } = require('./pdfGenerator');


function routes2(
  app,
  db
) {
  app.use(bodyParser.json());
  app.get("/users", async (req, res) => {
    try {
      let name11 = req.query.name11;
      const userDetails = await Register.find({ name11: name11 });
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

      let templatePath;
      switch (name2) {
        case 'Canada':
          templatePath = './templates/canada_template1.pdf';
          break;
        case 'USA':
          templatePath = './templates/usa_template1.pdf';
          break;
        case 'Symans':
          templatePath = './templates/symans_template1.pdf';
          break;
        case 'Singapore':
          templatePath = './templates/singapore_template1.pdf';
          break;
        default:
          templatePath = null;
          break;
      }

      if (!templatePath) {
        return res.status(400).json({ status: "failure", msg: "Invalid address provided" });
      }
      try {
        // Create a new PDF document
        const pdfDoc = await PDFDocument.create();
       
        const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

        const content = generatePDFContent(req.body);

        let currentPage = pdfDoc.addPage();
        let textToWrite = content;
        const MAX_CHARACTERS_PER_PAGE = 2000;

        // Function to handle writing text to a page and managing page breaks
        const writeText = () => {
          currentPage.drawText(textToWrite, {
            x: 50,
            y: currentPage.getHeight() - 50,
            font: helveticaFont,
            size: 12,
            color: rgb(0, 0, 0), // Black color
          });

          if (textToWrite.length > MAX_CHARACTERS_PER_PAGE) {
            textToWrite = textToWrite.slice(MAX_CHARACTERS_PER_PAGE);
            currentPage = pdfDoc.addPage();
          } else {
            textToWrite = '';
          }
        };

        // Write text content to multiple pages
        while (textToWrite.length > 0) {
          writeText();
        }

        // Serialize the PDF to a Uint8Array
        const pdfBytes = await pdfDoc.save();

        // Save the generated PDF on the server
        const fileName = 'generated.pdf';
        const filePath = `./generated_pdfs/${fileName}`;
        fs.writeFileSync(filePath, pdfBytes);

        // Set response headers to serve the PDF
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename="generated.pdf"');
        // Send the generated PDF as the response
        res.send(pdfBytes);

      } catch (err) {
        console.log(err);
        res.status(400).json({ status: "failure", msg: "Exception fired in pdf post api", error: err });
      }
    } catch (err) {
      console.log(err);
      res.status(400).json({ status: "failure", msg: "Exception fired in /register post api", error: err });
    }
  });
}

module.exports = routes2;
