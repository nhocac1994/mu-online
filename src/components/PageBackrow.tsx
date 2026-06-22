'use client';

import React from 'react';

const BG_VERSION = '2';

/** Ảnh nền chung — width 100%, height auto, dùng cho hero + content */
export default function PageBackrow() {
  return (
    <div className="we-page-backrow" aria-hidden>
      <img
        src={`/panel-mu.png?v=${BG_VERSION}`}
        alt=""
        className="we-page-backrow-img"
        loading="eager"
        decoding="async"
      />
    </div>
  );
}
