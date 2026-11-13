import prisma from '../src/server/db';
import { readFileSync } from 'fs';
import { join } from 'path';

async function main() {
  try {
    console.log('🔄 Applying RBAC migration...');
    
    const migrationSQL = readFileSync(
      join(__dirname, '../prisma/migrations/20260707120000_add_rbac/migration.sql'),
      'utf-8'
    );

    // Split by semicolon and execute each statement
    const statements = migrationSQL
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    console.log(`📝 Found ${statements.length} SQL statements to execute...`);

    for (let i = 0; i < statements.length; i++) {
      try {
        console.log(`⏳ Executing statement ${i + 1}/${statements.length}...`);
        await prisma.$executeRawUnsafe(statements[i]);
      } catch (error: any) {
        // Skip if already exists errors
        if (error.message?.includes('already exists') || error.code === '42P07' || error.code === '42710') {
          console.log(`ℹ️  Statement ${i + 1} skipped (already exists)`);
          continue;
        }
        throw error;
      }
    }

    console.log('✅ RBAC migration applied successfully!');
  } catch (error) {
    console.error('❌ Error applying migration:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
