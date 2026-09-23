import React, { useState, useEffect } from 'react';
import { Search, Filter, PackageX, ShoppingBag } from 'lucide-react';
import { api } from '../../services/api';
import { EquipmentCard } from '../../components/equipment/EquipmentCard';
import { useAuth } from '../../context/AuthContext';

export const Marketplace = () => {
  const { navigateTo } = useAuth();
  const [equipmentList, setEquipmentList] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  const categories = ['All', 'Power Tools', 'Heavy Machinery', 'Audio/Visual'];

  const fetchEquipment = async () => {
    setLoading(true);
    // MARKETPLACE CONSTRAINT: onlyAvailable = true
    const items = await api.getEquipmentList({
      search,
      category: selectedCategory,
      onlyAvailable: true,
    });
    setEquipmentList(items);
    setLoading(false);
  };

  useEffect(() => {
    fetchEquipment();
    const unsubscribe = api.subscribe(fetchEquipment);
    return () => unsubscribe();
  }, [search, selectedCategory]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 pb-20 md:pb-10">
      
      {/* Header Banner */}
      <div className="bg-[#F7F7F8] border border-[#E5E5E5] rounded-md p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1A1A1A]">Equipment Marketplace</h1>
          <p className="text-sm text-[#6B7280] mt-1">
            Browse verified available tools and heavy machinery for rent. Instant availability check & transparent daily rates.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 bg-white border border-[#E5E5E5] rounded-md text-green-700 shrink-0">
          <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse" />
          Live Available Catalog
        </div>
      </div>

      {/* Search & Category Filter Controls */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Keyword Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name, category, or description (e.g. drill, generator, camera)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-sm bg-white border border-[#E5E5E5] rounded-md focus:outline-none focus:border-gray-900 placeholder:text-gray-400"
            />
          </div>
        </div>

        {/* Category Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-xs font-semibold text-[#6B7280] shrink-0 flex items-center gap-1 mr-1">
            <Filter className="w-3.5 h-3.5" /> Category:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md border shrink-0 transition-colors ${
                selectedCategory === cat
                  ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]'
                  : 'bg-white text-[#6B7280] border-[#E5E5E5] hover:border-gray-400 hover:text-[#1A1A1A]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Equipment Grid (1 col mobile -> 2 tablet -> 3-4 desktop) */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-80 bg-[#F7F7F8] border border-[#E5E5E5] rounded-md animate-pulse p-4" />
          ))}
        </div>
      ) : equipmentList.length === 0 ? (
        <div className="bg-[#F7F7F8] border border-[#E5E5E5] rounded-md p-12 text-center flex flex-col items-center justify-center">
          <div className="p-4 bg-white border border-[#E5E5E5] rounded-full text-gray-400 mb-3">
            <PackageX className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-[#1A1A1A]">No available equipment found</h3>
          <p className="text-xs text-[#6B7280] max-w-sm mt-1 mb-4">
            No equipment with status AVAILABLE matches your current search or category filter. Try clearing filters.
          </p>
          <button
            onClick={() => {
              setSearch('');
              setSelectedCategory('All');
            }}
            className="px-4 py-2 text-xs font-semibold text-[#1A1A1A] bg-white border border-[#E5E5E5] rounded-md hover:bg-gray-100"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {equipmentList.map((item) => (
            <EquipmentCard
              key={item.id}
              equipment={item}
              onSelect={(eq) => navigateTo('equipment_details', { equipmentId: eq.id })}
            />
          ))}
        </div>
      )}
    </div>
  );
};
