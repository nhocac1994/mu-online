'use client';

import React from 'react';
import Link from 'next/link';
import EventCountdown from './EventCountdown';

interface NewsItem {
  title: string;
  date: string;
  type: string;
  link: string;
}

interface EventsNewsModalProps {
  isOpen: boolean;
  onClose: () => void;
  news: NewsItem[];
}

export default function EventsNewsModal({ isOpen, onClose, news }: EventsNewsModalProps) {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={onClose}
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.85)', backdropFilter: 'blur(4px)' }}
    >
      <div 
        className="relative w-full h-full max-w-6xl mx-auto overflow-y-auto mu-retro-bg"
        onClick={(e) => e.stopPropagation()}
        style={{ maxHeight: '100vh', background: 'linear-gradient(180deg, rgba(0,0,0,0.95) 0%, rgba(20,20,20,0.98) 50%, rgba(0,0,0,0.95) 100%)' }}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 mu-retro-card-blur-blur px-4 sm:px-6 py-4 sm:py-6 flex items-center justify-between border-b-2" style={{ borderColor: 'rgba(255, 215, 0, 0.3)' }}>
          <h2 className="text-2xl sm:text-4xl mu-retro-title">⚔️ SỰ KIỆN & BẢN TIN</h2>
          <button
            onClick={onClose}
            className="mu-text-gold hover:text-yellow-300 text-3xl sm:text-4xl font-bold transition-colors w-10 h-10 flex items-center justify-center rounded-full hover:bg-yellow-500/20"
            aria-label="Đóng"
          >
            ×
          </button>
        </div>

        {/* Content - 2 Columns Layout */}
        <div className="px-4 sm:px-6 py-6 sm:py-8">
          <div className="grid lg:grid-cols-2 gap-4 sm:gap-6">
            {/* Left Panel - Events */}
            <div className="mu-retro-card-blur" style={{ padding: '20px 24px', paddingTop: '24px' }}>
              <div className="relative z-10">
                <div className="text-center mb-6 sm:mb-8">
                  <h3 className="text-xl sm:text-2xl mu-retro-title">Sự Kiện</h3>
                </div>
                <div style={{ marginTop: '30px' }}>
                  <EventCountdown />
                </div>
              </div>
            </div>

            {/* Right Panel - News */}
            <div className="mu-retro-card-blur" style={{ padding: '20px 24px', paddingTop: '24px' }}>
              <div className="relative z-10">
                <div className="text-center mb-6 sm:mb-8">
                  <h3 className="text-xl sm:text-2xl mu-retro-title">Bản Tin Mới</h3>
                </div>
                <div style={{ marginTop: '30px' }}>
                  <div className="space-y-3 sm:space-y-4">
                    {news.map((item, index) => (
                      <div key={index} className="p-3 sm:p-4 group" style={{ backgroundColor: 'transparent' }}>
                        <div className="flex items-start gap-2 sm:gap-3">
                          <span className={`mu-retro-badge text-[10px] sm:text-xs px-2 sm:px-3 py-1 font-semibold whitespace-nowrap flex-shrink-0 ${
                            item.type === 'Notice' ? 'mu-retro-badge-notice' : 
                            item.type === 'Event' ? 'mu-retro-badge-event' : 
                            'bg-purple-600 text-white'
                          }`}>
                            {item.type}
                          </span>
                          <div className="flex-1 min-w-0">
                            <h4 className="mu-text-gold font-semibold mb-1 text-xs sm:text-sm">
                              <Link href={item.link} className="mu-retro-link hover:text-yellow-300 transition-colors">
                                {item.title}
                              </Link>
                            </h4>
                            <span className="text-gray-400 text-[10px] sm:text-xs">📅 {item.date}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 mu-retro-card-blur-blur px-4 sm:px-6 py-4 sm:py-6 text-center border-t-2" style={{ borderColor: 'rgba(255, 215, 0, 0.3)' }}>
          <button
            onClick={onClose}
            className="mu-retro-btn-classic text-sm sm:text-base px-8 sm:px-12 py-2 sm:py-3"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
