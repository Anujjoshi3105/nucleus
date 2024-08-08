declare module 'pdf-parse' {
    interface PDFInfo {
      [key: string]: any;
    }
  
    interface PDFMetadata {
      [key: string]: any;
    }
  
    interface PDFText {
      text: string;
      info: PDFInfo;
      metadata: PDFMetadata;
    }
  
    function pdf(dataBuffer: Buffer | Uint8Array | ArrayBuffer | Blob): Promise<PDFText>;
  
    export = pdf;
  }
  
  