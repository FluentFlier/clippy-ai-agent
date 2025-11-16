import * as fs from 'fs';
import * as path from 'path';

export class DocumentReader {
  async readFile(filePath: string): Promise<string> {
    try {
      const ext = path.extname(filePath).toLowerCase();
      
      switch (ext) {
        case '.txt':
        case '.md':
        case '.js':
        case '.ts':
        case '.tsx':
        case '.jsx':
        case '.py':
        case '.java':
        case '.cpp':
        case '.c':
        case '.html':
        case '.css':
        case '.json':
          return await this.readTextFile(filePath);
        
        case '.pdf':
          return await this.readPDF(filePath);
        
        case '.docx':
          return await this.readDocx(filePath);
        
        default:
          return `Unsupported file type: ${ext}`;
      }
    } catch (error) {
      console.error('Error reading file:', error);
      return `Error reading file: ${error}`;
    }
  }

  private async readTextFile(filePath: string): Promise<string> {
    return fs.promises.readFile(filePath, 'utf-8');
  }

  private async readPDF(filePath: string): Promise<string> {
    try {
      // Would need pdf-parse package
      // const pdfParse = require('pdf-parse');
      // const dataBuffer = await fs.promises.readFile(filePath);
      // const data = await pdfParse(dataBuffer);
      // return data.text;
      return 'PDF reading requires pdf-parse package (not installed)';
    } catch (error) {
      return `Error reading PDF: ${error}`;
    }
  }

  private async readDocx(filePath: string): Promise<string> {
    try {
      // Would need mammoth package
      // const mammoth = require('mammoth');
      // const result = await mammoth.extractRawText({ path: filePath });
      // return result.value;
      return 'DOCX reading requires mammoth package (not installed)';
    } catch (error) {
      return `Error reading DOCX: ${error}`;
    }
  }

  async getRecentFiles(directory: string, limit = 10): Promise<string[]> {
    try {
      const files = await fs.promises.readdir(directory);
      const fileStats = await Promise.all(
        files.map(async (file) => {
          const filePath = path.join(directory, file);
          const stats = await fs.promises.stat(filePath);
          return { path: filePath, mtime: stats.mtime };
        })
      );

      return fileStats
        .sort((a, b) => b.mtime.getTime() - a.mtime.getTime())
        .slice(0, limit)
        .map(f => f.path);
    } catch (error) {
      console.error('Error getting recent files:', error);
      return [];
    }
  }

  async searchInFile(filePath: string, query: string): Promise<string[]> {
    try {
      const content = await this.readTextFile(filePath);
      const lines = content.split('\n');
      const matches: string[] = [];

      lines.forEach((line, index) => {
        if (line.toLowerCase().includes(query.toLowerCase())) {
          matches.push(`Line ${index + 1}: ${line.trim()}`);
        }
      });

      return matches;
    } catch (error) {
      console.error('Error searching file:', error);
      return [];
    }
  }
}
