import { extension, paginate, createPaginator } from "./extension.js";
export type {
  PageNumberPaginationOptions,
  PageNumberPaginationMeta,
  CursorPaginationOptions,
  CursorPaginationMeta,
} from "./types.js";

export default extension;

export { extension as pagination, paginate, createPaginator };