# Latest update

## Shop product image slider
- Face Care products with only one image are automatically upgraded to 4 images in MongoDB.
- The original product image remains the first slide.
- Three related skincare/detail reference images are added as slides 2-4.
- Shop cards show previous/next controls, dots, slide count, and four clickable thumbnail references below the main image.
- Admin-added product images are preserved; the automatic upgrade only runs when a Face Care product has fewer than four images.

## Gallery
- Product video URLs continue to come from the backend `/api/gallery` endpoint.
- The sample video configuration from the previous update is retained.
