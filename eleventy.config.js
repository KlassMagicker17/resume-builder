import YAML from "yaml";
export default function(eleventyConfig) {
  eleventyConfig.addDataExtension("yml", (contents) => YAML.parse(contents));
  eleventyConfig.addPassthroughCopy("styles/*");
  eleventyConfig.addPassthroughCopy("assets/*");
};
