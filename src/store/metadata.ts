interface Meta {
  siteTitle: string;
  description: string;
}

const metadata: Meta = {
  siteTitle: "Ashential Frozen Corner",
  description: "Ashential Frozen Corner",
};

export const getMeta = () => {
  return metadata;
};
