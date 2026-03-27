import { container, injectable } from 'tsyringe';

import { IssueCommendationRequest } from '../../../shared/dto/commendations/issue-commendation.dto';
import { DatabaseType } from '../../db';
import {
  commendations,
  employeeCommendations,
  NewCommendation,
  NewEmployeeCommendation
} from '../../db/schema';

@injectable()
export class CommendationService {
  private readonly db: DatabaseType;

  constructor() {
    this.db = container.resolve<DatabaseType>('Database');
  }

  async issueCommendation(req: IssueCommendationRequest): Promise<void> {
    const newCommendation: NewCommendation = {
      title: req.title,
      description: req.description,
      adjustment: req.adjustment,
      category: req.category,
      issuedAt: new Date()
    };

    const result = await this.db.insert(commendations).values(newCommendation);

    const emplCommendations: NewEmployeeCommendation[] = req.employeeIds.map((id) => ({
      employeeId: id,
      commendationId: result.lastInsertRowid as number
    }));

    await this.db.insert(employeeCommendations).values(emplCommendations);
  }
}
