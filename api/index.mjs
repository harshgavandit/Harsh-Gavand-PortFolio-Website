import { loadConfig } from "../server/config.mjs";
import { waitUntil } from "@vercel/functions";
import {
  createVercelHandler,
  withInvocationLifetime,
} from "../server/vercel.mjs";

export default withInvocationLifetime(
  createVercelHandler(loadConfig()),
  waitUntil,
);
