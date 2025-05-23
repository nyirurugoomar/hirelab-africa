import { Body, Controller, Post } from '@nestjs/common';
import { ContactUsDto } from './dto/contact-us.dto';
import { MailService } from './mail.service';

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}
  @Post('contact-us')
  sendContactUsMessage(@Body() contactUsDto: ContactUsDto) {
    return this.mailService.sendContactUsMessage(contactUsDto);
  }
}
