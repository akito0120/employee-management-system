import { z } from 'zod';

import { jobGradeLevel } from '../../../main/db/schema';

export const registerPositionRequest = z.object({
  name: z.string(),
  code: z.string(),
  description: z.string().nullable(),
  jobGrades: z
    .array(
      z.object({
        level: z.enum(jobGradeLevel),
        minSalary: z.coerce.number(),
        maxSalary: z.coerce.number(),
        timeInRole: z.coerce.number(),
        description: z.string(),
        headcount: z.coerce.number().nullish()
      })
    )
    .superRefine((grades, ctx) => {
      const seenLevels = new Set<string>();
      grades.forEach((grade, index) => {
        if (seenLevels.has(grade.level)) {
          ctx.addIssue({
            code: 'custom',
            message: `Duplicate job grade level: ${grade.level}`,
            path: [index, 'level']
          });
        }
        seenLevels.add(grade.level);
      });
    })
});

export type RegisterPositionRequest = z.infer<typeof registerPositionRequest>;
