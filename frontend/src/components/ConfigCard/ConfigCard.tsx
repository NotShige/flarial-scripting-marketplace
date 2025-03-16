'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import { Config } from '@/types/config';
import { getConfigDownloadResponse } from '@/services/configs';

interface ConfigCardProps {
  config: Config;
}

export function ConfigCard({ config }: ConfigCardProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        buttonRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDownload = async () => {
    try {
      const response = await getConfigDownloadResponse(config.id);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${config.name}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      setIsDropdownOpen(false);
    } catch (error) {
      console.error('Error downloading config:', error);
    }
  };

  return (
    <div className="group relative p-4 rounded-lg bg-[#201a1b]/80 backdrop-blur-md transition-all hover:scale-[1.05] hover:z-10 shadow-md">
      {/* Config Image */}
      <div className="relative w-full h-40 bg-gray-800 flex items-center justify-center rounded-lg overflow-hidden">
        <Image src={config.imageUrl} alt="Config Image" layout="fill" objectFit="cover" />
      </div>
      
      {/* Config Info */}
      <div className="flex justify-between mt-3">
        <div className="p-2 bg-black/20 rounded-md text-gray-300 text-sm">
          <p>Author: {config.author}</p>
          <p>Name: {config.name}</p>
          <p>Uploaded: {new Date(config.createdAt).toLocaleDateString()}</p>
        </div>
        
        {/* Download Button & Dropdown */}
        <div className="flex flex-col gap-2">
  {/* Download Button & Dropdown */}
  <div className="relative inline-flex">
    <button
      onClick={handleDownload}
      className="flex items-center gap-2 bg-[#3a2f30] text-white px-4 py-2 text-sm hover:bg-[#4C3F40] transition-all duration-200 rounded-l font-medium"
    >
      <FontAwesomeIcon icon={faDownload} className="text-white" />
      Download
    </button>
    <button
      ref={buttonRef}
      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
      className="px-3 py-2 bg-[#3a2f30] text-white hover:bg-[#4C3F40] transition-all duration-200 rounded-r"
    >
      ▼
    </button>
    {isDropdownOpen && (
      <div
        ref={dropdownRef}
        className="absolute right-0 mt-1 top-full w-40 rounded-md bg-[#1a1a1a] shadow-xl border border-black/20 overflow-hidden"
      >
        <button
          onClick={handleDownload}
          className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-black/10"
        >
          Download ZIP
        </button>
      </div>
    )}
  </div>

  {/* Import to Minecraft Button */}
  <button
    onClick={() => window.location.href = `minecraft://flarial-configs?configName=${config.name}`}
    className="flex items-center gap-2 bg-[#3a2f30] text-white px-4 py-2 text-sm hover:bg-[#4C3F40] transition-all duration-200 rounded-md font-medium"
    aria-label="Import config to Minecraft"
    title="Import directly into Minecraft"
  >
    <FontAwesomeIcon icon={faDownload} className="text-white" />
    Import
  </button>
</div>
        </div>
      </div>
  );
}
// Compare this snippet from ConfigCard.tsx: