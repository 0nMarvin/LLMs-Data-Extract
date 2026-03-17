import * as z from "zod";
import { formatarParaSnakeCase } from "../helpers/listUtils";

export const listGeneratorSchema = z.object({
  tema: z.string(),
  atributos: z
    .array(z.string())
    .min(2)
    .nullable()
    .transform((val) => {
      if (!val) return null;
      return val.map((attr) => formatarParaSnakeCase(attr));
    }),
  filtros: z.array(z.string()).nullable(),
  finalList: z
    .object({
      json: z.string().min(1),
      list: z.string(),
    })
    .nullable(),
});

export const initialGenerationState = {
  tema: "",
  atributos: null,
  filtros: null,
  finalList: null,
};