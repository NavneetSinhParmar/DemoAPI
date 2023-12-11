const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');
const express = require('express');
const bodyParser = require('body-parser');
const Register = require("./models/Register");
const { generatePDFContent } = require('./pdfGenerator');
const { generatePDFContentOfcanada } = require('./templates/canada_pdf');
const { generatePDFContentofcayman } = require('./templates/cayman_pdf');
const { generatePDFContentofsingapore } = require('./templates/singapore_pdf');
const { generatePDFContentofusa } = require('./templates/usa_pdf');
const fs = require('fs').promises;
const os = require('os');
const path = require('path');


function routes(app, db) {
  app.use(bodyParser.json());

  // Your other routes...

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
      
      // Create a new PDF document
      const pdfDoc = await PDFDocument.create();
      const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

      // const content = generatePDFContent(req.body);
      let content;
      switch (name2) {
        case 'Canada':
          content = generatePDFContentOfcanada(req.body);
          break;
        case 'Cayman':
          content = generatePDFContentofcayman(req.body);
          break;
        case 'Singapore':
          content = generatePDFContentofsingapore(req.body);
          break;
        case 'USA':
          content = generatePDFContentofusa(req.body);
          break;        
        default:
          content = null;
          break;
      }
      if (!content) {
        return res.status(400).json({ status: "failure", msg: "Invalid address provided" });
      }

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

      currentPage.drawRectangle({
        x: 0,
        y: 50, // Adjust the Y position to set the bottom margin size
        width: currentPage.getWidth(),
        height: 70, // Adjust the height to set the bottom margin size
        color: rgb(1, 1, 1), // White color
        fillOpacity: 1,
      });

      // Serialize the PDF to a Uint8Array
      const pdfBytes = await pdfDoc.save();

      // Save the generated PDF on the server
      const fileName = 'generated.pdf';
      const filePath = `./generated_pdfs/${fileName}`;
      // Create a temporary file path to save the PDF
      const tempFilePath = path.join(os.tmpdir(), 'generated.pdf');

      // Write the PDF to the temporary file
      await fs.writeFile(tempFilePath, Buffer.from(pdfBytes));

      // Set response headers to serve the PDF
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename="generated.pdf"');

      // Send the temporary file as a response
      res.sendFile(tempFilePath);

      // Delete the temporary file after sending the response
      fs.unlink(tempFilePath);

    } catch (err) {
      console.log(err);
      res.status(400).json({ status: "failure", msg: "Exception fired in pdf post api", error: err });
    }
  });
}

module.exports = routes;
