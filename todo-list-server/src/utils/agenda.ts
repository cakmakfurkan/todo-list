import Agenda from 'agenda';
import dotenv from 'dotenv';
dotenv.config();
const dbURI = 'mongodb://127.0.0.1/todo-list';

const connectionOpts = {
  db: { address: process.env.MONGODB_URI || dbURI, collection: 'agendaJobs' },
};

export const agenda = new Agenda(connectionOpts);

const jobTypes = process.env.JOB_TYPES ? process.env.JOB_TYPES.split(',') : [];

jobTypes.forEach(type => {
  require('../jobs/' + type)(agenda);
});

if (jobTypes.length) {
  agenda.start().catch(err => {
    console.log(err);
  });
}
