import React from 'react';
import { ExternalLink, Monitor } from 'lucide-react';
import { SBX_DARK, SBX_PALE_BORDER } from '../sandboxData';

/* The full workshop interface, built as a standalone page in public/sandbox-demo
   (served as-is by Vite). Embedded here on larger screens; on a phone it is too
   cramped, so it opens on its own instead. */
const DEMO_SRC = '/sandbox-demo/index.html';

export const SandboxDemo: React.FC = () => (
  <div>
    <div className="hidden md:block rounded-2xl overflow-hidden bg-white" style={{ border: '1px solid #E2E8F0' }}>
      <iframe
        src={`${DEMO_SRC}?embed`}
        title="OXYGY Innovation Sandbox demo"
        loading="lazy"
        className="block w-full h-[780px] border-0"
      />
    </div>

    <div className="md:hidden rounded-2xl p-6 text-center" style={{ backgroundColor: '#F7FAFC', border: '1px solid #E2E8F0' }}>
      <span className="w-11 h-11 rounded-xl inline-flex items-center justify-center mb-3" style={{ backgroundColor: '#EAF0F8', border: `1px solid ${SBX_PALE_BORDER}` }}>
        <Monitor size={20} style={{ color: SBX_DARK }} />
      </span>
      <p className="text-[15px] font-bold text-[#1A202C] mb-1">Best on a laptop</p>
      <p className="text-[13.5px] text-[#718096] leading-[1.6] mb-5">The sandbox is a full workshop screen, so it needs a bit of room.</p>
      <a
        href={DEMO_SRC}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 text-white font-semibold rounded-full px-6 py-3 text-[14px]"
        style={{ backgroundColor: SBX_DARK }}
      >
        Open the demo <ExternalLink size={15} />
      </a>
    </div>

    <div className="hidden md:flex items-center justify-between gap-4 mt-3 px-1">
      <p className="text-[12.5px] text-[#A0AEC0]">Sample company and data. Nothing you type leaves this page.</p>
      <a
        href={DEMO_SRC}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 text-[13px] font-semibold transition-colors hover:text-[#1A202C]"
        style={{ color: SBX_DARK }}
      >
        Open full screen <ExternalLink size={14} />
      </a>
    </div>
  </div>
);
