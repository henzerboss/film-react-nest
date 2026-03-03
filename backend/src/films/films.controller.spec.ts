import { Test } from '@nestjs/testing';
import { FilmsController } from './films.controller';
import { FilmsService } from './films.service';

describe('FilmsController', () => {
  it('getFilms returns service result', async () => {
    const filmsServiceMock = {
      findAll: jest
        .fn()
        .mockResolvedValue({ total: 1, items: [{ id: '1', title: 't' }] }),
      findSchedule: jest.fn(),
    };

    const moduleRef = await Test.createTestingModule({
      controllers: [FilmsController],
      providers: [{ provide: FilmsService, useValue: filmsServiceMock }],
    }).compile();

    const controller = moduleRef.get(FilmsController);

    const res = await controller.getFilms();
    expect(filmsServiceMock.findAll).toHaveBeenCalled();
    expect(res.total).toBe(1);
  });

  it('getFilmSchedule calls service with id', async () => {
    const filmsServiceMock = {
      findAll: jest.fn(),
      findSchedule: jest.fn().mockResolvedValue({ total: 0, items: [] }),
    };

    const moduleRef = await Test.createTestingModule({
      controllers: [FilmsController],
      providers: [{ provide: FilmsService, useValue: filmsServiceMock }],
    }).compile();

    const controller = moduleRef.get(FilmsController);

    await controller.getFilmSchedule('film-1');
    expect(filmsServiceMock.findSchedule).toHaveBeenCalledWith('film-1');
  });
});
