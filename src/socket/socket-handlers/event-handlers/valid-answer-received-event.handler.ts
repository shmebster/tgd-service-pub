import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { ValidAnswerReceivedEvent } from '../../../game/events/valid-answer.recieved';
import { SharedService } from '../../../shared/shared.service';
import { SocketEvents } from '../../../shared/events.consts';

@EventsHandler(ValidAnswerReceivedEvent)
export class SocketValidAnswerReceivedEventHandler
  implements IEventHandler<ValidAnswerReceivedEvent> {

  constructor(private sharedService: SharedService) {
  }

  handle(event: ValidAnswerReceivedEvent): any {
    this.sharedService.sendSocketNotificationToAllClients(
      SocketEvents.VALID_ANSWER_RECEIVED,
      { telegramId: event.tId, validAnswer: event.validAnswer },
    );
  }
}
