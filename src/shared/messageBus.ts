import { EventEmitter } from 'events';
import { MessageBusEvent } from './types';

class MessageBus extends EventEmitter {
  publish(event: MessageBusEvent) {
    this.emit(event.type, event);
  }

  subscribe(eventType: string, handler: (event: MessageBusEvent) => void) {
    this.on(eventType, handler);
  }
}

export const messageBus = new MessageBus();
