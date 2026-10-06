"use client";

import { Bike } from "lucide-react";
import { useState } from "react";

type Props = {
  src?: string;
  brand: string;
  model: string;
  className?: string;
};

export default function NewBikeGuideImage({ src, brand, model, className = "" }: Props) {
  const [failed, setFailed] = useState(!src);

  if (failed || !src) {
    return <div className={`flex items-end justify-between bg-gradient-to-br from-slate-950 via-slate-800 to-orange-950 p-6 ${className}`} role="img" aria-label={`${brand} ${model} model guide`}>
      <div><p className="text-sm font-bold uppercase tracking-wider text-orange-300">New bike guide</p><p className="mt-2 text-2xl font-black leading-tight text-white">{brand}<br />{model}</p></div>
      <Bike className="h-16 w-16 shrink-0 text-orange-400/80" strokeWidth={1.5} />
    </div>;
  }

  return <img src={src} alt={`${brand} ${model}`} onError={() => setFailed(true)} className={`bg-gray-100 object-contain ${className}`} />;
}
