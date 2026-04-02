import { container } from 'tsyringe';

import { findAuditLogRequest } from '../../../shared/dto/audit-logs/find-audit-log.dto';
import t from '../../trpc';
import { AuditLogService } from './audit-log.service';

const auditLogRouter = t.router({
  findAuditLog: t.procedure.input(findAuditLogRequest).query(async (c) => {
    const service = container.resolve(AuditLogService);
    return await service.findLog(c.input);
  })
});

export default auditLogRouter;
