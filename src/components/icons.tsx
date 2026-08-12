import React from 'react';

export const TikTokColoredIcon = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 448 512" 
    className={className}
  >
    <path fill="#25F4EE" d="M448,209.91a210.06,210.06,0,0,1-122.77-39.25V349.38A162.55,162.55,0,1,1,185,188.31V278.2a74.62,74.62,0,1,0,52.23,71.18V0l88,0a121.18,121.18,0,0,0,1.86,22.17h0A122.18,122.18,0,0,0,381,102.39a121.43,121.43,0,0,0,67,20.14Z" transform="translate(-10, -10)"/>
    <path fill="#FE2C55" d="M448,209.91a210.06,210.06,0,0,1-122.77-39.25V349.38A162.55,162.55,0,1,1,185,188.31V278.2a74.62,74.62,0,1,0,52.23,71.18V0l88,0a121.18,121.18,0,0,0,1.86,22.17h0A122.18,122.18,0,0,0,381,102.39a121.43,121.43,0,0,0,67,20.14Z" transform="translate(10, 10)"/>
    <path fill="#FFFFFF" d="M448,209.91a210.06,210.06,0,0,1-122.77-39.25V349.38A162.55,162.55,0,1,1,185,188.31V278.2a74.62,74.62,0,1,0,52.23,71.18V0l88,0a121.18,121.18,0,0,0,1.86,22.17h0A122.18,122.18,0,0,0,381,102.39a121.43,121.43,0,0,0,67,20.14Z"/>
  </svg>
);

export const InstagramColoredIcon = ({ className }: { className?: string }) => {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <linearGradient id="instagram-gradient-icon" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#f09433" />
          <stop offset="25%" stopColor="#e6683c" />
          <stop offset="50%" stopColor="#dc2743" />
          <stop offset="75%" stopColor="#cc2366" />
          <stop offset="100%" stopColor="#bc1888" />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="20" height="20" rx="5" stroke="url(#instagram-gradient-icon)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" stroke="url(#instagram-gradient-icon)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" stroke="url(#instagram-gradient-icon)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
};

export const YouTubeColoredIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M21.582 6.186a2.784 2.784 0 0 0-1.96-1.96C17.892 3.75 12 3.75 12 3.75s-5.892 0-7.622.476A2.784 2.784 0 0 0 2.418 6.186C1.942 7.915 1.942 12 1.942 12s0 4.085.476 5.814a2.784 2.784 0 0 0 1.96 1.96C6.108 20.25 12 20.25 12 20.25s5.892 0 7.622-.476a2.784 2.784 0 0 0 1.96-1.96c.476-1.729.476-5.814.476-5.814s0-4.085-.476-5.814z" fill="#FF0000"/>
    <path d="M9.996 15.5V8.5l6.504 3.5-6.504 3.5z" fill="#FFFFFF"/>
  </svg>
);

export const TwitterColoredIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="#1DA1F2" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M23.643 4.937c-.835.37-1.732.62-2.675.733.962-.576 1.7-1.49 2.048-2.578-.9.534-1.897.922-2.958 1.13-.85-.904-2.06-1.47-3.4-1.47-2.572 0-4.658 2.086-4.658 4.66 0 .364.042.718.12 1.06-3.873-.195-7.304-2.05-9.602-4.868-.4.69-.63 1.49-.63 2.342 0 1.616.823 3.043 2.072 3.878-.764-.025-1.482-.234-2.11-.583v.06c0 2.257 1.605 4.14 3.737 4.568-.392.106-.803.162-1.227.162-.3 0-.593-.028-.877-.082.593 1.85 2.313 3.198 4.352 3.234-1.595 1.25-3.604 1.995-5.786 1.995-.376 0-.747-.022-1.112-.065 2.062 1.323 4.51 2.093 7.14 2.093 8.57 0 13.255-7.098 13.255-13.254 0-.2-.005-.402-.014-.602.91-.658 1.7-1.477 2.323-2.41z"/>
  </svg>
);

export const KickColoredIcon = ({ className, fontSize = '18px' }: { className?: string, fontSize?: string }) => (
  <div className={`bg-[#53FC18] text-black font-black flex items-center justify-center rounded-md ${className}`} style={{ fontSize }}>
    K
  </div>
);
