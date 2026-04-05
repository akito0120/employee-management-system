import Database from 'better-sqlite3';
import { desc, ExtractTablesWithRelations } from 'drizzle-orm';
import { SQLiteTransaction } from 'drizzle-orm/sqlite-core';
import { container, injectable } from 'tsyringe';

import { FindAuditLogRequest } from '../../../shared/dto/audit-logs/find-audit-log.dto';
import { DatabaseType } from '../../db';
import { ActionCategory, ActionTarget, auditLogs, NewAuditLog } from '../../db/schema';
import * as schema from '../../db/schema';
import { SessionInfo } from '../auth/session-info';

@injectable()
export class AuditLogService {
  private readonly sessionInfo: SessionInfo;
  private readonly db: DatabaseType;

  constructor() {
    this.db = container.resolve<DatabaseType>('Database');
    this.sessionInfo = container.resolve(SessionInfo);
  }

  log(props: {
    tx: SQLiteTransaction<
      'sync',
      Database.RunResult,
      typeof schema,
      ExtractTablesWithRelations<typeof schema>
    >;
    category: ActionCategory;
    target?: ActionTarget;
    targetId?: number;
    newValue?: string;
    oldValue?: string;
  }) {
    const userId = this.sessionInfo.currentUserId;
    if (!userId) throw new Error('Not logged in');

    const log: NewAuditLog = {
      userId,
      category: props.category,
      performedAt: new Date(),
      newValue: props.newValue,
      oldValue: props.oldValue,
      target: props.target,
      targetId: props.targetId
    };

    props.tx.insert(auditLogs).values(log).run();
  }

  logMany(props: {
    tx: SQLiteTransaction<
      'sync',
      Database.RunResult,
      typeof schema,
      ExtractTablesWithRelations<typeof schema>
    >;
    items: {
      category: ActionCategory;
      target?: ActionTarget;
      targetId?: number;
      newValue?: string;
      oldValue?: string;
    }[];
  }) {
    const userId = this.sessionInfo.currentUserId;
    if (!userId) throw new Error('Not logged in');

    const logs = props.items.map((item) => ({
      userId,
      category: item.category,
      performedAt: new Date(),
      newValue: item.newValue,
      oldValue: item.oldValue,
      target: item.target,
      targetId: item.targetId
    }));

    props.tx.insert(auditLogs).values(logs).run();
  }

  async findLog(req: FindAuditLogRequest) {
    const items = await this.db.query.auditLogs.findMany({
      offset: (req.page - 1) * 10,
      limit: 10,
      orderBy: desc(auditLogs.performedAt)
    });
    const total = await this.db.$count(auditLogs);

    return {
      total,
      items
    };
  }
}
