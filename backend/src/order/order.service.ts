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

      const scheduleItem = filmDoc.schedule.find((s) => s.id === session);
      if (!scheduleItem) {
        throw new NotFoundException(`Сеанс не найден: ${session}`);
      }

      const place = `${row}:${seat}`;

      if (scheduleItem.taken.includes(place)) {
        throw new BadRequestException(`Место ${row}:${seat} уже занято`);
      }

      // Создаем новый массив занятых мест
      const updatedTaken = [...scheduleItem.taken, place];

      // Сохраняем изменения через репозиторий
      await this.filmsRepository.updateSchedule(filmId, session, updatedTaken);

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
