const { app, BrowserWindow, dialog } = require('electron');
const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');
// const printer = require('electron-printer');

module.exports = {
  printReport: async (cardData, win) => {
    try {
      if (cardData && cardData.length > 0) {
        const arabicFontPath = path.join(
          __dirname,
          'fonts',
          'Cairo-Medium.ttf'
        );

        const pdfPath = path.join(
          app.getPath('userData'),
          'printed-report.pdf'
        );

        const doc = new PDFDocument({
          size: 'A4',
          layout: 'portrait', // or 'landscape'
          direction: 'rtl',
          margin: {
            top: 150,
            left: 8,
          },
          font: arabicFontPath,
        });

        doc.fontSize(7);

        const stream = fs.createWriteStream(pdfPath);
        doc.pipe(stream);
        let margin = 12;
        cardData.forEach((card, index) => {
       if(card.digits){
            doc.text(`${card.digits}`, 5.33 * 72, 1.20 * 72 + margin, {
              width: 0.91 * 72,
              height: 0.11 * 72,
              align: 'right',
              lineBreak: true,
            });
 
 //new line
            doc.text(
              `${card.firstNameEnglish}`,
              5.33 * 72,
              1.477 * 72 + margin,
              {
                width: 0.92 * 72,
                height: 0.183 * 72,
                align: 'right',
                lineBreak: true,
              }
            );

            doc.text(
              `${card.lastNameEnglish}`,
              3.28 * 72,
              1.477 * 72 + margin,
              {
                width: 1.8 * 72,
                height: 0.11 * 72,
                align: 'right',
                lineBreak: true,
              }
            );
             //new line
            doc.text(`${card.passport}`, 5.33 * 72, 1.77 * 72 + margin, {
              width: 0.91 * 72,
              height: 0.11 * 72,
              align: 'right',
              lineBreak: true,
            });
        
            doc.text(`${card.job}`, 4.33 * 72, 1.77 * 72 + margin, {
              width: 0.91 * 72,
              height: 0.11 * 72,
              align: 'right',
            });

            doc.text(`${card.placeOfIssue}`, 3.28 * 72, 1.77 * 72 + margin, {
              width: 0.91 * 72,
              height: 0.11 * 72,
              align: 'right',
            });
        
            //new line
            doc.text(`${card.validUntil}`, 4.33 * 72, 2.05 * 72 + margin, {
              width: 0.91 * 72,
              height: 0.11 * 72,
              align: 'right',
            });
            
            doc.text(`${card.issueDate}`, 5.33 * 72, 2.05 * 72 + margin, {
              width: 0.91 * 72,
              height: 0.11 * 72,
              align: 'right',
            });
            
            doc.text(`${card.currentDate}`, 3.28 * 72, 2.05 * 72 + margin, {
              width: 0.91 * 72,
              height: 0.11 * 72,
              align: 'right',
            });
      //new line
// New line  
            doc.text(`${card.entryNum}`, 5.33 * 72, 2.36 * 72 + margin, { 
              width: 0.91 * 72,
              height: 0.11 * 72,
              align: 'right',
              lineBreak: true,
            });


            doc.text(`${card.sponsor}`, 4.33 * 72, 2.36 * 72 + margin, { 
              width: 1 * 72,
              height: 0.5 * 72,
              align: 'right',
            });


            //-----------    --------  image  -------- in the middle 
            doc.image(`${card.photoPath}`, 2.43 * 72, 1.31 * 72 + margin, {
              width: 0.78 * 72,
              height: 0.95 * 72,
            });

            // ------------   Rotate   --------------------------------- LEFT SIDE Of THE PAGE
   
            doc.save();
            doc.rotate(-90, { origin: [1.65 * 72, 1.24 * 72 + margin] });
            doc.text(`${card.fullName}`, 1.65 * 72, 1.24 * 72 + margin, {
              width: 0.9 * 72,
              height: 1 * 72,
              lineBreak: true,
            });

            doc.restore();
     
            doc.save();
            doc.rotate(-90, { origin: [1.65 * 72, 3.21 * 72 + margin] });
            doc.text(
              ` ${card.validUntil} / ${card.issueDate} / ${card.passport} / ${card.nationality} `,
              1.65 * 72,
              3.21 * 72 + margin,
              {
                width: 2 * 72,
                height: 0.5 * 72,
                lineBreak: true,
              }
            );
            //       doc
            //        .rect(1.65 * 72, 3.51 * 72 + margin, 2 * 72, 1 * 72)
            //       .lineWidth(1) // Set the line width of the box
            //      .stroke();
          }   
            doc.restore();
         
          margin += 275;
          // ------------  END  Rotate   ------------------
        });
        doc.end();
        console.log('PDF generated. Saving to:', pdfPath);
        //--------------------------------

        doc.on('end', () => {
          console.log('PDF generated. Saving to:', pdfPath);

          // Delay for a short period to ensure the PDF is fully generated
          setTimeout(() => {
            const pdfBuffer = fs.readFileSync(pdfPath);
            const printWindow = new BrowserWindow({ show: false });
            printWindow.webContents.on('did-finish-load', () => {
              printWindow.webContents.print(
                { silent: false, printBackground: true, copies: 1 },
                (success, errorType) => {
                  if (success) {
                    console.log('PDF printed successfully.');

                    try {
                      // Assuming 'pdfPath' is the path to your PDF file
                      fs.unlinkSync(pdfPath);
                      console.log('PDF file deleted successfully.');
                    } catch (deleteError) {
                      console.error('Error deleting PDF file:', deleteError);
                    }
                  } else {
                    console.error('Error printing PDF:', errorType);
                  }
                }
              );
            });

            printWindow.webContents.loadURL(
              `data:application/pdf;base64,${pdfBuffer.toString('base64')}`
            );
            printWindow.show();
          }, 1000); // Adjust the delay as needed
        });
        //------------------------------
      } else {
        console.error('No cardData provided.');
      }
    } catch (err) {
      console.error('Error generating PDF:', err);
    }
  },
};
