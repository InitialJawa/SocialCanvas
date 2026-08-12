const fs = require('fs');
let code = fs.readFileSync('src/components/PreviewArea.tsx', 'utf8');

const oldStr = `      {/* Action Buttons: Randomize, Snapshot, and Export */}
      <div className="absolute top-4 right-4 z-30 flex items-center gap-2">
        <button
          onClick={onRandomize}
          className="flex items-center gap-1.5 px-3 py-2 bg-[var(--panel-bg)]/90 backdrop-blur-md border border-[var(--panel-border)] hover:border-blue-500/50 hover:bg-[var(--button-hover)] text-[var(--root-fg)] font-semibold text-xs rounded-xl shadow-md transition-all cursor-pointer select-none"
          title="Randomize Content"
        >
          <Shuffle className="w-3.5 h-3.5 text-blue-500" />
          <span className="hidden sm:inline">Randomize</span>
        </button>
        <button
          onClick={handleSnapshot}
          className="flex items-center gap-1.5 px-3 py-2 bg-[var(--panel-bg)]/90 backdrop-blur-md border border-[var(--panel-border)] hover:border-emerald-500/50 hover:bg-[var(--button-hover)] text-[var(--root-fg)] font-semibold text-xs rounded-xl shadow-md transition-all cursor-pointer select-none"
          title="Quick Snapshot for Side-by-Side Comparison"
        >
          <Image className="w-3.5 h-3.5 text-emerald-500" />
          <span className="hidden sm:inline">Snapshot</span>
        </button>
        
        <ExportCard 
          onExport={handleExport} 
          isExporting={isExporting} 
          isPremium={isPremium}
          exportCount={exportCount}
          onUpgradeClick={onUpgradeClick}
        />
      </div>

      {/* Floating Platform Dock */}
      <div className="absolute top-4 left-4 z-20 flex bg-[var(--panel-bg)]/85 backdrop-blur-md border border-[var(--panel-border)] rounded-xl p-1 shadow-lg items-center gap-1">
         {platforms.map((p) => {
           const isActive = state.platform === p.id;
           return (
             <button
               key={p.id}
               onClick={() => onStateChange({ platform: p.id })}
               className={\`relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 \${
                 isActive 
                   ? 'bg-[var(--root-bg)] shadow-sm text-[var(--root-fg)] font-bold' 
                   : 'text-[var(--text-muted)] hover:text-[var(--root-fg)] hover:bg-[var(--button-hover)]/40'
               }\`}
               title={\`Switch to \${p.label}\`}
             >
               <span className={\`w-4.5 h-4.5 flex items-center justify-center transition-transform \${isActive ? 'scale-110' : 'opacity-80'}\`}>
                 {p.icon}
               </span>
               <span className="hidden md:inline text-[11px]">{p.label}</span>
             </button>
           );
         })}
      </div>`;

const newStr = `      {/* Top Floating Controls */}
      <div className="absolute top-4 inset-x-4 z-30 flex flex-col sm:flex-row justify-between items-end sm:items-center gap-3 pointer-events-none">
        {/* Floating Platform Dock */}
        <div className="flex bg-[var(--panel-bg)]/85 backdrop-blur-md border border-[var(--panel-border)] rounded-xl p-1 shadow-lg items-center gap-1 pointer-events-auto shrink-0 max-w-full overflow-x-auto custom-scrollbar self-start">
           {platforms.map((p) => {
             const isActive = state.platform === p.id;
             return (
               <button
                 key={p.id}
                 onClick={() => onStateChange({ platform: p.id })}
                 className={\`relative flex items-center shrink-0 gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 \${
                   isActive 
                     ? 'bg-[var(--root-bg)] shadow-sm text-[var(--root-fg)] font-bold' 
                     : 'text-[var(--text-muted)] hover:text-[var(--root-fg)] hover:bg-[var(--button-hover)]/40'
                 }\`}
                 title={\`Switch to \${p.label}\`}
               >
                 <span className={\`w-4.5 h-4.5 flex items-center justify-center transition-transform \${isActive ? 'scale-110' : 'opacity-80'}\`}>
                   {p.icon}
                 </span>
                 <span className="hidden lg:inline text-[11px]">{p.label}</span>
               </button>
             );
           })}
        </div>
        
        {/* Action Buttons: Randomize, Snapshot, and Export */}
        <div className="flex flex-wrap items-center justify-end gap-2 pointer-events-auto shrink-0 self-end sm:self-auto max-w-full">
          <button
            onClick={onRandomize}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-2 bg-[var(--panel-bg)]/90 backdrop-blur-md border border-[var(--panel-border)] hover:border-blue-500/50 hover:bg-[var(--button-hover)] text-[var(--root-fg)] font-semibold text-xs rounded-xl shadow-md transition-all cursor-pointer select-none"
            title="Randomize Content"
          >
            <Shuffle className="w-3.5 h-3.5 text-blue-500 shrink-0" />
            <span className="hidden sm:inline">Randomize</span>
          </button>
          <button
            onClick={handleSnapshot}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-2 bg-[var(--panel-bg)]/90 backdrop-blur-md border border-[var(--panel-border)] hover:border-emerald-500/50 hover:bg-[var(--button-hover)] text-[var(--root-fg)] font-semibold text-xs rounded-xl shadow-md transition-all cursor-pointer select-none"
            title="Quick Snapshot for Side-by-Side Comparison"
          >
            <Image className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            <span className="hidden sm:inline">Snapshot</span>
          </button>
          
          <ExportCard 
            onExport={handleExport} 
            isExporting={isExporting} 
            isPremium={isPremium}
            exportCount={exportCount}
            onUpgradeClick={onUpgradeClick}
          />
        </div>
      </div>`;

if (code.includes(oldStr)) {
  fs.writeFileSync('src/components/PreviewArea.tsx', code.replace(oldStr, newStr));
  console.log("Successfully replaced.");
} else {
  console.log("Could not find the string to replace.");
}
