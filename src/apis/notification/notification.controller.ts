import { Controller, Get, Patch, Request } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { Auth } from 'src/common/decoration/auth';

@Controller('notifications')
export class NotificationController {
  constructor(private notificationService: NotificationService) {}

  @Get()
  @Auth()
  async getNotifications(@Request() req) {
    const userId = req.user.userId;
    return this.notificationService.getNotifications(userId);
  }

  @Patch('read')
  @Auth()
  async markAsRead(@Request() req) {
    const userId = req.user.userId;
    return this.notificationService.markAsRead(userId);
  }

  @Get('unread')
  @Auth()
  async getIsUnreadMessage(@Request() req) {
    const userId = req.user.userId;
    return this.notificationService.getIsUnreadMessage(userId);
  }
}
