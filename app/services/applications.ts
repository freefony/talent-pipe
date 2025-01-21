import applications from 'fixtures/applications.json';
import { applicationStages } from '~/libs/application';
import { ApplicationStage } from '~/models/applications';


type SourceEffectiveness = {
  source: string;
  hires: number;
  passThroughScore: number; // average count of stages passed through
  totalApplications: number;
  totalStagesCompletedCount: number;
}

export async function getApplicationAnalysis() {
  const progressionMap = new Map<ApplicationStage, { name: ApplicationStage, value: number }>();
  const sourceEffectiveness = new Map<string, SourceEffectiveness>();

  applications.forEach((application) => {

    // Progression by stage
    application.stages.forEach((stage) => {
      if (progressionMap.has(stage.name)) {
        progressionMap.set(stage.name, { name: stage.name.replaceAll('_', ' '), value: progressionMap.get(stage.name)!.value + 1 });
      } else {
        progressionMap.set(stage.name, { name: stage.name, value: 1 });
      }
    });


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


  });

  const getTimeToHireTrend = () => {
    const dates = applications.map((application) => {
      const date = new Date(application.stages[application.stages.length - 1].date);
      return date.getTime();
    });
    const maxDate = Math.max(...dates);
    const minDate = Math.min(...dates);
    const timeToHire = (maxDate - minDate) / 86400000;
    return timeToHire;
  }

  return {
    progression: Array.from(progressionMap.values()),
    applicationCount: applications.length,
    sourceEffectiveness: Array.from(sourceEffectiveness.values())
  };
}
