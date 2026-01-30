import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Film } from '../films/films.schema';
import { FilmDto } from '../films/dto/films.dto';

@Injectable()
export class FilmsRepository {
  constructor(
    @InjectModel(Film.name) private readonly filmModel: Model<Film>,
  ) {}

  async findAll(): Promise<FilmDto[]> {
    return this.filmModel.find().lean().exec() as unknown as FilmDto[];
  }

  async findOne(id: string): Promise<Film> {
    return this.filmModel.findOne({ id }).exec();
  }
}
