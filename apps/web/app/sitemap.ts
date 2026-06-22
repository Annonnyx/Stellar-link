import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://novastudio.fr";
  const routes = [
    "/",
    "/services",
    "/portfolio",
    "/join",
    "/request",
    "/about",
    "/contact",
    "/creators",
    "/legal/terms",
    "/legal/privacy",
    "/legal/mentions",
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "/" ? 1.0 : 0.7,
  }));
}
