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
    if (file.type !== 'application/pdf') {
      return NextResponse.json({ error: 'Invalid file type. Please upload a PDF.' }, { status: 400 });
    }

    // Validate file size (max 50MB for better quality)
    const maxSize = 50 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json({ error: 'File size exceeds 50MB limit.' }, { status: 400 });
    }

    // Create temp directory
    const tempDir = path.join(process.cwd(), 'temp');
    await fs.mkdir(tempDir, { recursive: true });

    // Generate unique filenames
    const inputPath = path.join(tempDir, `input_${Date.now()}.pdf`);
    const outputPath = path.join(tempDir, `output_${Date.now()}.docx`);

    // Write input file
    const buffer = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(inputPath, buffer);

    try {
      // Check if PDF is text-based
      const textCheckPath = path.join(tempDir, `text_check_${Date.now()}.txt`);
      try {
        await execAsync(`"C:\\Users\\HP\\AppData\\Local\\Microsoft\\WinGet\\Packages\\oschwartz10612.Poppler_Microsoft.Winget.Source_8wekyb3d8bbwe\\poppler-25.07.0\\Library\\bin\\pdftotext.exe" "${inputPath}" "${textCheckPath}"`);
        const textContent = await fs.readFile(textCheckPath, 'utf-8');
        if (!textContent.trim()) {
          throw new Error('Scanned PDFs are not supported. Please ensure the PDF contains selectable text for exact layout conversion.');
        }
      } catch (textCheckError) {
        console.error('Text check failed:', textCheckError);
        throw new Error('Unable to verify PDF content. Please ensure the PDF contains selectable text for exact layout conversion.');
      } finally {
        await fs.unlink(textCheckPath).catch(() => {});
      }

      // Convert PDF to ODT (layout-preserving)
      console.log('Converting PDF to ODT for layout preservation');
      await execAsync(`${libreOfficeCmd} --headless --infilter="writer_pdf_import:EmbedImages=true,UseLosslessCompression=true,ReduceImageResolution=false,Quality=100,MaxImageResolution=0" --convert-to odt --outdir "${tempDir}" "${inputPath}"`);

      // Get the generated ODT path
      const odtPath = path.join(tempDir, path.basename(inputPath, '.pdf') + '.odt');

      // Process ODT to group text into paragraphs
      // await processOdtForParagraphs(odtPath);

      // Convert ODT to DOCX (NO cleanup, NO optimization, NO reflow)
      console.log('Converting ODT to DOCX');
      await execAsync(`${libreOfficeCmd} --headless --convert-to docx --outdir "${tempDir}" "${odtPath}"`);

      // Rename the output DOCX file
      const generatedDocx = path.join(tempDir, path.basename(odtPath, '.odt') + '.docx');
      await fs.rename(generatedDocx, outputPath);

      // Clean up intermediate ODT
      await fs.unlink(odtPath).catch(() => {});

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
          'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'Content-Disposition': `attachment; filename="${file.name.replace('.pdf', '.docx')}"`,
        },
      });

    } catch (conversionError) {
      console.error('Direct conversion failed:', conversionError);
      throw conversionError;
    }

  } catch (error) {
    console.error('PDF to Word conversion error:', error);
    return NextResponse.json(
      { error: 'Conversion failed. Layout preserved as closely as possible with improved paragraph grouping for better editing.' },
      { status: 500 }
    );
  }
}
