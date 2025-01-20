import applications from 'fixtures/applications.json';

const applicationStages = [
  'applied', 'screening', 'interview_scheduled', 'technical_assessment', 'cultural_interview', 'final_interview', 'offer'
];

/**
 * Transforms an array of application data by sorting the stages based on date
 * and assigning stage names from a predefined order.
 * 
 * This ensures that the stages are always in the same order and removes dupicate stages.
 *
 * @param {Application[]} data - Array of application objects to be transformed.
 * @returns {Application[]} A new array of applications with sorted and named stages.
 */

export function transformApplicationsStages() {
  return applications.map((application) => {
    // sort stages by stage date
    const stages = application.stages.sort((a, b) => {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    })
      .map((stage, i) => {
        return {
          name: applicationStages[i],
          date: new Date(stage.date)
        }
      });

    return {
      ...application,
      stages
    }
  });

}