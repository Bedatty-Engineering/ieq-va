import { getCollection, render } from "astro:content";
import type { LocalizacaoPageData } from "../types";

export async function getLocalizacaoPageData(): Promise<LocalizacaoPageData> {
  const programacaoEntries = (await getCollection("localizacaoProgramacao"))
    .filter((entry) => entry.data.published)
    .sort((left, right) => left.data.order - right.data.order);

  const programacao = await Promise.all(
    programacaoEntries.map(async (entry) => {
      const { Content } = await render(entry);

      return {
        id: entry.id,
        ...entry.data,
        Content
      };
    })
  );

  const faqEntries = (await getCollection("localizacaoFaq"))
    .filter((entry) => entry.data.published)
    .sort((left, right) => left.data.order - right.data.order);

  const faqItems = await Promise.all(
    faqEntries.map(async (entry) => {
      const { Content } = await render(entry);

      return {
        id: entry.id,
        ...entry.data,
        Content
      };
    })
  );

  return {
    programacao,
    faqItems
  };
}
