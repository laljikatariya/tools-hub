import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promises as fs } from 'fs';
import path from 'path';
import { promisify } from 'util';

const execAsync = promisify(exec);

// Function to check if LibreOffice is available
async function checkLibreOffice(): Promise<string | null> {
  const platform = process.platform;
  let commands: string[];

  if (platform === 'win32') {
    commands = [
      'soffice.exe', // If in PATH
      '"C:\\Program Files\\LibreOffice\\program\\soffice.exe"',
      '"C:\\Program Files (x86)\\LibreOffice\\program\\soffice.exe"'
    ];
  } else {
    commands = ['libreoffice'];
  }

  for (const cmd of commands) {
    try {
      await execAsync(`${cmd} --version`);
      return cmd;
    } catch {
      // Continue to next
    }
  }
  return null;
}

export async function POST(request: NextRequest) {
  try {
    // Check if LibreOffice is installed
    const libreOfficeCmd = await checkLibreOffice();
    if (!libreOfficeCmd) {
      return NextResponse.json({
        error: 'LibreOffice is not installed. Please install LibreOffice to use PDF conversion features. Download from: https://www.libreoffice.org/download/download/'
      }, { status: 503 });
    }
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate file type
    const validTypes = [
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword'
    ];
    const fileName = file.name.toLowerCase();
    if (!validTypes.includes(file.type) && !fileName.endsWith('.docx') && !fileName.endsWith('.doc')) {
      return NextResponse.json({ error: 'Invalid file type. Please upload a Word document.' }, { status: 400 });
    }

    // Validate file size (max 50MB)
    const maxSize = 50 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json({ error: 'File size exceeds 50MB limit.' }, { status: 400 });
    }

    // Create temp directory
    const tempDir = path.join(process.cwd(), 'temp');
    await fs.mkdir(tempDir, { recursive: true });

    // Generate unique filenames
    const inputPath = path.join(tempDir, `input_${Date.now()}${path.extname(file.name)}`);
    const outputPath = path.join(tempDir, `output_${Date.now()}.pdf`);

    // Write input file
    const buffer = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(inputPath, buffer);

    try {
      // Convert DOCX/DOC to PDF using LibreOffice
      // Use high-quality settings for better layout preservation
      await execAsync(`${libreOfficeCmd} --headless --convert-to pdf --outdir "${tempDir}" "${inputPath}"`);

      // Rename the output PDF file
      const generatedPdf = path.join(tempDir, path.basename(inputPath, path.extname(inputPath)) + '.pdf');
      await fs.rename(generatedPdf, outputPath);

      // Read the converted file
      const convertedBuffer = await fs.readFile(outputPath);

      // Clean up temp files
      await Promise.all([
        fs.unlink(inputPath).catch(() => {}),
        fs.unlink(outputPath).catch(() => {})
      ]);

      // Return the converted file
      return new NextResponse(convertedBuffer, {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="${file.name.replace(/\.(docx?|doc)$/i, '.pdf')}"`,
        },
      });

    } catch (conversionError) {
      console.error('LibreOffice conversion failed:', conversionError);
      throw new Error('Conversion failed');
    }

  } catch (error) {
    console.error('Word to PDF conversion error:', error);
    return NextResponse.json(
      { error: 'Conversion failed. Layout preserved as much as possible.' },
      { status: 500 }
    );
  }
}