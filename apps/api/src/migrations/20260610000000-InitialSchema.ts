import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema20260610000000 implements MigrationInterface {
  name = 'InitialSchema20260610000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "project" (
        "id" uuid NOT NULL,
        "name" character varying(255) NOT NULL,
        "archived" boolean NOT NULL DEFAULT false,
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_project" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "issue" (
        "id" uuid NOT NULL,
        "project_id" uuid NOT NULL,
        "title" character varying(255) NOT NULL,
        "description" text,
        "status" character varying NOT NULL DEFAULT 'open',
        "priority" character varying NOT NULL DEFAULT 'medium',
        "assignee" character varying(255),
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_issue" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "comment" (
        "id" uuid NOT NULL,
        "issue_id" uuid NOT NULL,
        "author" character varying(255) NOT NULL,
        "body" text NOT NULL,
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_comment" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      ALTER TABLE "issue"
        ADD CONSTRAINT "FK_issue_project"
        FOREIGN KEY ("project_id")
        REFERENCES "project"("id")
        ON DELETE CASCADE
        ON UPDATE NO ACTION
    `);

    await queryRunner.query(`
      ALTER TABLE "comment"
        ADD CONSTRAINT "FK_comment_issue"
        FOREIGN KEY ("issue_id")
        REFERENCES "issue"("id")
        ON DELETE CASCADE
        ON UPDATE NO ACTION
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "comment" DROP CONSTRAINT "FK_comment_issue"`);
    await queryRunner.query(`ALTER TABLE "issue" DROP CONSTRAINT "FK_issue_project"`);
    await queryRunner.query(`DROP TABLE "comment"`);
    await queryRunner.query(`DROP TABLE "issue"`);
    await queryRunner.query(`DROP TABLE "project"`);
  }
}
