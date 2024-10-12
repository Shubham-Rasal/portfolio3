type Project = {
  index: number;
  title: string;
  description: string;
  github: string;
  live?: string;
  active: boolean;
};

export default function ProjectCard({
  title,
  description,
  live,
  github,
  active,
}: Project) {
  return (
    <div className="min-w-[120px] flex-col px-4 py-2 border border-gray-200 dark:border-gray-700/70 rounded-lg hover:bg-gray-100 dark:bg-gray-800/70 dark:hover:bg-gray-800 dark:hover:border-gray-700 dark:shadow-[0_0_8px_rgba(0,0,0,0.8)] shadow-[0_0_8px_rgba(0,0,0,0.06)] flex relative ">
      <a
        target="_blank"
        title={live ? "Live" : github ? "Github" : "Coming soon!"}
        href={live ? live : github ? github : "#"}
      >
        <div className="absolute top-[10%] right-[10%] z-10 opacity-50 hover:opacity-100 hover:scale-[1.1] duration-100">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1em"
            height="1em"
            fill="currentColor"
            viewBox="0 0 256 256"
            className="text-base"
          >
            <rect width="256" height="256" fill="none"></rect>
            <polyline
              points="216 100 216 40 156 40"
              fill="none"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="16"
            ></polyline>
            <line
              x1="144"
              y1="112"
              x2="216"
              y2="40"
              fill="none"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="16"
            ></line>
            <path
              d="M184,144v64a8,8,0,0,1-8,8H48a8,8,0,0,1-8-8V80a8,8,0,0,1,8-8h64"
              fill="none"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="16"
            ></path>
          </svg>
        </div>
      </a>
      <a href={live ? live : github ? github : "#"} target="_blank">
        {/* <div className="py-3 relative">
          <img
            className="w-[40px] drop-shadow-xl"
            src="/code.svg"
            alt="Maazi"
          />
        </div> */}
        <div className="pb-1">
          <div className="flex items-center gap-[6px] mt-1">
            <h3 className="font-medium text-base">{title}</h3>
            <div
              className={`w-[8px] h-[8px] rounded-full  ${
                active ? "bg-green-500 animate-pulse" : "bg-yellow-500"
              }`}
              title={active ? "Active" : "Inactive"}
            ></div>
          </div>
          <p className="text-sm opacity-80 ">{description}</p>
        </div>
      </a>
    </div>
  );
}
