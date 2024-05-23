const cheerio = require("cheerio");
const fs = require("fs");
const path = require("path");

const html = fs.readFileSync("./files/van-gogh-paintings.html", "utf8");
const data = scrapper(html);

fs.writeFile(path.join(__dirname, "output", "output.json"), data, (err) => {
  if (err) throw err;
  console.log("Data has been written to output.json successfully");
});

function scrapper(html) {
  $ = cheerio.load(html);

  // Scrape image URLs from the script tags
  const imageData = {};
  $("script").each((i, el) => {
    const scriptContent = $(el).html();

    // Regex the image data and the id
    const matches = scriptContent.matchAll(
      /s='(data:image\/jpeg;base64[^']+)';\s*var ii=\['(.*?)'\];/g
    );

    for (const match of matches) {
      let [, imageLink, imageId] = match;
      imageLink = imageLink.replace(/\\x/g, "x");
      imageData[imageId] = imageLink;
    }
  });

  const carouselElements = $("g-scrolling-carousel a");

  if (!carouselElements.length) return JSON.stringify([]);

  return JSON.stringify({
    artworks: carouselElements
      .map((i, el) => getElementData($(el), imageData))
      .get()
      .filter((i) => i.name),
  });
}

function getElementData(el, imageData) {
  const { "aria-label": name, title, href } = el.attr();

  const link = "https://www.google.com" + href;

  let extensions;
  if (title && name !== title) {
    extensions = getExtension(title);
  }

  // Extract the id from the img tag
  const imageId = $(el).find("img").attr("id");

  // Look up the real image data
  const image = imageData[imageId] || null;

  const details = {
    name,
    ...(extensions && extensions.length > 0 && { extensions }),
    link,
    image,
  };

  return details;
}

function getExtension(str) {
  const match = str.match(/\((\d{4})\)/);
  return match ? [match[1]] : null;
}
