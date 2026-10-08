// Cache only database reads. Language preferences are read outside the shared cache.
import * as queries from "./queries";
import { readPreferences } from "./server-preferences";
import { localizedContent, normalizeLocale } from "./preferences";
import { translateRecord } from "./translations";
async function context() {
  const copy = await queries.getSiteContent();
  const { locale } = await readPreferences(normalizeLocale(copy["site.language"]));
  return { copy, locale };
}
export async function getProfile() {
  const [row, { copy, locale }] = await Promise.all([queries.getProfile(), context()]);
  return row ? translateRecord(row, "profile", locale, copy) : null;
}
export async function getSiteContent() {
  const { copy, locale } = await context();
  return localizedContent(copy, locale);
}
export async function getHomeProjects(take = 3) {
  const [result, { copy, locale }] = await Promise.all([queries.getHomeProjects(take), context()]);
  return { ...result, projects: result.projects.map((row) => translateRecord(row, "project", locale, copy)) };
}
export async function getPublishedProjects() {
  const [rows, { copy, locale }] = await Promise.all([queries.getPublishedProjects(), context()]);
  return rows.map((row) => translateRecord(row, "project", locale, copy));
}
export async function getProjectBySlug(slug: string) {
  const [row, { copy, locale }] = await Promise.all([queries.getProjectBySlug(slug), context()]);
  return row ? translateRecord(row, "project", locale, copy) : null;
}
export async function getPublishedArticles() {
  const [rows, { copy, locale }] = await Promise.all([queries.getPublishedArticles(), context()]);
  return rows.map((row) => translateRecord(row, "article", locale, copy));
}
export async function getArticleBySlug(slug: string) {
  const [row, { copy, locale }] = await Promise.all([queries.getArticleBySlug(slug), context()]);
  return row ? translateRecord(row, "article", locale, copy) : null;
}
export async function getPublishedMoments() {
  const [rows, { copy, locale }] = await Promise.all([queries.getPublishedMoments(), context()]);
  return rows.map((row) => translateRecord(row, "moment", locale, copy));
}
export async function getFeaturedMoments() {
  const [rows, { copy, locale }] = await Promise.all([queries.getFeaturedMoments(), context()]);
  return rows.map((row) => translateRecord(row, "moment", locale, copy));
}
export async function getMomentBySlug(slug: string) {
  const [row, { copy, locale }] = await Promise.all([queries.getMomentBySlug(slug), context()]);
  return row ? translateRecord(row, "moment", locale, copy) : null;
}
export { getVisibleSkills } from "./queries";
