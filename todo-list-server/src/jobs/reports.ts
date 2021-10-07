import { User } from '../models/user';
import Agenda, { Job } from 'agenda';

module.exports = function(agenda: Agenda) {
  agenda.define('light report', async (job: Job) => {
    //const user = await User.findById(job.attrs.data!.systemID);
    console.log('fonksiyona girdi ' + job.attrs.data!.systemID);
  });

  agenda.define('reset password', async (job: Job) => {
    // Etc
  });

  // More email related jobs
};
