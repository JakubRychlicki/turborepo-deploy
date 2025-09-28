import { audioSessionRouter } from "./router/audio_session.js";
import { goalRouter } from "./router/goal.js";
import { narratorRouter } from "./router/narrator.js";
import { programRouter } from "./router/program.js";
import { programCategoryRouter } from "./router/program_category.js";
import { programKeywordRouter } from "./router/program_keyword.js";
import { programWorksheetRouter } from "./router/program_worksheet.js";
import { userRouter } from "./router/user.js";
import { createTRPCRouter, publicProcedure } from "./trpc.js";

export const appRouter = createTRPCRouter({
  healthCheck: publicProcedure.query(() => {
    return "OK";
  }),
  user: userRouter,
  narrator: narratorRouter,
  goal: goalRouter,
  program: programRouter,
  programCategory: programCategoryRouter,
  programKeyword: programKeywordRouter,
  programWorksheet: programWorksheetRouter,
  audioSession: audioSessionRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
