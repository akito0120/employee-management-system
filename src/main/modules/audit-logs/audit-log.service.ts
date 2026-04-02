import { container, injectable } from 'tsyringe';

import { DatabaseType } from '../../db';
import { ActionCategory, ActionTarget, auditLogs, NewAuditLog } from '../../db/schema';
import { SessionInfo } from '../auth/session-info';

@injectable()
export class AuditLogService {
  private readonly db: DatabaseType;
  private readonly sessionInfo: SessionInfo;

  constructor() {
    this.db = container.resolve<DatabaseType>('Database');
    this.sessionInfo = container.resolve(SessionInfo);
  }

  async log(props: {
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

    await this.db.insert(auditLogs).values(log);
  }
}
