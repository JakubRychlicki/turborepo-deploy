import { PrismaClient } from "../prisma/generated/prisma/index.js";
import { mediaUrlExtension } from "./lib/prisma-extensions.js";
import { pagination } from "./lib/pagination/index.js";

const globalForPrisma = global as unknown as { 
  prisma: ReturnType<typeof createExtendedPrisma> | undefined 
};

const createExtendedPrisma = () => {
  return new PrismaClient().$extends(mediaUrlExtension).$extends(pagination({
    pages: {
      includePageCount: true,
    },
  }));
};

export const prisma = globalForPrisma.prisma || createExtendedPrisma();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;