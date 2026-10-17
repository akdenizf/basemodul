import { renderSocialImage, SOCIAL_IMAGE_SIZE } from "./social-image";

export const alt = "BaseModul – Aus Anfragen werden klare nächste Schritte";
export const size = SOCIAL_IMAGE_SIZE;
export const contentType = "image/png";

export default function OpenGraphImage() {
  return renderSocialImage();
}
