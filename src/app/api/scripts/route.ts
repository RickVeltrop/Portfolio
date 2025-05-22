import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const scriptsDir = path.join(process.cwd(), 'public', 'scripts');
    const files = fs.readdirSync(scriptsDir);
    
    const scripts = files
      .filter(file => file.endsWith('.lua'))
      .map(file => {
        const content = fs.readFileSync(path.join(scriptsDir, file), 'utf-8');
        const firstLine = content.split('\n')[0];
        const description = firstLine.startsWith('--') ? firstLine.substring(2).trim() : '';
        
        return {
          title: file
            .replace('.lua', '')
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' '),
          description,
          filename: file
        };
      });

    return NextResponse.json({ scripts });
  } catch (error) {
    console.error('Error loading scripts:', error);
    return NextResponse.json({ error: 'Failed to load scripts' }, { status: 500 });
  }
} 