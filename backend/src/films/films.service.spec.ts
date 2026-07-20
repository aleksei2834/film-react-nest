import { NotFoundException } from '@nestjs/common';

import { FilmsRepository } from '../repository/films.repository';
import { FilmsService } from './films.service';

describe('FilmsService', () => {
  const repository = {
    findAll: jest.fn(),
    findSchedule: jest.fn(),
  };
  const service = new FilmsService(repository as unknown as FilmsRepository);

  beforeEach(() => jest.clearAllMocks());

  it('returns a list with the correct total', async () => {
    repository.findAll.mockResolvedValue([{ id: 'film-1' }]);

    await expect(service.getFilms()).resolves.toEqual({
      total: 1,
      items: [{ id: 'film-1' }],
    });
  });

  it('throws when a film does not exist', async () => {
    repository.findSchedule.mockResolvedValue(null);

    await expect(service.getSchedule('missing')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });
});
