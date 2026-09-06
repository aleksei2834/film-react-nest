import { Test, TestingModule } from '@nestjs/testing';

import { FilmsController } from './films.controller';
import { FilmsService } from './films.service';

describe('FilmsController', () => {
  let controller: FilmsController;
  const filmsServiceMock = {
    getFilms: jest.fn(),
    getSchedule: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FilmsController],
      providers: [{ provide: FilmsService, useValue: filmsServiceMock }],
    }).compile();

    controller = module.get<FilmsController>(FilmsController);
  });

  afterEach(() => jest.clearAllMocks());

  it('should return films from the service', async () => {
    filmsServiceMock.getFilms.mockResolvedValue({ total: 1, items: [] });

    const result = await controller.getFilms();

    expect(filmsServiceMock.getFilms).toHaveBeenCalled();
    expect(result).toEqual({ total: 1, items: [] });
  });
});