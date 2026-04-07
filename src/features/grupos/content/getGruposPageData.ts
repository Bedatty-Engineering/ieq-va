import { getCollection } from "astro:content";
import type { GruposPageData } from "../types";

export async function getGruposPageData(): Promise<GruposPageData> {
  const groups = (await getCollection("grupos"))
    .filter((entry) => entry.data.published)
    .sort((left, right) => left.data.order - right.data.order)
    .map((entry) => ({
      id: entry.id,
      ...entry.data
    }));

  return { groups };
}
