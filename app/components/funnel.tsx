import React from "react";
import { cn } from "~/libs/utils";

const funnelContext = React.createContext({load: 0, segments: 0});

export function useFunnel() {
  const context = React.useContext(funnelContext);

  if (!context) {
    throw new Error('useFunnel must be used within a Funnel');
  }

  return context;
}


export function Funnel ({load, segments, children}: {load: number, segments: number, children: React.ReactNode}) {
  return (
    <funnelContext.Provider value={{load, segments}}>
      <div className="flex flex-col md:flex-row gap-1 items-center justify-stretch w-full"> 
      {children}
      </div>
    </funnelContext.Provider>
  );
}

type FunnelSegmentProps = {
  name: string;
  value: number;
  className?: string;
};

export function FunnelSegment({name, value, className}: FunnelSegmentProps) {
  const {load} = useFunnel();

  const percentage = (value / load) * 100;
  const minHeight = 1;
  const maxHeight = 5;
  const size = percentage * (maxHeight - minHeight) + minHeight;
  
  const derivedClasses = cn(
    className,
    'dark:bg-slate-700 dark:text-white bg-slate-100 p-4  text-slate-600 text-sm flex flex-col items-center justify-center capitalize rounded-lg flex-1',
  );

  return (
      <div className={derivedClasses} style={{height: `${size}px`}}>
      <p className="text-xs text-wrap">{name}</p>
      <span className="font-bold text-lg">{value}</span>
    </div>
    
  );
}