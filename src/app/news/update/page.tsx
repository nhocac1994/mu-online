'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import PageBackground from '@/components/PageBackground';
import siteConfig from '@/config/site.config.json';

export default function NewsUpdate() {
  return (
    <div className="min-h-screen relative overflow-hidden bg-black" style={{ fontFamily: 'var(--font-main)' }}>
      <PageBackground />
      <div className="fixed inset-0 bg-black/40 z-[1]" aria-hidden />
      <div className="relative z-10 pt-48">
        {/* Breadcrumb */}
        <section className="py-4 bg-black/30">
          <div className="container mx-auto px-4">
            <nav className="flex space-x-2 text-sm">
              <Link href="/" className="text-blue-400 hover:text-blue-300">Trang Chủ</Link>
              <span className="text-gray-400">/</span>
              <Link href="/news" className="text-blue-400 hover:text-blue-300">Tin Tức</Link>
              <span className="text-gray-400">/</span>
              <span className="text-white">Cập Nhật</span>
            </nav>
          </div>
        </section>

      {/* Article */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-black/50 backdrop-blur-sm rounded-lg p-8 border border-purple-500/30">
              <div className="flex items-center justify-between mb-6">
                <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-semibold">UPDATE</span>
                <span className="text-gray-400">27/08/2025</span>
              </div>
              
              <h1 className="text-4xl font-bold text-white mb-6">
                UPDATE SERVER
              </h1>
              
              <div className="prose prose-invert max-w-none">
                <h2 className="text-2xl font-bold text-white mb-4">🔄 Cập Nhật Phiên Bản 1.1</h2>
                <p className="text-gray-300 mb-6">
                  Chúng tôi vui mừng thông báo về bản cập nhật mới nhất cho server {siteConfig.serverName}!
                </p>
                
                <div className="bg-black/50 backdrop-blur-sm rounded-lg p-6 mb-8 border border-gray-700/50">
                  <h3 className="text-xl font-bold text-white mb-4">✅ Tính Năng Mới</h3>
                  <ul className="text-gray-300 space-y-2">
                    <li>• Hệ thống guild war nâng cao</li>
                    <li>• Thêm map mới: Lost Tower</li>
                    <li>• Hệ thống pet và mount</li>
                    <li>• Cải thiện giao diện game</li>
                    <li>• Thêm tính năng auto-save</li>
                  </ul>
                </div>

                <h2 className="text-2xl font-bold text-white mb-4">🐛 Sửa Lỗi</h2>
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  <div className="bg-black/50 backdrop-blur-sm rounded-lg p-6 border border-red-500/30">
                    <h3 className="text-lg font-bold text-red-400 mb-3">Lỗi Gameplay</h3>
                    <ul className="text-gray-300 space-y-2 text-sm">
                      <li>• Sửa lỗi crash khi PK</li>
                      <li>• Sửa lỗi disconnect</li>
                      <li>• Sửa lỗi lag khi leveling</li>
                      <li>• Sửa lỗi inventory</li>
                    </ul>
                  </div>
                  
                  <div className="bg-black/50 backdrop-blur-sm rounded-lg p-6 border border-blue-500/30">
                    <h3 className="text-lg font-bold text-blue-400 mb-3">Lỗi Server</h3>
                    <ul className="text-gray-300 space-y-2 text-sm">
                      <li>• Sửa lỗi database connection</li>
                      <li>• Cải thiện performance</li>
                      <li>• Sửa lỗi memory leak</li>
                      <li>• Tối ưu hóa network</li>
                    </ul>
                  </div>
                </div>

                <h2 className="text-2xl font-bold text-white mb-4">⚖️ Cân Bằng Game</h2>
                <div className="bg-black/50 backdrop-blur-sm rounded-lg p-6 mb-8 border border-yellow-500/30">
                  <h3 className="text-xl font-bold text-yellow-400 mb-4">Thay Đổi Cân Bằng</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-lg font-bold text-white mb-3">Dark Knight</h4>
                      <ul className="text-gray-300 space-y-1 text-sm">
                        <li>• Tăng sát thương skill 5%</li>
                        <li>• Giảm mana cost 10%</li>
                        <li>• Tăng HP regeneration</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-white mb-3">Dark Wizard</h4>
                      <ul className="text-gray-300 space-y-1 text-sm">
                        <li>• Tăng casting speed 8%</li>
                        <li>• Giảm cooldown skill 15%</li>
                        <li>• Tăng critical rate</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <h2 className="text-2xl font-bold text-white mb-4">🎁 Event Đặc Biệt</h2>
                <p className="text-gray-300 mb-6">
                  Để chào mừng bản cập nhật mới, chúng tôi sẽ tổ chức event đặc biệt:
                </p>
                
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="bg-black/50 backdrop-blur-sm rounded-lg p-6 border border-green-500/30">
                    <h3 className="text-lg font-bold text-green-400 mb-3">🎯 Double EXP</h3>
                    <p className="text-gray-300 text-sm mb-3">Thời gian: 28/08 - 30/08</p>
                    <p className="text-gray-300 text-sm">Nhận gấp đôi kinh nghiệm trong 3 ngày</p>
                  </div>
                  
                  <div className="bg-black/50 backdrop-blur-sm rounded-lg p-6 border border-blue-500/30">
                    <h3 className="text-lg font-bold text-blue-400 mb-3">💎 Drop Rate</h3>
                    <p className="text-gray-300 text-sm mb-3">Thời gian: 28/08 - 30/08</p>
                    <p className="text-gray-300 text-sm">Tăng tỷ lệ rơi đồ hiếm x3</p>
                  </div>
                  
                  <div className="bg-black/50 backdrop-blur-sm rounded-lg p-6 border border-purple-500/30">
                    <h3 className="text-lg font-bold text-purple-400 mb-3">🎁 Free Items</h3>
                    <p className="text-gray-300 text-sm mb-3">Thời gian: 28/08 - 30/08</p>
                    <p className="text-gray-300 text-sm">Nhận free items mỗi ngày</p>
                  </div>
                </div>

                <div className="bg-black/50 backdrop-blur-sm rounded-lg p-6 mt-8 border border-gray-700/50">
                  <h3 className="text-xl font-bold text-white mb-4">📋 Hướng Dẫn Cập Nhật</h3>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-4">
                      <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">1</div>
                      <div>
                        <h4 className="text-lg font-bold text-white mb-2">Tải Launcher Mới</h4>
                        <p className="text-gray-300">Tải xuống launcher phiên bản mới từ trang download</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-4">
                      <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">2</div>
                      <div>
                        <h4 className="text-lg font-bold text-white mb-2">Chạy Auto Update</h4>
                        <p className="text-gray-300">Launcher sẽ tự động cập nhật game files</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-4">
                      <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">3</div>
                      <div>
                        <h4 className="text-lg font-bold text-white mb-2">Khởi Động Game</h4>
                        <p className="text-gray-300">Đăng nhập và trải nghiệm tính năng mới</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      </div>
    </div>
  );
}
