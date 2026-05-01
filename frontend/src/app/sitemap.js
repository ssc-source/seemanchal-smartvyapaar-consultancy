import { siteConfig } from "../../config/site";

export default function sitemap() {
  const routes = ["", "/services", "/projects", "/about", "/contact"].map(
    (route) => ({
      url: `${siteConfig.url}${route}`,
      lastModified: new Date().toISOString().split("T")[0],
      changeFrequency: route === "" ? "weekly" : "monthly",
      priority: route === "" ? 1 : 0.8,
    })
  );

  return [...routes];
}
