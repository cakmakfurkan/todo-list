import { IToDo, ToDo } from '../models/todo';
import { IUser } from '../models/user';
import Agenda, { Job } from 'agenda';
import NodeMailer from 'nodemailer';

module.exports = function(agenda: Agenda) {
  agenda.define('to do reminder', async (job: Job) => {
    let user: IUser, toDo: IToDo;
    ToDo.findOne({ _id: job.attrs.data!.toDoID })
      .populate('userID')
      .exec(async (err, res) => {
        if (res) {
          user = <IUser>(<unknown>res.userID);
          toDo = res;

          const testAccount = await NodeMailer.createTestAccount();

          const transporter = await NodeMailer.createTransport({
            host: testAccount.smtp.host,
            port: testAccount.smtp.port,
            secure: testAccount.smtp.secure,
            auth: {
              user: testAccount.user, // generated ethereal user
              pass: testAccount.pass, // generated ethereal password
            },
          });

          // send mail with defined transport object
          const info = await transporter.sendMail({
            from: '"To Do Reminder Service 👻" <foo@example.com>',
            to: user.email,
            subject: 'To Do Reminder',
            html: `<b>Do not forget to ${toDo.task}!</b>`,
          });
          console.log('Preview URL: %s', NodeMailer.getTestMessageUrl(info));
        }
      });
  });
};
