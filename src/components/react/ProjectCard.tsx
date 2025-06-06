import { HiOutlineLightBulb, HiOutlineExclamationCircle, HiOutlineChartBar, HiOutlineDocumentText } from 'react-icons/hi';

type Project = {
  index: number;
  title: string;
  description: string;
  github: string;
  live?: string;
  active: boolean;
  problem?: string;
  notableNumbers?: string;
  uniqueInsight?: string;
  shortSummary?: string;
};

export default function ProjectCard({
  title,
  description,
  live,
  github,
  active,
  problem,
  notableNumbers,
  uniqueInsight,
  shortSummary,
}: Project) {
  return (
    <div className="min-w-[220px] max-w-[320px] flex flex-col px-5 py-4 border border-gray-200 dark:border-gray-700/70 rounded-xl bg-white/80 dark:bg-gray-800/80 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:border-gray-700 shadow-md dark:shadow-[0_0_8px_rgba(0,0,0,0.8)] transition-all duration-150 relative">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold text-lg md:text-xl text-gray-900 dark:text-white flex items-center gap-2">
          {title}
          <span
            className={`w-2.5 h-2.5 rounded-full ml-1 ${active ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'}`}
            title={active ? 'Active' : 'Inactive'}
          ></span>
        </h3>
        <a
          target="_blank"
          rel="noopener noreferrer"
          title={live ? 'Live' : github ? 'Github' : 'Coming soon!'}
          href={live ? live : github ? github : '#'}
          className="opacity-60 hover:opacity-100 hover:scale-110 transition-transform"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" viewBox="0 0 256 256">
            <rect width="256" height="256" fill="none"></rect>
            <polyline points="216 100 216 40 156 40" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"></polyline>
            <line x1="144" y1="112" x2="216" y2="40" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"></line>
            <path d="M184,144v64a8,8,0,0,1-8,8H48a8,8,0,0,1-8-8V80a8,8,0,0,1,8-8h64" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"></path>
          </svg>
        </a>
      </div>
      <p className="text-base text-gray-700 dark:text-gray-200 mb-2 min-h-[36px]">{description}</p>
      <div className="flex flex-col gap-2 mt-2">
        <div className="flex items-start gap-2 min-h-[28px]">
          <HiOutlineDocumentText className="mt-0.5 text-gray-500 dark:text-gray-300" size={22} />
          <span className="text-sm md:text-base text-gray-700 dark:text-gray-200">
            {shortSummary || <span className="opacity-50">No summary provided.</span>}
          </span>
        </div>
        <div className="flex items-start gap-2 min-h-[28px]">
          <HiOutlineExclamationCircle className="mt-0.5 text-gray-500 dark:text-gray-300" size={22} />
          <span className="text-sm md:text-base text-gray-700 dark:text-gray-200">
            {problem || <span className="opacity-50">No problem specified.</span>}
          </span>
        </div>
        <div className="flex items-start gap-2 min-h-[28px]">
          <HiOutlineChartBar className="mt-0.5 text-gray-500 dark:text-gray-300" size={22} />
          <span className="text-sm md:text-base text-gray-700 dark:text-gray-200">
            {notableNumbers || <span className="opacity-50">No notable numbers.</span>}
          </span>
        </div>
        <div className="flex items-start gap-2 min-h-[28px]">
          <HiOutlineLightBulb className="mt-0.5 text-gray-500 dark:text-gray-300" size={22} />
          <span className="text-sm md:text-base text-gray-700 dark:text-gray-200">
            {uniqueInsight || <span className="opacity-50">No unique insight.</span>}
          </span>
        </div>
      </div>
    </div>
  );
}
