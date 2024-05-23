const { scrapper, getElementData } = require("../scrapper");
const cheerio = require("cheerio");

describe("scrapper", () => {
  it("returns an empty array when there are no carousel elements", () => {
    const html = "<html></html>";
    expect(scrapper(html)).toEqual(JSON.stringify([]));
  });

  it("returns the correct data when there are carousel elements", () => {
    const html =
      '<script>s=\'data:image/jpeg;base64/test_image\';var ii=[\'imageId\'];</script><g-scrolling-carousel><a aria-label="label" title="label (1994)" href="/href"><img id="imageId"></a></g-scrolling-carousel>';
    expect(scrapper(html)).toEqual(
      JSON.stringify({
        artworks: [
          {
            name: "label",
            extensions: ["1994"],
            link: "https://www.google.com/href",
            image: "data:image/jpeg;base64/test_image",
          },
        ],
      })
    );
  });
});

describe("getElementData", () => {
  it("correctly extracts data from an element", () => {
    const el = cheerio.load(
      '<a aria-label="label" title="title" href="/href"><img id="imageId"></a>'
    )("a");
    const imageData = { imageId: "imageLink" };
    expect(getElementData(el, imageData)).toEqual({
      name: "label",
      link: "https://www.google.com/href",
      image: "imageLink",
    });
  });
  it("correctly extracts data from an element with an extension", () => {
    const el = cheerio.load(
      '<a aria-label="label" title="label (1994)" href="/href"><img id="imageId"></a>'
    )("a");
    const imageData = { imageId: "imageLink" };
    expect(getElementData(el, imageData)).toEqual({
      name: "label",
      extensions: ["1994"],
      link: "https://www.google.com/href",
      image: "imageLink",
    });
  });
});
