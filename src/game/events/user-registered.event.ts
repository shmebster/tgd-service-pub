import { Logger } from '@nestjs/common';

export class UserRegisteredEvent {
  private logger = new Logger(UserRegisteredEvent.name);
  constructor(public telegramId: number, public name: string) {
    this.logger.verbose(`${telegramId} ${name}`);
  }

}
