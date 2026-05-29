'use client';

import { CSSProperties } from 'react';

const ICONS: Record<string, { vb: string; inner: string }> = {
  'arrow-left':    { vb: '0 0 24 24', inner: '<g transform="translate(2.6 4.1)"><path d="M 0.264 8.536 C -0.088 8.185 -0.088 7.615 0.264 7.264 L 7.264 0.264 C 7.615 -0.088 8.185 -0.088 8.536 0.264 C 8.888 0.615 8.888 1.185 8.536 1.536 L 3.073 7 L 17.9 7 C 18.397 7 18.8 7.403 18.8 7.9 C 18.8 8.397 18.397 8.8 17.9 8.8 L 3.073 8.8 L 8.536 14.264 C 8.888 14.615 8.888 15.185 8.536 15.536 C 8.185 15.888 7.615 15.888 7.264 15.536 Z" fill-rule="evenodd"/></g>' },
  'arrow-right':   { vb: '0 0 24 24', inner: '<g transform="translate(2.6 4.1)"><path d="M 18.536 8.536 C 18.888 8.185 18.888 7.615 18.536 7.264 L 11.536 0.264 C 11.185 -0.088 10.615 -0.088 10.264 0.264 C 9.912 0.615 9.912 1.185 10.264 1.536 L 15.727 7 L 0.9 7 C 0.403 7 0 7.403 0 7.9 C 0 8.397 0.403 8.8 0.9 8.8 L 15.727 8.8 L 10.264 14.264 C 9.912 14.615 9.912 15.185 10.264 15.536 C 10.615 15.888 11.185 15.888 11.536 15.536 Z" fill-rule="evenodd"/></g>' },
  'chevron-right': { vb: '0 0 24 24', inner: '<path d="M9 18l6-6-6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>' },
  'chevron-down':  { vb: '0 0 24 24', inner: '<path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>' },
  'plus':          { vb: '0 0 24 24', inner: '<path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>' },
  'close':         { vb: '0 0 24 24', inner: '<path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>' },
  'search':        { vb: '0 0 24 24', inner: '<circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="2" fill="none"/><path d="M21 21l-4.35-4.35" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>' },
  'home':          { vb: '0 0 24 24', inner: '<path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" stroke="currentColor" stroke-width="2" fill="none"/><polyline points="9 22 9 12 15 12 15 22" stroke="currentColor" stroke-width="2" fill="none"/>' },
  'home-fill':     { vb: '0 0 24 24', inner: '<path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" fill="currentColor"/><path d="M9 22V12h6v10" stroke="white" stroke-width="1.5" fill="none"/>' },
  'write':         { vb: '0 0 24 24', inner: '<path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/>' },
  'pencil':        { vb: '0 0 24 24', inner: '<path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/>' },
  'trophy':        { vb: '0 0 24 24', inner: '<path d="M6 9H3.5A2.5 2.5 0 011 6.5v-1h5" stroke="currentColor" stroke-width="2" fill="none"/><path d="M18 9h2.5A2.5 2.5 0 0023 6.5v-1h-5" stroke="currentColor" stroke-width="2" fill="none"/><path d="M8 21h8M12 21v-4" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none"/><rect x="6" y="2" width="12" height="14" rx="2" stroke="currentColor" stroke-width="2" fill="none"/>' },
  'star':          { vb: '0 0 24 24', inner: '<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" stroke="currentColor" stroke-width="2" fill="none" stroke-linejoin="round"/>' },
  'star-fill':     { vb: '0 0 24 24', inner: '<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="currentColor" stroke-linejoin="round"/>' },
  'bubble':        { vb: '0 0 24 24', inner: '<path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" stroke="currentColor" stroke-width="2" fill="none" stroke-linejoin="round"/>' },
  'bubble-fill':   { vb: '0 0 24 24', inner: '<path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" fill="currentColor"/>' },
  'heart':         { vb: '0 0 24 24', inner: '<path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" stroke="currentColor" stroke-width="2" fill="none"/>' },
  'heart-fill':    { vb: '0 0 24 24', inner: '<path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" fill="currentColor"/>' },
  'sparkle':       { vb: '0 0 24 24', inner: '<path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>' },
  'sparkle-fill':  { vb: '0 0 24 24', inner: '<path d="M12 1L9 9l-8 3 8 3 3 8 3-8 8-3-8-3-3-8z" fill="currentColor"/>' },
  'persons':       { vb: '0 0 24 24', inner: '<path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="currentColor" stroke-width="2" fill="none"/><circle cx="9" cy="7" r="4" stroke="currentColor" stroke-width="2" fill="none"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/>' },
  'person':        { vb: '0 0 24 24', inner: '<circle cx="12" cy="8" r="4" stroke="currentColor" stroke-width="2" fill="none"/><path d="M20 21a8 8 0 10-16 0" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/>' },
  'person-fill':   { vb: '0 0 24 24', inner: '<circle cx="12" cy="8" r="4" fill="currentColor"/><path d="M4 21a8 8 0 0116 0H4z" fill="currentColor"/>' },
  'document':      { vb: '0 0 24 24', inner: '<path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke="currentColor" stroke-width="2" fill="none"/><polyline points="14 2 14 8 20 8" stroke="currentColor" stroke-width="2" fill="none"/>' },
  'microphone':    { vb: '0 0 24 24', inner: '<rect x="9" y="2" width="6" height="11" rx="3" stroke="currentColor" stroke-width="2" fill="none"/><path d="M19 10v2a7 7 0 01-14 0v-2M12 19v4M8 23h8" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none"/>' },
  'camera':        { vb: '0 0 24 24', inner: '<path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" stroke="currentColor" stroke-width="2" fill="none"/><circle cx="12" cy="13" r="4" stroke="currentColor" stroke-width="2" fill="none"/>' },
  'eye':           { vb: '0 0 24 24', inner: '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" stroke-width="2" fill="none"/><circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2" fill="none"/>' },
  'eye-slash':     { vb: '0 0 24 24', inner: '<path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19M1 1l22 22" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none"/>' },
  'crown':         { vb: '0 0 24 24', inner: '<path d="M2 20h20M4 16L2 6l5 4 5-8 5 8 5-4-2 10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>' },
  'circle-check':  { vb: '0 0 24 24', inner: '<circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" fill="none"/><path d="M9 12l2 2 4-4" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none"/>' },
  'circle-check-fill': { vb: '0 0 24 24', inner: '<circle cx="12" cy="12" r="10" fill="currentColor"/><path d="M9 12l2 2 4-4" stroke="white" stroke-width="2" stroke-linecap="round" fill="none"/>' },
  'circle-plus':   { vb: '0 0 24 24', inner: '<circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" fill="none"/><path d="M12 8v8M8 12h8" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none"/>' },
  'circle-close':  { vb: '0 0 24 24', inner: '<circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" fill="none"/><path d="M15 9l-6 6M9 9l6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none"/>' },
  'send':          { vb: '0 0 24 24', inner: '<line x1="22" y1="2" x2="11" y2="13" stroke="currentColor" stroke-width="2"/><polygon points="22 2 15 22 11 13 2 9 22 2" stroke="currentColor" stroke-width="2" fill="none" stroke-linejoin="round"/>' },
  'download':      { vb: '0 0 24 24', inner: '<path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none"/>' },
  'share':         { vb: '0 0 24 24', inner: '<circle cx="18" cy="5" r="3" stroke="currentColor" stroke-width="2" fill="none"/><circle cx="6" cy="12" r="3" stroke="currentColor" stroke-width="2" fill="none"/><circle cx="18" cy="19" r="3" stroke="currentColor" stroke-width="2" fill="none"/><path d="M8.59 13.51l6.83 3.98M15.41 6.51L8.59 10.49" stroke="currentColor" stroke-width="2" fill="none"/>' },
  'setting':       { vb: '0 0 24 24', inner: '<circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2" fill="none"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" stroke="currentColor" stroke-width="2" fill="none"/>' },
  'bell':          { vb: '0 0 24 24', inner: '<path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none"/>' },
  'bell-fill':     { vb: '0 0 24 24', inner: '<path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" fill="currentColor"/><path d="M13.73 21a2 2 0 01-3.46 0" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none"/>' },
  'bookmark':      { vb: '0 0 24 24', inner: '<path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" stroke="currentColor" stroke-width="2" fill="none" stroke-linejoin="round"/>' },
  'bookmark-fill': { vb: '0 0 24 24', inner: '<path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" fill="currentColor"/>' },
  'filter':        { vb: '0 0 24 24', inner: '<polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" stroke="currentColor" stroke-width="2" fill="none" stroke-linejoin="round"/>' },
  'link':          { vb: '0 0 24 24', inner: '<path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none"/>' },
  'mail':          { vb: '0 0 24 24', inner: '<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor" stroke-width="2" fill="none"/><polyline points="22,6 12,13 2,6" stroke="currentColor" stroke-width="2" fill="none"/>' },
  'check':         { vb: '0 0 24 24', inner: '<path d="M20 6L9 17l-5-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>' },
  'more-horizontal':{ vb: '0 0 24 24', inner: '<circle cx="12" cy="12" r="1.5" fill="currentColor"/><circle cx="6" cy="12" r="1.5" fill="currentColor"/><circle cx="18" cy="12" r="1.5" fill="currentColor"/>' },
  'more-vertical': { vb: '0 0 24 24', inner: '<circle cx="12" cy="12" r="1.5" fill="currentColor"/><circle cx="12" cy="6" r="1.5" fill="currentColor"/><circle cx="12" cy="18" r="1.5" fill="currentColor"/>' },
  'refresh':       { vb: '0 0 24 24', inner: '<polyline points="23 4 23 10 17 10" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none"/><path d="M20.49 15a9 9 0 11-2.12-9.36L23 10" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none"/>' },
  'external-link': { vb: '0 0 24 24', inner: '<path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none"/>' },
  'fire':          { vb: '0 0 24 24', inner: '<path d="M12 2c0 0-2 4-2 7s2 5 2 5c0-2 1-4 1-4 1 1 2 3 2 5 0 3-2 5-5 5C5.5 20 3 17 3 14c0-5 4-9 4-9 0 3 1 5 1 5 1-2 3-4 4-8z" fill="currentColor"/>' },
  'clock':         { vb: '0 0 24 24', inner: '<circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" fill="none"/><polyline points="12 6 12 12 16 14" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none"/>' },
  'calendar':      { vb: '0 0 24 24', inner: '<rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" stroke-width="2" fill="none"/><line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" stroke-width="2"/>' },
  'location':      { vb: '0 0 24 24', inner: '<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" stroke="currentColor" stroke-width="2" fill="none"/><circle cx="12" cy="10" r="3" stroke="currentColor" stroke-width="2" fill="none"/>' },
  'folder':        { vb: '0 0 24 24', inner: '<path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" stroke="currentColor" stroke-width="2" fill="none"/>' },
  'image':         { vb: '0 0 24 24', inner: '<rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" stroke-width="2" fill="none"/><circle cx="8.5" cy="8.5" r="1.5" fill="currentColor"/><polyline points="21 15 16 10 5 21" stroke="currentColor" stroke-width="2" fill="none"/>' },
  'globe':         { vb: '0 0 24 24', inner: '<circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" fill="none"/><line x1="2" y1="12" x2="22" y2="12" stroke="currentColor" stroke-width="2"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" stroke="currentColor" stroke-width="2" fill="none"/>' },
  'lock':          { vb: '0 0 24 24', inner: '<rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" stroke-width="2" fill="none"/><path d="M7 11V7a5 5 0 0110 0v4" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none"/>' },
  'minus':         { vb: '0 0 24 24', inner: '<line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>' },
  'moon':          { vb: '0 0 24 24', inner: '<path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" stroke="currentColor" stroke-width="2" fill="none"/>' },
  'diamond':       { vb: '0 0 24 24', inner: '<polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2" stroke="currentColor" stroke-width="2" fill="none" stroke-linejoin="round"/>' },
  'circle-info':   { vb: '0 0 24 24', inner: '<circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" fill="none"/><line x1="12" y1="8" x2="12" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="12" y1="16" x2="12.01" y2="16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>' },
  'circle-exclamation': { vb: '0 0 24 24', inner: '<circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" fill="none"/><line x1="12" y1="8" x2="12" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="12" y1="16" x2="12.01" y2="16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>' },
  'circle-question': { vb: '0 0 24 24', inner: '<circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" fill="none"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3M12 17h.01" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none"/>' },
  'menu':          { vb: '0 0 24 24', inner: '<line x1="3" y1="6" x2="21" y2="6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="3" y1="12" x2="21" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="3" y1="18" x2="21" y2="18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>' },
};

interface IconProps {
  name: string;
  size?: number;
  color?: string;
  style?: CSSProperties;
}

export default function Icon({ name, size = 22, color, style = {} }: IconProps) {
  const sprite = ICONS[name];
  if (!sprite) {
    return (
      <span style={{ display: 'inline-flex', width: size, height: size, flexShrink: 0, ...style }}>
        <span style={{ width: size, height: size, background: 'var(--color-coolNeutral-95)', borderRadius: 4, display: 'block' }} />
      </span>
    );
  }
  return (
    <span aria-hidden="true" style={{ display: 'inline-flex', width: size, height: size, flexShrink: 0, color: color ?? 'currentColor', lineHeight: 0, ...style }}>
      <svg width={size} height={size} viewBox={sprite.vb} fill="none" style={{ display: 'block' }} dangerouslySetInnerHTML={{ __html: sprite.inner }} />
    </span>
  );
}
