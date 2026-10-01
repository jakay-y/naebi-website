// All imagery and the 3D model were generated with Higgsfield for this site.
// The URLs point at Higgsfield's CDN. To self-host, download each file into
// /public/media/ and swap the value for the local path (e.g. '/media/hero-cockpit.png').

const CDN = 'https://d8j0ntlcm91z4.cloudfront.net/user_3K6p09yubbj55XzD1wtKtlumXNI';

export const MEDIA = {
  // Intro flyby supplied by Naebi (self-hosted in /public/media).
  heroVideo: '/media/hero-flyby.mp4',
  heroVideoWebm: '/media/hero-flyby.webm',
  heroPoster: '/media/hero-flyby-poster.jpg',
  bell407: `${CDN}/hf_20261001_215352_60aa2f0f-edf7-4795-bceb-89f5506d57e9.png`,
  bell407Min: `${CDN}/hf_20261001_215352_60aa2f0f-edf7-4795-bceb-89f5506d57e9_min.webp`,
  controlRoom: `${CDN}/hf_20261001_215219_a07b5cf8-ac09-4c23-992a-9d16f6243717.png`,
  controlRoomMin: `${CDN}/hf_20261001_215219_a07b5cf8-ac09-4c23-992a-9d16f6243717_min.webp`,
  helipad: `${CDN}/hf_20261001_215219_7865db93-5566-49f8-b570-daea2829c091.png`,
  helipadMin: `${CDN}/hf_20261001_215219_7865db93-5566-49f8-b570-daea2829c091_min.webp`,
  // Bell 407 GLB from Higgsfield image-to-3D (Tripo). Empty string = image fallback.
  bell407Glb: `${CDN}/hf_20261001_215447_dc2467fa-1732-4708-8dd5-06a66188af8e.glb`,
};

// Tune these if the generated model faces the wrong way or sits off-centre.
export const MODEL_TUNING = {
  // Extra yaw (radians) applied so the nose faces the camera at stop 01.
  yawOffset: 0,
  // Scale the normalised model (it is fitted into a 3.2-unit box first).
  scale: 1,
  // Lift the model on the Y axis after centring.
  lift: 0,
};

// Walkthrough of Naebi HQ, cut into a frame sequence so scroll can scrub it smoothly.
// Source: naebi_intro_video11.mp4, 39s at 12 fps, 720x1280 WebP.
export const HQ_FRAMES = {
  count: 470,
  width: 720,
  height: 1280,
  src: (i: number) => `/media/hq/f${String(i).padStart(4, '0')}.webp`,
};
