import { MigrationInterface, QueryRunner } from 'typeorm';

type IndexDef = {
  name: string;
  tables: string[];
  columns: string[][];
};

const INDEXES: IndexDef[] = [
  {
    name: 'IDX_calendar_event_start_end',
    tables: ['calendar_event', 'CalendarEvent', 'calendarevent'],
    columns: [['start', 'end']],
  },
  {
    name: 'IDX_calendar_event_category_start',
    tables: ['calendar_event', 'CalendarEvent', 'calendarevent'],
    columns: [['categoryName', 'start'], ['category_name', 'start']],
  },
  {
    name: 'IDX_meeting_event_room_start_end',
    tables: ['meeting_event', 'MeetingEvent', 'meetingevent'],
    columns: [['roomId', 'start', 'end'], ['room_id', 'start', 'end']],
  },
  {
    name: 'IDX_post_status_category_created',
    tables: ['post', 'Post', 'posts'],
    columns: [
      ['status', 'categoryName', 'createdDate'],
      ['status', 'category_name', 'created_date'],
    ],
  },
  {
    name: 'IDX_post_slug',
    tables: ['post', 'Post', 'posts'],
    columns: [['slug']],
  },
  {
    name: 'IDX_staff_contact_email',
    tables: ['staff_contact', 'StaffContact', 'staffcontact'],
    columns: [['email']],
  },
  {
    name: 'IDX_staff_contact_company_department',
    tables: ['staff_contact', 'StaffContact', 'staffcontact'],
    columns: [['company', 'department']],
  },
];

async function tableMap(queryRunner: QueryRunner): Promise<Map<string, string>> {
  const rows: Array<{ n: string }> = await queryRunner.query(
    `SELECT TABLE_NAME AS n FROM information_schema.TABLES WHERE TABLE_SCHEMA = DATABASE()`,
  );
  return new Map(rows.map((r) => [r.n.toLowerCase(), r.n]));
}

async function columnSet(
  queryRunner: QueryRunner,
  table: string,
): Promise<Set<string>> {
  const rows: Array<{ n: string }> = await queryRunner.query(
    `SELECT COLUMN_NAME AS n FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ?`,
    [table],
  );
  return new Set(rows.map((r) => r.n));
}

async function hasIndex(
  queryRunner: QueryRunner,
  table: string,
  indexName: string,
): Promise<boolean> {
  const rows: Array<{ n: string }> = await queryRunner.query(
    `SELECT INDEX_NAME AS n FROM information_schema.STATISTICS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ? AND INDEX_NAME = ? LIMIT 1`,
    [table, indexName],
  );
  return rows.length > 0;
}

function resolveTable(tables: string[], actual: Map<string, string>): string | null {
  for (const candidate of tables) {
    const found = actual.get(candidate.toLowerCase());
    if (found) return found;
  }
  return null;
}

function resolveColumns(
  wanted: string[][],
  existing: Set<string>,
): string[] | null {
  const lower = new Map([...existing].map((c) => [c.toLowerCase(), c]));
  for (const combo of wanted) {
    const mapped = combo.map((c) => lower.get(c.toLowerCase()));
    if (mapped.every(Boolean)) return mapped as string[];
  }
  return null;
}

export class AddPerfIndexes1755660000000 implements MigrationInterface {
  name = 'AddPerfIndexes1755660000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const actual = await tableMap(queryRunner);
    const skipped: string[] = [];

    for (const def of INDEXES) {
      const table = resolveTable(def.tables, actual);
      if (!table) {
        skipped.push(`${def.name} (no table like ${def.tables[0]})`);
        continue;
      }
      if (await hasIndex(queryRunner, table, def.name)) continue;

      const cols = resolveColumns(def.columns, await columnSet(queryRunner, table));
      if (!cols) {
        skipped.push(`${def.name} on ${table} (columns missing)`);
        continue;
      }

      const colSql = cols.map((c) => `\`${c}\``).join(', ');
      await queryRunner.query(
        `CREATE INDEX \`${def.name}\` ON \`${table}\` (${colSql})`,
      );
    }

    if (skipped.length) {
      console.warn(`AddPerfIndexes skipped: ${skipped.join('; ')}`);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const actual = await tableMap(queryRunner);
    for (const def of INDEXES) {
      const table = resolveTable(def.tables, actual);
      if (!table) continue;
      if (!(await hasIndex(queryRunner, table, def.name))) continue;
      await queryRunner.query(`DROP INDEX \`${def.name}\` ON \`${table}\``);
    }
  }
}
