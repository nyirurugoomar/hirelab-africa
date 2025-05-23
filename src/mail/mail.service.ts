import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ContactUsDto } from './dto/contact-us.dto';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendContactUsMessage(contactUsDto: ContactUsDto) {
    await this.mailerService.sendMail({
      to: 'info@hirelabafrica.com',
      from: `"Client" <${contactUsDto.email}>`, // override default from
      subject: contactUsDto.subject,
      text: contactUsDto.message,
      // template: './templates/contact', // `.hbs` extension is appended automatically
      // context: {
      //   // ✏️ filling curly brackets with content
      //   first_name: contactUsDto.first_name,
      //   last_name: contactUsDto.last_name,
      //   message: contactUsDto.message,
      // },
    });
  }
}
