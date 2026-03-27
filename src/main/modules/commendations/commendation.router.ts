import { container } from 'tsyringe';

import { issueCommendationRequest } from '../../../shared/dto/commendations/issue-commendation.dto';
import t from '../../trpc';
import { CommendationService } from './commendation.service';

const commendationRouter = t.router({
  issueCommendation: t.procedure.input(issueCommendationRequest).mutation(async (c) => {
    const service = container.resolve(CommendationService);
    await service.issueCommendation(c.input);
  })
});

export default commendationRouter;
