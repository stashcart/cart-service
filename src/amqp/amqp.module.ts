import { AmqpConnection, RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AmqpService } from './amqp.service';

@Global()
@Module({
  imports: [
    RabbitMQModule.forRootAsync(RabbitMQModule, {
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get('AMQP_URL', ''),
        exchanges: [
          {
            name: 'product',
            type: 'topic',
          },
          {
            name: 'profile',
            type: 'topic',
          },
        ],
      }),
    }),
  ],
  providers: [
    {
      provide: AmqpService,
      useExisting: AmqpConnection,
    },
  ],
  exports: [AmqpService],
})
export class AmqpModule {}
