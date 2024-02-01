/**@typedef {import('../types.mjs').PostWithoutFeed} PostWithoutFeed */

/**
 * Converts RSS or Atom text into a list of feed entries
 * from https://github.com/zserge/headline/blob/master/app.js
 *
 * @param {string} text
 * @returns {PostWithoutFeed[]}
 */
const parseRssFeed = (text) => {
  const xml = new DOMParser().parseFromString(text, "text/xml");

  /**
   * @param {Element} item
   * @param {string} name
   * @returns
   */
  const tag = (item, name) =>
    (item.getElementsByTagName(name)[0] || {}).textContent;

  switch (xml.documentElement.nodeName) {
    case "rss":
      return Array.from(xml.documentElement.getElementsByTagName("item")).map(
        (item) => {
          const pubDate = tag(item, "pubDate");
          return {
            url: tag(item, "link") || "#",
            title: tag(item, "title") || "",
            timestamp: pubDate
              ? new Date(pubDate).getTime()
              : new Date().getTime(),
          };
        }
      );
    case "feed":
      return Array.from(xml.documentElement.getElementsByTagName("entry")).map(
        (item) => {
          const pubDate = tag(item, "published") || tag(item, "updated");
          return {
            url:
              Array.from(item.getElementsByTagName("link")).map((link) => {
                const rel = link.getAttribute("rel");
                if (!rel || rel === "alternate") {
                  return link.getAttribute("href");
                }
              })[0] ?? "#",
            title: tag(item, "title") || "",
            timestamp: pubDate
              ? new Date(pubDate).getTime()
              : new Date().getTime(),
          };
        }
      );
  }
  return [];
};

export default parseRssFeed;
