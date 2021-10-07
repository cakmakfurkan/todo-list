import { User } from '../models/user';
import Agenda, { Job } from 'agenda';

module.exports = function(agenda: Agenda) {
  agenda.define('registration email', async (job: Job) => {
    const user = await User.findById(job.attrs.data!.userId);
    console.log('fonksiyona girdi ' + user?._id);
  });

  agenda.define('reset password', async (job: Job) => {
    // Etc
  });

  // More email related jobs
};
