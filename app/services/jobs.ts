import jobs from 'fixtures/jobs.json';


export async function getJob(id: string | number) {
  return jobs.find((job) => job.id === id);
}