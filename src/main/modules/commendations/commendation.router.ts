import { container } from 'tsyringe';

import { findCommendationRequest } from '../../../shared/dto/commendations/find-commendation.dto';
import { issueCommendationRequest } from '../../../shared/dto/commendations/issue-commendation.dto';
import t from '../../trpc';
import { CommendationService } from './commendation.service';

const commendationRouter = t.router({
  issueCommendation: t.procedure.input(issueCommendationRequest).mutation(async (c) => {
    const service = container.resolve(CommendationService);
    await service.issueCommendation(c.input);
  }),
  findCommendation: t.procedure.input(findCommendationRequest).query(async (c) => {
    const service = container.resolve(CommendationService);
    return await service.findCommendation(c.input);
  })
});

export default commendationRouter;
