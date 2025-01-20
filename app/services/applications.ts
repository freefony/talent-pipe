import applications from 'fixtures/applications.json';
import { ApplicationStage } from '~/models/applications';


export async function getApplicationAnalysis() {
  const progressionMap = new Map<ApplicationStage, { name: ApplicationStage, value: number }>();
  applications.forEach((application) => {
    application.stages.forEach((stage) => {
      if (progressionMap.has(stage.name)) {
        progressionMap.set(stage.name, { name: stage.name.replaceAll('_', ' '), value: progressionMap.get(stage.name)!.value + 1 });
      } else {
        progressionMap.set(stage.name, { name: stage.name, value: 1 });
      }
    });
  });

  return {
    progression: Array.from(progressionMap.values()),
    applicationCount: applications.length
  };
}
