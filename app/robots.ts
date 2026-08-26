import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/dashboard", "/admin", "/settings", "/api/", "/sign-in", "/sign-up"],
      },
    ],
    sitemap: "https://hiredbyagents.com/sitemap.xml",
  };
}
