import mongoose from "mongoose";
import formidable, { File, IncomingForm } from 'formidable';
import path from 'path';
import extractTextFromPDF from "@/app/hooks/pdfHelper";

export const config = {
    api: {
      bodyParser: false,
    },
  };
  

export async function POST(req: any) {
  
    const form = new formidable.IncomingForm({
        uploadDir: path.resolve('./public/uploads'),
        keepExtensions: true,
      });
  
    form.parse(req, async (err, fields, files) => {

      if (err) {
        console.error('Error parsing form:', err);
        Response.json({ message: 'Error parsing form.' });
        return;
      }

      const uploadedFile = Array.isArray(files.file) ? files.file[0] : files.file;
       
      if (!uploadedFile) {
       Response.json({ message: 'No file uploaded.' });
        return;
      }

      const file = uploadedFile as File;
      const filePath = file.filepath;

      const text = await extractTextFromPDF(filePath);
      if (text) {
        Response.json({ text });
      } else {
        Response.json({ message: 'Failed to extract text from PDF.' });
      }
    });
    
}
