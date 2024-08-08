import fs from 'fs';
import pdfParse from 'pdf-parse';

const extractTextFromPDF = async (filePath: string): Promise<string | null> => {
  try {
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdfParse(dataBuffer);
    return data.text;
  } catch (error) {
    console.error('Error reading PDF file:', error);
    return null;
  }
};

export default extractTextFromPDF;
