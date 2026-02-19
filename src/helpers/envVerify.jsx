import * as z from "zod";

const envSchema = z.object({
  VITE_OPENROUTER_KEY: z.string().min(1, "A chave da API é obrigatória"), 
  VITE_OPENROUTER_URL: z.string().url("URL da API inválida"),
  VITE_URL: z.string().url("URL base inválida"),
  // Transforma a string da porta em número e define um padrão caso não exista
  VITE_PORT: z.string().default("5173").transform((v) => parseInt(v, 10)),
});

// No Vite, usamos import.meta.env em vez de process.env
export const env = envSchema.parse(import.meta.env);