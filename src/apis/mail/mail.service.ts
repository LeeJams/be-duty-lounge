import { MailerService } from '@nestjs-modules/mailer';
import { ConflictException, Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendHello() {
    const res = await this.mailerService.sendMail({
      to: 'woals214@gmail.com',
      from: 'noreplay@gmail.com',
      subject: 'Hello',
      text: 'Hello World',
      html: `
      <!DOCTYPE html
        PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
      <html xmlns="http://www.w3.org/1999/xhtml">

      <head>
        <title>Keeper Admin</title>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@100..900&display=swap" rel="stylesheet">
      </head>

      <body id="body" style="background-color:#fff;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;">
        <table align="center" width="100%" style="margin:0 auto;min-width:320px" cellspacing="0" cellpadding="0">
          <tr>
            <td align="center" width="580">
              <table width="580" style="padding:10px;" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="left" style="padding: 40px 0;">
                    <img src="https://d283qw4ln5pch9.cloudfront.net/common/logo.png" alt="Keeper Admin">
                  </td>
                </tr>
                <tr>
                  <td align="left"
                    style="font-size: 28px; padding-bottom:12px; line-height: 140%; font-family: Noto Sans CJK KR; color: #222; font-weight: 700; letter-spacing: -0.56px;">
                    새 비밀번호 안내
                  </td>
                </tr>
                <tr>
                  <td align="left"
                    style="font-size: 16px; padding-bottom:48px; line-height: 140%; font-family: Noto Sans CJK KR; color: #666; font-weight: 400; letter-spacing: -0.32px;">
                    아래 발급된 새 비밀번호로 로그인해 주세요.
                  </td>
                </tr>
                <tr>
                  <td align="left"
                    style="background: #F5F5F5;border-radius: 8px;font-size: 20px; padding:40px 80px; line-height: 140%; font-family: Noto Sans CJK KR; color: #222; font-weight: 700; letter-spacing: -0.4px; text-align: center;">
                    Keeper1223@!! <!-- 새로운 비밀번호 -->
                  </td>
                </tr>
                <tr>
                  <td align="left" style="color: #fff; padding:25px;"></td>
                </tr>
                <tr>
                  <td align="center">
                    <table>
                      <tr>
                        <td align="center">
                          <!-- href 수정 필요 -->
                          <a href="https://shop.dev.keeperplatform.com/login" target="_blank"
                            style="background: #222;border-radius: 8px; color: #fff; font-size: 16px; padding:20px 60px; line-height: 150%; font-family: Noto Sans CJK KR; font-weight: 500; letter-spacing: -0.32px; text-align: center; text-decoration: none;">
                            로그인하러 가기
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td align="left" style="color: #fff; padding:40px;"></td>
                </tr>
                <tr>
                  <td align="left"
                    style="font-size: 14px; line-height: 150%; font-family: Noto Sans CJK KR; color: #999; letter-spacing: -0.28px; padding-top: 16px; border-top: 1px solid #EEE;">
                    본 메일은 발신전용 메일이므로 문의 및 회신할 경우 답변되지 않습니다.
                  </td>
                </tr>

              </table>
            </td>
          </tr>
        </table>
      </body>

      </html>
      `,
    });

    if (!res) {
      throw new ConflictException('Failed to send email');
    }

    return true;
  }
}
