import React, { useState } from 'react';
import {
  Sparkles,
  ShoppingBag,
  Package,
  Check,
  Lock,
  Coins,
  Palette,
  ShieldAlert,
} from 'lucide-react';
import {
  CaseRewardBox,
  CharacterAppearance,
  CosmeticCategory,
  CosmeticItem,
  UserProfile,
} from '../../types';
import { CharacterAvatar } from './CharacterAvatar';
import { CaseOpeningModal } from './CaseOpeningModal';
import { formatCoins, RARITY_CONFIG } from '../../utils/progression';

interface CharacterScreenProps {
  user: UserProfile;
  cosmetics: CosmeticItem[];
  cases: CaseRewardBox[];
  onUpdateCharacter: (newAppearance: Partial<CharacterAppearance>) => void;
  onBuyItem: (item: CosmeticItem) => void;
  onOpenCaseResult: (caseBox: CaseRewardBox, wonItem: CosmeticItem) => void;
}

export const CharacterScreen: React.FC<CharacterScreenProps> = ({
  user,
  cosmetics,
  cases,
  onUpdateCharacter,
  onBuyItem,
  onOpenCaseResult,
}) => {
  const [activeTab, setActiveTab] = useState<'wardrobe' | 'shop' | 'cases' | 'inventory'>('wardrobe');
  const [customCategory, setCustomCategory] = useState<CosmeticCategory | 'skin' | 'hairColor'>('hair');
  const [shopCategoryFilter, setShopCategoryFilter] = useState<string>('all');
  const [selectedCase, setSelectedCase] = useState<CaseRewardBox | null>(null);

  // Palettes for skin tone and hair color
  const skinTones = [
    { label: 'Fair Light', hex: '#ffd1aa' },
    { label: 'Peach Warm', hex: '#fcd3b0' },
    { label: 'Warm Honey', hex: '#e0a96d' },
    { label: 'Caramel Bronze', hex: '#a37251' },
    { label: 'Deep Espresso', hex: '#5c3826' },
  ];

  const hairColors = [
    { label: 'Jet Midnight', hex: '#0f172a' },
    { label: 'Chestnut Brown', hex: '#451a03' },
    { label: 'Copper Auburn', hex: '#b45309' },
    { label: 'Silver Ash', hex: '#94a3b8' },
    { label: 'Electric Cyan', hex: '#06b6d4' },
    { label: 'Neon Violet', hex: '#9333ea' },
    { label: 'Platinum Blonde', hex: '#fef08a' },
  ];

  // Helper to check if item is owned
  const isOwned = (itemId: string) => user.ownedItemIds.includes(itemId);

  return (
    <div className="space-y-4 pb-24 px-4 pt-3 max-w-lg mx-auto">
      {/* Subnavigation Tabs */}
      <div className="flex bg-[#0b1329] p-1 rounded-2xl border border-blue-900/40">
        <button
          onClick={() => setActiveTab('wardrobe')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'wardrobe'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Wardrobe
        </button>

        <button
          onClick={() => setActiveTab('shop')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'shop'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Shop
        </button>

        <button
          onClick={() => setActiveTab('cases')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'cases'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Cases
        </button>

        <button
          onClick={() => setActiveTab('inventory')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'inventory'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Inventory
        </button>
      </div>

      {/* 1. WARDROBE / CUSTOMIZATION TAB */}
      {activeTab === 'wardrobe' && (
        <div className="space-y-4">
          {/* Character Live Preview Stage */}
          <div className="relative rounded-3xl bg-gradient-to-b from-[#0f1d40] to-[#0a1226] border border-blue-500/30 p-6 flex flex-col items-center justify-center shadow-xl shadow-blue-950/40 overflow-hidden">
            <div className="absolute top-3 left-4 flex items-center gap-1 text-[11px] font-bold text-cyan-400 bg-blue-950/80 px-2.5 py-1 rounded-full border border-blue-800/50">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Live Avatar Stage</span>
            </div>

            <div className="absolute top-3 right-4 text-xs font-bold text-amber-300 flex items-center gap-1 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
              <Coins className="w-3.5 h-3.5 text-amber-400" />
              <span>{formatCoins(user.irlCoins)}</span>
            </div>

            {/* Avatar visualizer */}
            <div className="my-2">
              <CharacterAvatar character={user.character} size="xl" animate={true} />
            </div>

            <div className="text-center mt-1">
              <span className="text-sm font-extrabold text-white">{user.username}</span>
              <span className="text-xs text-slate-400 block font-mono">
                Level {user.level} {user.title}
              </span>
            </div>
          </div>

          {/* Customization Category Pills */}
          <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {[
              { id: 'hair', label: 'Hair' },
              { id: 'hairColor', label: 'Hair Dye' },
              { id: 'skin', label: 'Skin Tone' },
              { id: 'top', label: 'Top' },
              { id: 'pants', label: 'Pants' },
              { id: 'shoes', label: 'Shoes' },
              { id: 'accessory', label: 'Accessory' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCustomCategory(cat.id as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  customCategory === cat.id
                    ? 'bg-blue-600/40 border border-cyan-400 text-cyan-300'
                    : 'bg-[#0b1329] border border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Option Pickers for Selected Category */}
          <div className="bg-[#0b1329] border border-blue-900/40 rounded-3xl p-4">
            {/* Skin Tone Palette */}
            {customCategory === 'skin' && (
              <div>
                <h4 className="text-xs font-bold text-slate-300 mb-2">Select Skin Tone</h4>
                <div className="grid grid-cols-5 gap-2">
                  {skinTones.map((tone) => (
                    <button
                      key={tone.hex}
                      onClick={() => onUpdateCharacter({ skinTone: tone.hex })}
                      className={`h-12 rounded-xl flex items-center justify-center border-2 transition-all cursor-pointer ${
                        user.character.skinTone === tone.hex
                          ? 'border-cyan-400 scale-105 shadow-md shadow-blue-500/30'
                          : 'border-transparent hover:scale-100'
                      }`}
                      style={{ backgroundColor: tone.hex }}
                    >
                      {user.character.skinTone === tone.hex && (
                        <Check className="w-5 h-5 text-slate-900 stroke-[3]" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Hair Color Palette */}
            {customCategory === 'hairColor' && (
              <div>
                <h4 className="text-xs font-bold text-slate-300 mb-2">Select Hair Color</h4>
                <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                  {hairColors.map((col) => (
                    <button
                      key={col.hex}
                      onClick={() => onUpdateCharacter({ hairColor: col.hex })}
                      className={`h-10 rounded-xl flex items-center justify-center border-2 transition-all cursor-pointer ${
                        user.character.hairColor === col.hex
                          ? 'border-cyan-400 scale-105 shadow-md'
                          : 'border-transparent'
                      }`}
                      style={{ backgroundColor: col.hex }}
                      title={col.label}
                    >
                      {user.character.hairColor === col.hex && (
                        <Check className="w-4 h-4 text-white drop-shadow stroke-[3]" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Cosmetic Items Pickers */}
            {['hair', 'top', 'pants', 'shoes', 'accessory'].includes(customCategory) && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-bold text-slate-300 capitalize">
                    Available {customCategory} Styles
                  </h4>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {cosmetics
                    .filter((item) => item.category === customCategory)
                    .map((item) => {
                      const owned = isOwned(item.id);
                      const rarity = RARITY_CONFIG[item.rarity];
                      const isEquipped =
                        (customCategory === 'hair' && user.character.hairStyle === item.svgVariant) ||
                        (customCategory === 'top' && user.character.topStyle === item.svgVariant) ||
                        (customCategory === 'pants' && user.character.pantsStyle === item.svgVariant) ||
                        (customCategory === 'shoes' && user.character.shoesStyle === item.svgVariant) ||
                        (customCategory === 'accessory' && user.character.accessoryStyle === item.svgVariant);

                      return (
                        <div
                          key={item.id}
                          className={`p-3 rounded-2xl border transition-all text-left flex flex-col justify-between ${
                            isEquipped
                              ? 'bg-blue-950/70 border-cyan-400 shadow-md shadow-blue-500/20'
                              : owned
                              ? 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                              : 'bg-slate-950/60 border-slate-900 opacity-80'
                          }`}
                        >
                          <div>
                            <div className="flex items-center justify-between gap-1 mb-1">
                              <span
                                className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${rarity.badgeBg} ${rarity.textColor}`}
                              >
                                {rarity.name}
                              </span>
                              {isEquipped ? (
                                <span className="text-[10px] font-bold text-cyan-400 flex items-center gap-0.5">
                                  <Check className="w-3 h-3" /> Equipped
                                </span>
                              ) : !owned ? (
                                <span className="text-[10px] font-semibold text-slate-500 flex items-center gap-0.5">
                                  <Lock className="w-3 h-3" />
                                </span>
                              ) : null}
                            </div>

                            <div className="font-bold text-xs text-white truncate">
                              {item.name}
                            </div>
                            <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">
                              {item.description}
                            </p>
                          </div>

                          <div className="mt-2 pt-2 border-t border-slate-800/60 flex items-center justify-between">
                            {owned ? (
                              <button
                                onClick={() => {
                                  if (customCategory === 'hair') onUpdateCharacter({ hairStyle: item.svgVariant });
                                  if (customCategory === 'top') onUpdateCharacter({ topStyle: item.svgVariant });
                                  if (customCategory === 'pants') onUpdateCharacter({ pantsStyle: item.svgVariant });
                                  if (customCategory === 'shoes') onUpdateCharacter({ shoesStyle: item.svgVariant });
                                  if (customCategory === 'accessory') {
                                    onUpdateCharacter({
                                      accessoryStyle: isEquipped ? 'none' : item.svgVariant,
                                    });
                                  }
                                }}
                                className={`w-full py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                                  isEquipped
                                    ? 'bg-blue-600/30 text-cyan-300'
                                    : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                                }`}
                              >
                                {isEquipped ? 'Equipped' : 'Equip'}
                              </button>
                            ) : (
                              <button
                                onClick={() => onBuyItem(item)}
                                disabled={user.irlCoins < item.price}
                                className="w-full py-1.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 disabled:opacity-40 text-slate-950 font-bold text-xs flex items-center justify-center gap-1 transition-all cursor-pointer"
                              >
                                <Coins className="w-3 h-3" />
                                <span>{item.price} Coins</span>
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 2. COSMETIC SHOP TAB */}
      {activeTab === 'shop' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <div>
              <h3 className="text-sm font-bold text-white font-display">Cosmetic Shop</h3>
              <p className="text-[11px] text-slate-400">
                Purchase visual gear using your earned IRL Coins.
              </p>
            </div>
            <div className="flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/30 px-3 py-1 rounded-xl text-amber-300 font-bold text-xs">
              <Coins className="w-4 h-4 text-amber-400" />
              <span>{formatCoins(user.irlCoins)} Coins</span>
            </div>
          </div>

          {/* Category filter pills */}
          <div className="flex gap-1 overflow-x-auto pb-1 no-scrollbar">
            {['all', 'hair', 'top', 'pants', 'shoes', 'accessory'].map((cat) => (
              <button
                key={cat}
                onClick={() => setShopCategoryFilter(cat)}
                className={`px-3 py-1 rounded-xl text-xs font-semibold capitalize whitespace-nowrap cursor-pointer transition-all ${
                  shopCategoryFilter === cat
                    ? 'bg-blue-600 text-white font-bold'
                    : 'bg-[#0b1329] text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Shop Item Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {cosmetics
              .filter(
                (item) =>
                  shopCategoryFilter === 'all' || item.category === shopCategoryFilter
              )
              .map((item) => {
                const owned = isOwned(item.id);
                const rarity = RARITY_CONFIG[item.rarity];

                return (
                  <div
                    key={item.id}
                    className={`bg-[#0b1329] border rounded-2xl p-3.5 flex flex-col justify-between transition-all ${
                      owned
                        ? 'border-blue-900/30 opacity-75'
                        : 'border-blue-900/50 hover:border-blue-500/50 shadow-sm'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-1 mb-1.5">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${rarity.badgeBg} ${rarity.textColor}`}
                        >
                          {rarity.name}
                        </span>
                        <span className="text-[10px] text-slate-500 uppercase">
                          {item.category}
                        </span>
                      </div>

                      <h4 className="font-bold text-sm text-white">{item.name}</h4>
                      <p className="text-xs text-slate-400 mt-0.5">{item.description}</p>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-slate-800/70 flex items-center justify-between">
                      <div className="flex items-center gap-1 text-xs font-bold text-amber-300">
                        <Coins className="w-3.5 h-3.5 text-amber-400" />
                        <span>{item.price === 0 ? 'Starter' : `${item.price} Coins`}</span>
                      </div>

                      {owned ? (
                        <span className="text-xs font-bold text-cyan-400 flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" /> Owned
                        </span>
                      ) : (
                        <button
                          onClick={() => onBuyItem(item)}
                          disabled={user.irlCoins < item.price}
                          className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white font-bold text-xs flex items-center gap-1 shadow-sm transition-all cursor-pointer"
                        >
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>Buy</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* 3. REWARD CASES TAB */}
      {activeTab === 'cases' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <div>
              <h3 className="text-sm font-bold text-white font-display">Mystery Loot Crates</h3>
              <p className="text-[11px] text-slate-400">
                Unlock cosmetics from curated reward pools with virtual coins.
              </p>
            </div>
            <div className="flex items-center gap-1 text-xs font-bold text-amber-300 bg-amber-500/10 px-2.5 py-1 rounded-xl border border-amber-500/20">
              <Coins className="w-3.5 h-3.5 text-amber-400" />
              <span>{formatCoins(user.irlCoins)}</span>
            </div>
          </div>

          <div className="space-y-3">
            {cases.map((box) => (
              <div
                key={box.id}
                className="bg-[#0b1329] border border-blue-900/50 hover:border-blue-500/40 rounded-3xl p-4 transition-all shadow-md"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-950 to-indigo-950 border border-blue-700/40 flex items-center justify-center shrink-0">
                    <Package className="w-7 h-7" style={{ color: box.accentColor }} />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-extrabold text-sm text-white font-display">
                        {box.name}
                      </h4>
                      <span className="text-xs font-bold text-amber-300 flex items-center gap-1">
                        <Coins className="w-3.5 h-3.5 text-amber-400" />
                        {box.price} Coins
                      </span>
                    </div>

                    <p className="text-xs text-slate-400 mt-1">{box.description}</p>

                    <div className="flex items-center gap-1.5 mt-2">
                      <span className="text-[10px] text-slate-500">Pool:</span>
                      {box.items.map((it) => {
                        const r = RARITY_CONFIG[it.rarity];
                        return (
                          <span
                            key={it.itemId}
                            className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${r.badgeBg} ${r.textColor}`}
                          >
                            {r.name}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">
                    {box.items.length} items possible
                  </span>

                  <button
                    onClick={() => setSelectedCase(box)}
                    className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-xs shadow-md shadow-blue-500/20 active:scale-95 transition-all cursor-pointer"
                  >
                    Inspect &amp; Open
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. INVENTORY TAB */}
      {activeTab === 'inventory' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <div>
              <h3 className="text-sm font-bold text-white font-display">Owned Cosmetics</h3>
              <p className="text-[11px] text-slate-400">
                You own {user.ownedItemIds.length} unique character cosmetics.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {cosmetics
              .filter((item) => user.ownedItemIds.includes(item.id))
              .map((item) => {
                const rarity = RARITY_CONFIG[item.rarity];
                const isEquipped =
                  (item.category === 'hair' && user.character.hairStyle === item.svgVariant) ||
                  (item.category === 'top' && user.character.topStyle === item.svgVariant) ||
                  (item.category === 'pants' && user.character.pantsStyle === item.svgVariant) ||
                  (item.category === 'shoes' && user.character.shoesStyle === item.svgVariant) ||
                  (item.category === 'accessory' && user.character.accessoryStyle === item.svgVariant);

                return (
                  <div
                    key={item.id}
                    className={`p-3 rounded-2xl border transition-all text-left flex flex-col justify-between ${
                      isEquipped
                        ? 'bg-blue-950/80 border-cyan-400 shadow-md shadow-blue-500/20'
                        : 'bg-[#0b1329] border-blue-900/40'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${rarity.badgeBg} ${rarity.textColor}`}
                        >
                          {rarity.name}
                        </span>
                        <span className="text-[10px] text-slate-500 uppercase">{item.category}</span>
                      </div>
                      <h4 className="font-bold text-xs text-white truncate">{item.name}</h4>
                      <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">
                        {item.description}
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        if (item.category === 'hair') onUpdateCharacter({ hairStyle: item.svgVariant });
                        if (item.category === 'top') onUpdateCharacter({ topStyle: item.svgVariant });
                        if (item.category === 'pants') onUpdateCharacter({ pantsStyle: item.svgVariant });
                        if (item.category === 'shoes') onUpdateCharacter({ shoesStyle: item.svgVariant });
                        if (item.category === 'accessory') {
                          onUpdateCharacter({
                            accessoryStyle: isEquipped ? 'none' : item.svgVariant,
                          });
                        }
                      }}
                      className={`w-full mt-2 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        isEquipped
                          ? 'bg-cyan-500 text-slate-950'
                          : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                      }`}
                    >
                      {isEquipped ? 'Equipped' : 'Equip'}
                    </button>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* Case Opening Modal */}
      {selectedCase && (
        <CaseOpeningModal
          isOpen={!!selectedCase}
          caseBox={selectedCase}
          allItems={cosmetics}
          userCoins={user.irlCoins}
          onOpenCase={(box, won) => {
            onOpenCaseResult(box, won);
          }}
          onClose={() => setSelectedCase(null)}
        />
      )}
    </div>
  );
};
