import { User } from '../models/user';
import Agenda, { Job } from 'agenda';

module.exports = function(agenda: Agenda) {
  agenda.define('motionSensorSettings', async (job: Job) => {
    const data = job.attrs.data!;
    console.log('motionSensorSettings' + data.serial);
    for (let i = 0; i < 1000000; i++) {}
  });
};
