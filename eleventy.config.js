import { HtmlBasePlugin } from "@11ty/eleventy";

import YAML from "yaml";
export default function (eleventyConfig) {
  eleventyConfig.addPlugin(HtmlBasePlugin);
  eleventyConfig.addDataExtension("yml", (contents) => YAML.parse(contents));
  eleventyConfig.addPassthroughCopy("styles/*");
  eleventyConfig.addPassthroughCopy("assets/*");
  eleventyConfig.addBundle("css");
};
