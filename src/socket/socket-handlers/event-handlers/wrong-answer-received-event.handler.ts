import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { WrongAnswerReceivedEvent } from '../../../game/events/wrong-answer-received.event';
import { SharedService } from '../../../shared/shared.service';
import { SocketEvents } from '../../../shared/events.consts';
import { Logger } from '@nestjs/common';

@EventsHandler(WrongAnswerReceivedEvent)
export class SocketWrongAnswerReceivedEventHandler
  implements IEventHandler<WrongAnswerReceivedEvent>
{
  private readonly logger = new Logger(
    SocketWrongAnswerReceivedEventHandler.name,
  );
  constructor(private sharedService: SharedService) {}

  handle(event: WrongAnswerReceivedEvent): any {

    this.sharedService.sendSocketNotificationToAllClients(
      SocketEvents.WRONG_ANSWER_RECEIVED,
      {
        telegramId: event.tId,
        validAnswer: event.validAnswer,
      },
    );
  }
}
