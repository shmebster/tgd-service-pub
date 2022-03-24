import { SocketGateway } from '../socket/socket.gateway';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Config, ConfigDocument } from '../schemas/config.schema';
import { Model } from 'mongoose';
@Injectable()
export class SharedService {
  private logger = new Logger(SharedService.name);
  constructor(
    private socketGateway: SocketGateway,
    @InjectModel(Config.name)
    private configModel: Model<ConfigDocument>,
  ) {
  }

  async getConfig(key: string) {
    return this.configModel
      .findOne({
        key,
      })
      .exec();
  }

  async setConfig(key: string, value: string) {
    const cfgItem = await this.configModel
      .findOne({
        key,
      })
      .exec();
    if (!cfgItem) {
      const record = new this.configModel({
        key,
        value,
      });
      await record.save();
      return record;
    }
    cfgItem.value = value;
    await cfgItem.save();
    return cfgItem;
  }

  sendSocketNotificationToAllClients(event: string, payload?: any) {
    this.logger.verbose(`Sending notification to client: ${event}, ${JSON.stringify(payload)}`);
    this.socketGateway.notifyAllClients(event, payload);
  }

}
