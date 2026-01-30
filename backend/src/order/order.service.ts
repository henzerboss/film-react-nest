import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { FilmsRepository } from '../repository/films.repository';
import { CreateOrderDto, OrderResponseDto } from './dto/order.dto';

@Injectable()
export class OrderService {
  constructor(private readonly filmsRepository: FilmsRepository) {}

  async createOrder(createOrderDto: CreateOrderDto): Promise<OrderResponseDto> {
    const { tickets } = createOrderDto;
    const bookedTickets = [];

    for (const ticket of tickets) {
      const { film: filmId, session, row, seat, daytime } = ticket;

      const filmDoc = await this.filmsRepository.findOne(filmId);
      if (!filmDoc) {
        throw new NotFoundException(`Фильм не найден: ${filmId}`);
      }

      const scheduleIndex = filmDoc.schedule.findIndex((s) => s.id === session);
      if (scheduleIndex === -1) {
        throw new NotFoundException(`Сеанс не найден: ${session}`);
      }

      const scheduleItem = filmDoc.schedule[scheduleIndex];
      const place = `${row}:${seat}`;

      if (scheduleItem.taken.includes(place)) {
        throw new BadRequestException(`Место ${row}:${seat} уже занято`);
      }

      scheduleItem.taken.push(place);

      filmDoc.markModified('schedule');

      await filmDoc.save();

      bookedTickets.push({
        film: filmId,
        session,
        row,
        seat,
        daytime,
      });
    }

    return {
      items: bookedTickets,
    };
  }
}
