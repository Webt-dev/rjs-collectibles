import React from "react";
import { Play } from "lucide-react";

/**
 * ✅ ONLY change this URL when you want a new video.
 * Use a standard YouTube URL — short or long form both work.
 */
const YOUTUBE_VIDEO_URL = "https://www.youtube.com/watch?v=o-58ZaFNTjo";
const WATCH_CHANNEL_URL = "https://youtube.com/@rjscollectibles";

function extractYouTubeId(url) {
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtu.be")) {
      return u.pathname.replace("/", "");
    }
    if (u.searchParams.get("v")) {
      return u.searchParams.get("v");
    }
    const parts = u.pathname.split("/");
    return parts[parts.length - 1] || "";
  } catch {
    return "";
  }
}

export default function HomeVideo() {
  const videoId = extractYouTubeId(YOUTUBE_VIDEO_URL);

  const embedUrl = videoId
    ? `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${videoId}&modestbranding=1&playsinline=1&rel=0&showinfo=0&iv_load_policy=3&disablekb=1&fs=0&cc_load_policy=0`
    : "";

  return (
    <section className="relative w-full overflow-hidden bg-[#5f1111]">
      <div className="relative min-h-[460px] flex items-center justify-center overflow-hidden">
        {embedUrl && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
              style={{
                width: "max(100vw, calc(100vh * (16 / 9)))",
                height: "max(56.25vw, 100vh)",
              }}
            >
              <iframe
                src={embedUrl}
                title="RJS Collectibles live background"
                frameBorder="0"
                allow="autoplay; encrypted-media; picture-in-picture"
                allowFullScreen
                className="w-full h-full pointer-events-none"
                style={{ border: 0 }}
              />
            </div>
          </div>
        )}

        {/* Overlays */}
        <div className="absolute inset-0 bg-black/60 pointer-events-none" />
        <div className="absolute inset-0 bg-[#7f1d1d]/45 mix-blend-multiply pointer-events-none" />
        <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-[#5f1111] to-transparent pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#5f1111] to-transparent pointer-events-none" />

        {/* Content */}
        <div className="relative z-10 max-w-3xl mx-auto px-6 py-20 text-center text-white animate-fade-up">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#dc2626]/90 text-xs font-black uppercase tracking-wider mb-4 shadow-lg">
            <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
            Live Weekly
          </span>

          <h2 className="font-display text-3xl sm:text-5xl font-black mb-3 drop-shadow">
            Watch us open packs
          </h2>

          <p className="text-sm sm:text-base text-zinc-100/90 max-w-lg mx-auto mb-8">
            Rare pulls, vintage box breaks &amp; community giveaways.
          </p>

          <a
            href={WATCH_CHANNEL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-display font-black text-sm bg-gradient-to-r from-[#dc2626] to-[#b8901f] text-white hover:scale-105 transition-transform shadow-[0_10px_30px_rgba(220,38,38,0.4)] hover:shadow-[0_15px_40px_rgba(184,144,31,0.5)]"
          >
            <Play className="w-4 h-4 fill-current group-hover:scale-110 transition-transform" />
            WATCH NOW
          </a>
        </div>
      </div>
    </section>
  );
}