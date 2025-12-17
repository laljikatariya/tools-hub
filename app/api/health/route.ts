import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

// Function to get LibreOffice command based on platform
function getLibreOfficeCommand(): string {
  const platform = process.platform;
  if (platform === 'win32') {
    return 'soffice.exe';
  }
  return 'libreoffice';
}

export async function GET() {
  try {
    // Check if LibreOffice is available
    const cmd = getLibreOfficeCommand();
    await execAsync(`${cmd} --version`);

    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      services: {
        libreoffice: 'available'
      }
    });
  } catch (error) {
    return NextResponse.json({
      status: 'degraded',
      timestamp: new Date().toISOString(),
      services: {
        libreoffice: 'not available'
      },
      message: 'LibreOffice not installed. PDF conversion features will not work. Install from: https://www.libreoffice.org/download/download/'
    }, { status: 200 }); // Return 200 but indicate degraded status
  }
}