 const normalizeProductData = (fields) => {
  return {
    title: typeof fields.title === "string" ? fields.title.trim() : "",
    category: typeof fields.category === "string" ? fields.category.trim() : "",
    description: typeof fields.description === "string" ? fields.description.trim() : "",
    brand: typeof fields.brand === "string" ? fields.brand.trim() : "",
    price: fields.price !== undefined ? parseFloat(fields.price) : 0,
    stock: fields.stock !== undefined ? parseInt(fields.stock) : 0,
    images: Array.isArray(fields.images)
      ? fields.images.map(img => img.trim()).filter(Boolean)
      : fields.images
        ? [String(fields.images).trim()]
        : [],
    thumbnail: typeof fields.thumbnail === "string" ? fields.thumbnail.trim() : "",
    weight: fields.weight !== undefined ? parseFloat(fields.weight) : 0,
    warrantyInformation: typeof fields.warrantyInformation === "string"
      ? fields.warrantyInformation.trim()
      : "",
    shippingInformation: typeof fields.shippingInformation === "string"
      ? fields.shippingInformation.trim()
      : "",
    returnPolicy: typeof fields.returnPolicy === "string"
      ? fields.returnPolicy.trim()
      : "",
    availabilityStatus: typeof fields.availabilityStatus === "string"
      ? fields.availabilityStatus.trim()
      : "",
    tags: Array.isArray(fields.tags)
      ? fields.tags.map(tag => tag.trim()).filter(Boolean)
      : typeof fields.tags === "string"
        ? fields.tags.split(",").map(tag => tag.trim()).filter(Boolean)
        : [],
    dimensions: {
      width: fields.dimensions?.width !== undefined ? parseFloat(fields.dimensions.width) : 0,
      height: fields.dimensions?.height !== undefined ? parseFloat(fields.dimensions.height) : 0,
      depth: fields.dimensions?.depth !== undefined ? parseFloat(fields.dimensions.depth) : 0,
    },
  };
};
module.exports = normalizeProductData;