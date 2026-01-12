import { PropsWithChildren } from 'react';
import { StaticImageData } from 'next/image';

type ImageSrc = string | StaticImageData;

export default function ProfileImage({ src }: PropsWithChildren<{ src: ImageSrc }>) {
  const imageSrc = typeof src === 'string' ? src : src.src;
  
  return (
    <div className="pb-3 text-md-right text-center">
      <img style={{ maxHeight: '320px' }} className="img-fluid rounded" src={imageSrc} alt="Profile" />
    </div>
  );
}
