import { customAlphabet } from "nanoid";

export const SecurityCodeGenerator = customAlphabet("0123456789", 4);
