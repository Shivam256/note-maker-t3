import { createRouter } from "./context";
import { z } from "zod";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import * as trpc from "@trpc/server";
import { resolve } from "path";

export const notesRouter = createRouter()
  .query("create", {
    input: z.object({
      title: z.string(),
      description: z.string(),
    }),
    resolve({ input }) {
      return {
        data: {
          title: input?.title,
          flag: "this is from the api",
          description: input?.description,
        },
      };
    },
  })
  .mutation("create-note", {
    input: z.object({
      title: z.string(),
      description: z.string(),
    }),
    async resolve({ ctx, input }) {
      const { title, description } = input;

      try {
        const note = await ctx.prisma.note.create({
          data: {
            title,
            description,
          },
        });

        return await ctx.prisma.note.findMany();
      } catch (err) {
        throw new trpc.TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Soemthing went wrong!",
        });
      }
    },
  })
  .query("getAll", {
    async resolve({ ctx }) {
      return await ctx.prisma.note.findMany();
    },
  })
  .mutation("deleteOne", {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ ctx, input }) {
      const { id } = input;
      console.log(id, "this is to be deleted!");
      await ctx.prisma.note.delete({
        where: {
          id: id,
        },
      });

      return {
        message: "delete successfull!",
        deleted: id,
      };
    },
  })
  .mutation("toggleStar", {
    input: z.object({
      id: z.string(),
      val: z.boolean(),
    }),
    async resolve({ ctx, input }) {
      const { id, val } = input;
      await ctx.prisma.note.update({
        where: {
          id: id,
        },
        data: {
          isSpecial: val,
        },
      });
    },
  });
