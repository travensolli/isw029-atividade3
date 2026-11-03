import type { Database } from "../../database/connection";

export interface Course {
  id: number;
  name: string;
}

export interface CourseRepository {
  create(data: { name: string }): Promise<Course>;
  findAll(): Promise<Course[]>;
  findOne(id: number): Promise<Course | undefined>;
}

export class PgCourseRepository implements CourseRepository {
  constructor(private readonly db: Database) {}

  async create(data: { name: string }) {
    const { rows } = await this.db.query<Course>(
      "INSERT INTO courses (name) VALUES ($1) RETURNING id, name",
      [data.name],
    );
    return rows[0];
  }

  async findAll() {
    return (
      await this.db.query<Course>("SELECT id, name FROM courses ORDER BY id")
    ).rows;
  }

  async findOne(id: number) {
    return (
      await this.db.query<Course>(
        "SELECT id, name FROM courses WHERE id = $1",
        [id],
      )
    ).rows[0];
  }

}
