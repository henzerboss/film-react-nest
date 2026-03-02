import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';

import { Film as FilmMongo } from '../films/films.schema';
import { FilmEntity, ScheduleEntity } from '../films/entities/films.entity';
import { FilmDto, ScheduleDto } from '../films/dto/films.dto';

@Injectable()
export class FilmsRepository {
  private readonly driver: string;

  constructor(
    private readonly configService: ConfigService,
    @InjectModel('Film') private readonly filmMongoModel: Model<FilmMongo>,
    @InjectRepository(FilmEntity)
    private readonly filmPostgresRepo: Repository<FilmEntity>,
    @InjectRepository(ScheduleEntity)
    private readonly schedulePostgresRepo: Repository<ScheduleEntity>,
  ) {
    this.driver = this.configService.get<string>('DATABASE_DRIVER', 'mongodb');
  }

  private mapPostgresToDto(film: FilmEntity): FilmDto {
    const sortedSchedule = [...film.schedule].sort((a, b) => {
      return new Date(a.daytime).getTime() - new Date(b.daytime).getTime();
    });

    return {
      ...film,
      schedule: sortedSchedule as unknown as ScheduleDto[],
    } as unknown as FilmDto;
  }

  async findAll(): Promise<FilmDto[]> {
    if (this.driver === 'postgres') {
      const films = await this.filmPostgresRepo.find({
        relations: ['schedule'],
      });
      return films.map((f) => this.mapPostgresToDto(f));
    }
    return this.filmMongoModel.find().lean().exec() as unknown as FilmDto[];
  }

  async findOne(id: string): Promise<any> {
    if (this.driver === 'postgres') {
      const film = await this.filmPostgresRepo.findOne({
        where: { id },
        relations: ['schedule'],
      });
      return film ? this.mapPostgresToDto(film) : null;
    }
    return this.filmMongoModel.findOne({ id }).exec();
  }

  async updateSchedule(
    filmId: string,
    scheduleId: string,
    taken: string[],
  ): Promise<void> {
    if (this.driver === 'postgres') {
      await this.schedulePostgresRepo.update({ id: scheduleId }, { taken });
    } else {
      const film = await this.filmMongoModel.findOne({ id: filmId });
      if (!film) return;

      const schedule = film.schedule.find((s) => s.id === scheduleId);
      if (schedule) {
        schedule.taken = taken;
        film.markModified('schedule');
        await film.save();
      }
    }
  }
}
