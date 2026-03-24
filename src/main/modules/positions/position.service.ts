import { container, injectable } from 'tsyringe';

import { DatabaseType } from '../../db';
import { SessionInfo } from '../auth/session-info';

@injectable()
export class PositionService {
  private readonly db: DatabaseType;
  private readonly sessionInfo: SessionInfo;

  constructor() {
    this.db = container.resolve<DatabaseType>('Database');
    this.sessionInfo = container.resolve(SessionInfo);
  }
}
