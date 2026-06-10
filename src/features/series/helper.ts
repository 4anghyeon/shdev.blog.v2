import { allPosts } from "content-collections";
import { groupBy } from "es-toolkit/array";

export const getPostsBySeries = () => {
  const allPostWithSeries = allPosts.filter((post) => post.series);
  return groupBy(allPostWithSeries, (post) => post.series ?? "");
};
