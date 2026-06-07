import { z } from "zod";

export const WeatherSchema = z.object({
  success: z.literal(true),

  message: z.string(),

  correlationId: z.string(),

  data: z.object({
    city: z.string(),
    country: z.string(),
    region: z.string(),

    latitude: z.number(),
    longitude: z.number(),

    temperature: z.number(),
    feelsLike: z.number(),
    humidity: z.number(),
    windSpeed: z.number(),

    pressure: z.number(),
    visibility: z.number(),

    condition: z.string(),
    icon: z.string(),

    forecast: z.array(
      z.object({
        date: z.string(),
        maxTemp: z.number(),
        minTemp: z.number(),
        condition: z.string(),
        icon: z.string(),
      })
    ),
  }),
});

export type WeatherApiResponse =
  z.infer<typeof WeatherSchema>;