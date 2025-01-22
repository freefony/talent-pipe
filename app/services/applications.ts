import applications from 'fixtures/applications.json';
import { applicationStages } from '~/libs/application';
import { ApplicationStage } from '~/models/applications';
import { getJob } from './jobs';


type SourceEffectiveness = {
  source: string;
  hires: number;
  passThroughScore: number; // average count of stages passed through
  totalApplications: number;
  totalStagesCompletedCount: number;
}

export type TimeToHireTrendProps = {
  monthYear: string,
  averageTimeToHire: number,
  maxTimeToHire: number,
  minTimeToHire: number,
  dateTime: number,
  totalHires: number
}

type Filters = {
  byDate?: {
    from?: string,
    to?: string
  },
  byLevel?: string
}

export async function getApplicationAnalysis(filters?: Filters) {
  const progressionMap = new Map<ApplicationStage, { name: ApplicationStage, value: number }>();
  const sourceEffectiveness = new Map<string, SourceEffectiveness>();
  const timeToHireTrend = new Map<string, TimeToHireTrendProps>();
  let applicationCount = 0

  for (const application of applications) {

    if (filters?.byDate) {
      const applicationDate = new Date(application.created_at);
      if (filters.byDate.from) {
        if (applicationDate.getTime() < new Date(filters.byDate.from).getTime()) continue;
      }

      if (filters.byDate.to) {
        if (applicationDate.getTime() > new Date(filters.byDate.to).getTime()) continue;
      }
    }

    if (filters?.byLevel) {
      const job = await getJob(application.job);
      if (!job) continue;

      if (job.title.replaceAll(' ', '-') !== filters.byLevel) continue;
    }

    applicationCount++;

    // Progression by stage
    application.stages.forEach((stage) => {
      if (progressionMap.has(stage.name)) {
        progressionMap.set(stage.name, { name: stage.name.replaceAll('_', ' '), value: progressionMap.get(stage.name)!.value + 1 });
      } else {
        progressionMap.set(stage.name, { name: stage.name, value: 1 });
      }
    });

    // time to hire trends
    if (application.outcome === 'hired') {
      const startDate = new Date(application.created_at)
      const hiredDate = new Date(application.closed_at)
      const hiredMonthYear = hiredDate.toLocaleDateString('default', { month: 'short', year: 'numeric' })
      const timeToHire = Math.ceil((hiredDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) // in days

      //ave time to hire per month
      if (timeToHireTrend.has(hiredMonthYear)) {
        const timeToHireRecord = timeToHireTrend.get(hiredMonthYear)!;

        timeToHireRecord.averageTimeToHire = (timeToHireRecord.averageTimeToHire + timeToHire) / 2;
        timeToHireRecord.maxTimeToHire = Math.max(timeToHireRecord.maxTimeToHire, timeToHire);
        timeToHireRecord.minTimeToHire = Math.min(timeToHireRecord.minTimeToHire, timeToHire);
        timeToHireRecord.totalHires += 1;
      } else {
        timeToHireTrend.set(hiredMonthYear, {
          monthYear: hiredMonthYear,
          averageTimeToHire: timeToHire,
          maxTimeToHire: timeToHire,
          minTimeToHire: timeToHire,
          dateTime: startDate.getTime(),
          totalHires: 1
        });
      }
    }


    // source effectiveness
    const source = application.source.replaceAll('_', ' ').replace(/["']/g, "");
    const isHired = application.outcome === 'hired';
    const stagesPassedThrough = isHired
      ? applicationStages.length // passed through all stages
      : application.stages.length - 1; // the last stage is the outcome

    if (sourceEffectiveness.has(source)) {
      const sourceRecord = sourceEffectiveness.get(source)!;

      sourceRecord.hires += isHired ? 1 : 0;
      sourceRecord.totalApplications += 1;
      sourceRecord.totalStagesCompletedCount += stagesPassedThrough;
      sourceRecord.passThroughScore = Math.round(sourceRecord.totalStagesCompletedCount / sourceRecord.totalApplications);

    } else {
      sourceEffectiveness.set(source, {
        source,
        hires: isHired ? 1 : 0,
        passThroughScore: stagesPassedThrough,
        totalApplications: 1,
        totalStagesCompletedCount: stagesPassedThrough
      });
    }


  };

  return {
    progression: Array.from(progressionMap.values()),
    applicationCount,
    sourceEffectiveness: Array.from(sourceEffectiveness.values()),
    timeToHireTrend: Array.from(timeToHireTrend.values()).sort((a, b) => {
      return a.dateTime - b.dateTime
    })
  };
}
