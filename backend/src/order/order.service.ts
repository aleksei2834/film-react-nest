import { BadRequestException, Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';

import { ListResponseDto } from '../films/dto/films.dto';
import { Schedule } from '../films/schemas/film.schema';
import { FilmsRepository } from '../repository/films.repository';
import { CreateOrderDto, OrderedTicketDto, TicketDto } from './dto/order.dto';

interface BookingGroup {
  film: string;
  session: string;
  schedule: Schedule;
  tickets: TicketDto[];
  places: string[];
}

@Injectable()
export class OrderService {
  constructor(private readonly filmsRepository: FilmsRepository) {}

  async createOrder(
    payload: CreateOrderDto,
  ): Promise<ListResponseDto<OrderedTicketDto>> {
    const groups = await this.prepareBookingGroups(payload.tickets);

    for (const group of groups.values()) {
      const reserved = await this.filmsRepository.reserveSeats(
        group.film,
        group.session,
        group.places,
      );

      if (!reserved) {
        throw new BadRequestException(
          'Одно или несколько выбранных мест уже заняты',
        );
      }
    }

    const items = Array.from(groups.values()).flatMap((group) =>
      group.tickets.map((ticket) => ({
        id: randomUUID(),
        film: group.film,
        session: group.session,
        daytime: group.schedule.daytime,
        row: ticket.row,
        seat: ticket.seat,
        price: group.schedule.price,
      })),
    );

    return { total: items.length, items };
  }

  private async prepareBookingGroups(
    tickets: TicketDto[],
  ): Promise<Map<string, BookingGroup>> {
    const groups = new Map<string, BookingGroup>();
    const requestedPlaces = new Set<string>();

    for (const ticket of tickets) {
      this.validateTicketShape(ticket);

      const uniquePlace = `${ticket.film}:${ticket.session}:${ticket.row}:${ticket.seat}`;
      if (requestedPlaces.has(uniquePlace)) {
        throw new BadRequestException(
          'В заказе повторяется одно и то же место',
        );
      }
      requestedPlaces.add(uniquePlace);

      const groupKey = `${ticket.film}:${ticket.session}`;
      let group = groups.get(groupKey);

      if (!group) {
        const schedule = await this.filmsRepository.findSession(
          ticket.film,
          ticket.session,
        );
        if (!schedule) {
          throw new BadRequestException('Фильм или сеанс не найден');
        }
        group = {
          film: ticket.film,
          session: ticket.session,
          schedule,
          tickets: [],
          places: [],
        };
        groups.set(groupKey, group);
      }

      if (
        ticket.row > group.schedule.rows ||
        ticket.seat > group.schedule.seats
      ) {
        throw new BadRequestException('Выбранного места не существует');
      }

      const place = `${ticket.row}:${ticket.seat}`;
      if (group.schedule.taken.includes(place)) {
        throw new BadRequestException('Выбранное место уже занято');
      }

      group.tickets.push(ticket);
      group.places.push(place);
    }

    return groups;
  }

  private validateTicketShape(ticket: TicketDto): void {
    if (
      !ticket ||
      typeof ticket.film !== 'string' ||
      typeof ticket.session !== 'string' ||
      !Number.isInteger(ticket.row) ||
      !Number.isInteger(ticket.seat) ||
      ticket.row < 1 ||
      ticket.seat < 1
    ) {
      throw new BadRequestException('Некорректные данные билета');
    }
  }
}
