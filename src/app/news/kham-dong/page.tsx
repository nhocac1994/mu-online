'use client';

import React, { useMemo, useState, useEffect } from 'react';
import Link from 'next/link';
import PageBackground from '@/components/PageBackground';
import siteConfigStatic from '@/config/site.config.json';
import { getSiteConfig, type SiteConfig } from '@/lib/config-api';

type OptionRecipe = {
  mixIndex: number;
  name: string;
  category: string;
  zenLabel: string;
  ratesLabel: { al0: number; al1: number };
  materials: { itemKey?: string; item: string; count: number }[];
  excBitmask: number | null;
};

type MaterialRow = { itemKey?: string; item: string; count: number };

type OptionMixData = {
  generatedAt: string;
  maxExcLines: number | null;
  commonMaterials?: MaterialRow[];
  categories: string[];
  recipes: OptionRecipe[];
};

const BASE_MATERIAL_KEYS = new Set(['12,15', '12,30', '12,31', '12,137', '14,16']);

function normalize(s: string) {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

function RecipeCard({
  recipe,
  isOpen,
  onToggle,
}: {
  recipe: OptionRecipe;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="overflow-hidden rounded-lg border border-white/25 bg-black/35">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left transition-colors hover:bg-white/5"
      >
        <span className="min-w-0 flex-1">
          <span className="block font-semibold text-white">{recipe.name}</span>
          <span className="mt-0.5 block text-xs text-gray-400">
            Mã #{recipe.mixIndex} · {recipe.zenLabel} · {recipe.materials.length} nguyên liệu · Thường{' '}
            {recipe.ratesLabel.al0}% · VIP {recipe.ratesLabel.al1}%
          </span>
        </span>
        <span className="shrink-0 text-lg leading-none text-[#F39C12]" aria-hidden>
          {isOpen ? '−' : '+'}
        </span>
      </button>
      {isOpen && (
        <div className="space-y-4 border-t border-white/15 px-4 py-4 text-sm">
          <div>
            <h4 className="mb-2 font-bold text-[#F39C12]">Tỷ lệ khảm thành công (%)</h4>
            <div className="grid max-w-xs grid-cols-2 gap-2">
              <RateBox label="Acc thường" rate={recipe.ratesLabel.al0} />
              <RateBox label="Acc VIP" rate={recipe.ratesLabel.al1} />
            </div>
            <p className="mt-2 text-xs text-gray-500">Phí khảm: {recipe.zenLabel}</p>
          </div>

          {recipe.materials.length > 0 && (
            <div>
              <h4 className="mb-2 font-bold text-[#F39C12]">Nguyên liệu cần có</h4>
              <ul className="grid gap-1 text-gray-300 sm:grid-cols-2">
                {recipe.materials.map((m, i) => (
                  <li key={i}>
                    <span className="text-[#7dd3fc]">×{m.count}</span> {m.item}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function RateBox({ label, rate }: { label: string; rate: number }) {
  return (
    <div className="rounded border border-white/10 bg-black/50 px-2 py-1.5 text-center">
      <div className="text-[10px] uppercase text-gray-500">{label}</div>
      <div className="font-bold text-white">{rate}%</div>
    </div>
  );
}

export default function KhamDongGuidePage() {
  const [siteConfig, setSiteConfig] = useState<SiteConfig | null>(siteConfigStatic as unknown as SiteConfig);
  const [data, setData] = useState<OptionMixData | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [expanded, setExpanded] = useState<number | null>(null);

  useEffect(() => {
    getSiteConfig().then((c) => {
      if (c) setSiteConfig(c);
    });
  }, []);

  useEffect(() => {
    let cancelled = false;
    setLoadError(null);
    fetch(`/data/custom-option.json?t=${Date.now()}`, { cache: 'no-store' })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json() as Promise<OptionMixData>;
      })
      .then((json) => {
        if (!cancelled) setData(json);
      })
      .catch((err) => {
        if (!cancelled) setLoadError(err instanceof Error ? err.message : 'Lỗi tải dữ liệu');
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const serverName = siteConfig?.serverName || siteConfigStatic.serverName;
  const recipes = data?.recipes ?? [];
  const categories = data?.categories ?? [];

  const baseMaterials = useMemo(() => {
    const fromCommon = (data?.commonMaterials ?? []).filter(
      (m) => m.itemKey && BASE_MATERIAL_KEYS.has(m.itemKey)
    );
    if (fromCommon.length > 0) return fromCommon;
    return [
      { item: 'Ngọc Hỗn Nguyên', count: 1 },
      { item: 'Cụm Ngọc Ước Nguyện', count: 1 },
      { item: 'Cụm Ngọc Tâm Linh', count: 1 },
      { item: 'Cụm Ngọc Sáng Tạo', count: 1 },
      { item: 'Ngọc Sinh Mệnh', count: 5 },
    ];
  }, [data?.commonMaterials]);

  const filtered = useMemo(() => {
    const q = normalize(search.trim());
    return recipes.filter((r) => {
      if (category !== 'all' && r.category !== category) return false;
      if (!q) return true;
      return (
        normalize(r.name).includes(q) ||
        normalize(r.category).includes(q) ||
        r.materials.some((m) => normalize(m.item).includes(q))
      );
    });
  }, [recipes, search, category]);

  const grouped = useMemo(() => {
    const map = new Map<string, OptionRecipe[]>();
    for (const r of filtered) {
      if (!map.has(r.category)) map.set(r.category, []);
      map.get(r.category)!.push(r);
    }
    return [...map.entries()];
  }, [filtered]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-black" style={{ fontFamily: 'var(--font-main)' }}>
      <PageBackground />
      <div className="pointer-events-none fixed inset-0 z-[1] bg-black/40" aria-hidden />
      <div className="relative z-10 px-4 pb-12 pt-48">
        <section className="bg-black/30 py-4">
          <div className="container mx-auto px-4">
            <nav className="flex flex-wrap gap-x-2 gap-y-1 text-sm">
              <Link href="/" className="text-blue-400 hover:text-blue-300">
                Trang chủ
              </Link>
              <span className="text-gray-400">/</span>
              <Link href="/news" className="text-blue-400 hover:text-blue-300">
                Bản tin
              </Link>
              <span className="text-gray-400">/</span>
              <span className="text-white">Khảm đồng (Mix Option)</span>
            </nav>
          </div>
        </section>

        <section className="py-8 sm:py-12">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-4xl">
              <div className="rounded-lg border border-white/40 bg-black/50 p-6 sm:p-8">
                <div className="mb-6 flex flex-wrap items-center justify-between gap-2">
                  <span className="rounded bg-purple-600 px-3 py-1 text-sm font-semibold text-white">MỚI</span>
                  <span className="text-sm text-gray-400">17/5/2026</span>
                </div>

                <h1 className="mb-3 text-2xl font-bold text-white sm:text-3xl">
                  HƯỚNG DẪN KHẢM ĐỒNG (MIX OPTION) — {String(serverName).toUpperCase()}
                </h1>
                <p className="mb-4 text-sm text-gray-300">
                  Công thức khảm dòng option (đồng) lên trang bị có Exc. Tỷ lệ theo Acc thường (AL0) và Acc VIP (AL1).
                </p>

                <p className="mb-6 text-sm">
                  <Link href="/news/chaos-mix" className="font-medium text-[#F39C12] hover:underline">
                    → Xem hướng dẫn Hợp thành trang bị
                  </Link>
                </p>

                {data?.generatedAt && (
                  <p className="mb-4 text-xs text-gray-500">
                    Dữ liệu cập nhật: {new Date(data.generatedAt).toLocaleString('vi-VN')}
                  </p>
                )}

                <div className="mb-8 rounded-lg border border-[#F39C12]/40 bg-black/40 p-4 text-sm text-gray-300">
                  <h2 className="mb-2 font-bold text-[#F39C12]">Lưu ý khi khảm</h2>
                  <ul className="list-disc space-y-1 pl-5">
                    <li>Trang bị phải có ít nhất 1 dòng Exc trước khi khảm.</li>
                    <li>Phí khảm mỗi lần: 100M Zen.</li>
                  </ul>
                </div>

                {data && baseMaterials.length > 0 && (
                  <div className="mb-8 rounded-lg border border-white/25 bg-black/40 p-4 text-sm">
                    <h2 className="mb-3 font-bold text-[#F39C12]">Nguyên liệu cơ bản (lặp lại mọi loại khảm)</h2>
                    <ul className="grid gap-1 text-gray-300 sm:grid-cols-2">
                      {baseMaterials.map((m, i) => (
                        <li key={i}>
                          <span className="text-[#7dd3fc]">×{m.count}</span> {m.item}
                        </li>
                      ))}
                    </ul>
                    <p className="mt-3 text-xs text-gray-500">
                      Thêm 1 ngọc khảm riêng theo từng dòng option bên dưới (HP, Mana, Sát thương…).
                    </p>
                  </div>
                )}

                {loadError && (
                  <p className="mb-4 rounded border border-red-500/50 bg-red-950/30 p-3 text-sm text-red-300">
                    Lỗi tải dữ liệu: {loadError}. Chạy <code className="text-white">npm run parse:custom-option</code>{' '}
                    rồi F5.
                  </p>
                )}

                {!data && !loadError && (
                  <p className="mb-4 text-center text-sm text-gray-400">Đang tải công thức khảm đồng...</p>
                )}

                {data && (
                  <>
                    <div className="mb-6 flex flex-col gap-3 sm:flex-row">
                      <input
                        type="search"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Tìm tên option, ngọc..."
                        className="flex-1 rounded border border-white/30 bg-black px-3 py-2.5 text-sm text-white placeholder-gray-500 focus:border-[#F39C12] focus:outline-none"
                      />
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="rounded border border-white/30 bg-black px-3 py-2.5 text-sm text-white focus:border-[#F39C12] focus:outline-none sm:min-w-[180px]"
                      >
                        <option value="all">Tất cả loại</option>
                        {categories.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>

                    <p className="mb-4 text-xs text-gray-500">
                      Hiển thị {filtered.length} / {recipes.length} công thức
                    </p>

                    {filtered.length === 0 ? (
                      <p className="rounded-lg border border-white/20 py-8 text-center text-gray-400">
                        Không tìm thấy công thức phù hợp.
                      </p>
                    ) : (
                      <div className="space-y-8">
                        {grouped.map(([cat, items]) => (
                          <div key={cat}>
                            <h2 className="mb-3 border-b border-white/20 pb-2 text-lg font-bold text-[#F39C12]">
                              {cat} ({items.length})
                            </h2>
                            <div className="space-y-2">
                              {items.map((recipe) => (
                                <RecipeCard
                                  key={recipe.mixIndex}
                                  recipe={recipe}
                                  isOpen={expanded === recipe.mixIndex}
                                  onToggle={() =>
                                    setExpanded((prev) => (prev === recipe.mixIndex ? null : recipe.mixIndex))
                                  }
                                />
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}

                <div className="mt-8 text-center">
                  <Link href="/news" className="text-sm font-medium text-[#F39C12] hover:underline">
                    ← Quay lại bản tin
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
