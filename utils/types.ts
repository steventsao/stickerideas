/* eslint-disable no-unused-vars */
export interface ImageProps {
  id: number;
  height: string;
  width: string;
  public_id: string;
  format: string;
  blurDataUrl?: string;
  prompt: string;
}

export interface StickerProps {
  prompt: string;
  public_id: string;
  format: string;
  blurDataUrl: string;
}
export type StickerAction = {
  imageUrl: string;
  public_id: string;
};
export interface StickersResponse {
  images: ImageProps[];
  nextCursor: string;
}

export interface SharedModalProps {
  index: number;
  images?: ImageProps[];
  currentPhoto?: ImageProps;
  changePhotoId: (newVal: number) => void;
  closeModal: () => void;
  navigation: boolean;
  direction?: number;
}
