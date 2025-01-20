import { writeFile } from 'fs/promises';
import path from 'path';

const FIXTURES_DIR = path.join(process.cwd(), 'fixtures');
const FILE_TYPE = 'json';

export async function loadToFile(data: any, fileName: string) {
  try {
    const filePath = path.join(FIXTURES_DIR, `${fileName}.${FILE_TYPE}`);
    await writeFile(filePath, JSON.stringify(data));
  } catch (error) {
    console.error(error);
    throw error;
  }
}