import React from "react";
function HomeVideo(){
  // Replace VIDEO_ID with your latest YouTube video ID
  const VIDEO_ID = "o-58ZaFNTjo";

  return (
    <section className="py-20 bg-[#fcfbf8] dark:bg-zinc-950">
      <div className="max-w-5xl mx-auto px-4">
        <h2 className="text-3xl font-display font-bold text-center mb-8">Latest Opening</h2>
        <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl border-4 border-zinc-900">
          <iframe loading="lazy" title="RJS Collectibles latest opening"
            className="absolute inset-0 w-full h-full"
            src={`https://www.youtube.com/embed/${VIDEO_ID}?autoplay=1&mute=1&loop=1&playlist=${VIDEO_ID}&controls=0&modestbranding=1`}
            allow="autoplay; encrypted-media"
            allowFullScreen
          />
          <div className="absolute inset-0 ring-1 ring-inset ring-red-500/20 pointer-events-none"/>
        </div>
      </div>
    </section>
  );
}

export default React.memo(HomeVideo);
