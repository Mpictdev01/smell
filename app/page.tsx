"use client";

import { useEffect, useState, useRef } from "react";
import { Tweet } from "react-tweet";
import { useProjectConfig } from "@/lib/useProjectConfig";
import Image from "next/image";
import { motion, useAnimation, useMotionValue } from "framer-motion";
import bgImg from "../public/bg.avif";
import logoImg from "../public/logo.avif";

// New X (Twitter) Link collection data
const tweetIds = [
  "2036740049187004724",
  "2036763460982411734",
  "2036779664484761793",
  "2036766178698559971",
  "2036766271149134333",
  "2036778856116539393",
  "2036797806757970359",
  "2036768860091883892",
  "2036803523544072562",
  "2036783287520112660",
  "2036816007411429790",
  "2036827038829752425",
  "2036774694658134069",
  "2036840373725827460",
  "2036798317087367325"
];

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const { config, loading } = useProjectConfig();
  const [copySuccess, setCopySuccess] = useState(false);
  const [linkInput, setLinkInput] = useState("");
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success">("idle");
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [carouselWidth, setCarouselWidth] = useState(0);
  const controls = useAnimation();
  const dragX = useMotionValue(0);

  const slideLeft = () => {
    const container = carouselRef.current?.firstElementChild as HTMLElement;
    const card = container?.firstElementChild as HTMLElement;
    if (!card) return;
    const gap = window.innerWidth >= 768 ? 32 : 24; // gap-8 is 32px, gap-6 is 24px
    const shiftAmt = card.offsetWidth + gap;
    
    // Snap cleanly based on current offset
    const currentX = Math.abs(dragX.get());
    let targetIndex = Math.round(currentX / shiftAmt) - 1;
    if (targetIndex < 0) targetIndex = 0;
    
    const newX = Math.min(-targetIndex * shiftAmt, 0);
    controls.start({ x: newX, transition: { type: "tween", duration: 0.4, ease: "easeOut" } });
  };

  const slideRight = () => {
    const container = carouselRef.current?.firstElementChild as HTMLElement;
    const card = container?.firstElementChild as HTMLElement;
    if (!card || carouselWidth <= 0) return;
    const gap = window.innerWidth >= 768 ? 32 : 24;
    const shiftAmt = card.offsetWidth + gap;
    
    // Determine the next snapped slot
    const currentX = Math.abs(dragX.get());
    const targetIndex = Math.round(currentX / shiftAmt) + 1;
    
    const newX = Math.max(-targetIndex * shiftAmt, -carouselWidth);
    controls.start({ x: newX, transition: { type: "tween", duration: 0.4, ease: "easeOut" } });
  };

  useEffect(() => {
    const updateWidth = () => {
      if (carouselRef.current) {
        setCarouselWidth(carouselRef.current.scrollWidth - carouselRef.current.offsetWidth);
      }
    };
    
    // Evaluate drag boundaries after dom render
    setTimeout(updateWidth, 1000);
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, [mounted]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleLinkSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!linkInput.trim()) return;
    setSubmitStatus("success");
    setLinkInput("");
    setTimeout(() => setSubmitStatus("idle"), 3000);
  };

  const handleCopy = () => {
    if (config?.contract_address) {
      navigator.clipboard.writeText(config.contract_address);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  const chartUrl = config?.dexscreener_url || null;

  const getBuyUrl = () => {
    if (!config?.buy_platform) return null;
    let baseUrl = '';
    if (config.buy_platform === 'pumpfun') {
      baseUrl = 'https://pump.fun/coin/';
    } else if (config.buy_platform === 'jup') {
      baseUrl = 'https://jup.ag/swap/SOL-';
    }
    return config.contract_address ? `${baseUrl}${config.contract_address}` : null;
  };

  const buyUrl = getBuyUrl();

  useEffect(() => {
    // Simulate short loading to show skeleton state before real embeds load
    const timer = setTimeout(() => {
      setMounted(true);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-[100dvh] bg-transparent text-gray-900 font-sans selection:bg-gray-200">
      
      {/* MAIN OVERLAP CONTAINER */}
      <div className="relative w-full">

        {/* SECTION 1: HERO LAYER */}
        <section className="relative w-full z-10 pointer-events-none">
          
          {/* HERO BACKGROUND (No masking needed here. Staying solid ensures no empty space behind the fade) */}
          <div>
            <Image 
              src={bgImg} 
              alt="Hero Background"
              className="w-full h-auto block"
              priority
              unoptimized
            />
          </div>
          
          <div className="absolute top-0 left-0 w-full h-[100dvh] flex items-center justify-center pointer-events-none">
            <Image 
              src={logoImg} 
              alt="Logo"
              className="w-[50%] sm:w-[45%] md:w-[35%] lg:w-[25%] max-w-[600px] h-auto object-contain drop-shadow-2xl"
              priority
              unoptimized
            />
          </div>
        </section>

        {/* PAGE 3 CONTENT LAYER */}
        <div className="relative w-full z-20 -mt-[20vw] pt-[22vw]">
          
          {/* PAGE 3 BACKGROUND LAYER (Masked exactly the top 20vw) */}
          <div 
            className="absolute inset-0 w-full h-full bg-cover bg-top z-[-1]" 
            style={{ 
              backgroundImage: "url('/page3.avif')",
              maskImage: "linear-gradient(to bottom, rgba(0,0,0,0) 0vw, rgba(0,0,0,1) 20vw, rgba(0,0,0,1) 100%)",
              WebkitMaskImage: "linear-gradient(to bottom, rgba(0,0,0,0) 0vw, rgba(0,0,0,1) 20vw, rgba(0,0,0,1) 100%)"
            }}
          ></div>

        {/* SECTION 1.25: ABOUT */}
        <section className="w-full relative z-10 px-6 pb-12 md:pb-16">
        <div className="max-w-[800px] mx-auto mb-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bubblebaz text-gray-900 tracking-normal drop-shadow-sm font-normal">
            ABOUT
          </h2>
        </div>
        
        <div className="max-w-[800px] mx-auto text-center mb-8">
          <div className="space-y-4 text-base md:text-lg text-gray-600 leading-relaxed font-medium mb-12">
            <p>
              Tomodachi Collection is a nostalgic life simulation game that captured our hearts with its quirky Miis and unpredictable island life. 
            </p>
            <p>
              From weird dreams to unexpected friendships, it&apos;s all about the &ldquo;waku waku&rdquo; (exciting) moments that make every day on the island a surprise. Join the community as we celebrate the unique personalities and hilarious internet moments that only Tomodachi can deliver.
            </p>
          </div>
          
          <h3 className="text-3xl font-bubblebaz text-gray-900 tracking-normal mb-6 drop-shadow-sm font-normal">
            SOCIALS
          </h3>
          <div className="flex items-center justify-center gap-6 flex-wrap">
            {/* 1. X (TWITTER) */}
            <a 
              href={config?.twitter_url || "#"} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="w-14 h-14 flex items-center justify-center bg-[#FFD700] border-[4px] border-gray-900 shadow-[4px_4px_0px_rgba(0,0,0,1)] rounded-2xl hover:bg-[#F2C900] hover:translate-x-[2px] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
            >
              <img src="/social/x.avif" alt="X/Twitter" className="w-8 h-8 object-contain brightness-0" />
            </a>

            {/* 2. COMMUNITY (TELEGRAM/GROUPS) */}
            <a 
              href={config?.telegram_url || config?.community_url || "#"} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="w-14 h-14 flex items-center justify-center bg-[#FFD700] border-[4px] border-gray-900 shadow-[4px_4px_0px_rgba(0,0,0,1)] rounded-2xl hover:bg-[#F2C900] hover:translate-x-[2px] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
            >
              <img src="/social/community.avif" alt="Community" className="w-8 h-8 object-contain brightness-0" />
            </a>

            {/* 3. DEX (CHART) */}
            <a 
              href={chartUrl || "#"} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="w-14 h-14 flex items-center justify-center bg-[#FFD700] border-[4px] border-gray-900 shadow-[4px_4px_0px_rgba(0,0,0,1)] rounded-2xl hover:bg-[#F2C900] hover:translate-x-[2px] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
            >
              <img src="/social/dex.avif" alt="Eagle/Dex" className="w-8 h-8 object-contain brightness-0" />
            </a>

            {/* BUY BUTTON (SEPARATE LARGE BUTTON) */}
            <a 
              href={buyUrl || "#"} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="h-14 px-8 font-bubblebaz tracking-widest text-2xl flex items-center justify-center bg-[#FFD700] border-[4px] border-gray-900 shadow-[4px_4px_0px_rgba(0,0,0,1)] rounded-2xl hover:bg-[#F2C900] hover:translate-x-[2px] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
            >
              BUY
            </a>
          </div>
        </div>

        <div className="max-w-[500px] mx-auto text-center mt-8 px-4">
          <div 
            onClick={handleCopy}
            title={copySuccess ? "Copied!" : "Copy CA"}
            className="flex flex-row items-center justify-between gap-3 bg-white border-2 border-gray-100 rounded-full px-5 py-3 shadow-sm w-full mx-auto cursor-pointer hover:border-gray-200 transition-all hover:shadow-md active:scale-[0.98] group"
          >
             <span className="font-bubblebaz text-gray-900 text-xl tracking-normal font-normal">CA:</span>
             <code className="text-gray-600 font-mono text-sm sm:text-base truncate flex-1 text-center bg-transparent select-none">
               {config?.contract_address || "Coming Soon"}
             </code>
             <button aria-label="Copy CA" className="text-gray-400 group-hover:text-gray-900 transition-colors p-1">
                {copySuccess ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-green-500"><polyline points="20 6 9 17 4 12"></polyline></svg>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                )}
             </button>
          </div>
        </div>
      </section>



      {/* SECTION 2: TWITTER X SLIDER */}
      <section className="w-full px-4 md:px-8 pb-32 pt-16 relative z-30 flex justify-center -mt-8">
        
        <div className="max-w-[1400px] w-full">
          {/* Title */}
          <div className="max-w-[1240px] mx-auto text-center mb-10">
            <h2 className="text-4xl md:text-5xl font-bubblebaz text-gray-900 tracking-normal drop-shadow-sm font-normal">
              COMMUNITY X
            </h2>
          </div>

          {/* Container Wrapping Carousel + Nav Arrows */}
          <div className="w-full relative flex items-center justify-center gap-4 group">
            
            {/* PREV BUTTON (Visible on LG screens) */}
            <button 
              onClick={slideLeft}
              className="hidden lg:flex flex-shrink-0 w-14 h-14 items-center justify-center bg-[#FFD700] border-[4px] border-gray-900 shadow-[4px_4px_0px_rgba(0,0,0,1)] rounded-full hover:bg-[#F2C900] hover:translate-x-[-2px] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all z-40 relative group/btn"
              aria-label="Previous"
            >
              <svg fill="none" stroke="currentColor" strokeWidth="3.5" viewBox="0 0 24 24" className="w-5 h-5 text-gray-900 group-hover/btn:-translate-x-0.5 transition-transform"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"></path></svg>
            </button>

            <div className="w-full relative flex-1 min-w-0">
              
              {!mounted ? (
                <div className="flex gap-6 md:gap-8 overflow-hidden">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="w-[85vw] md:w-[calc((100%-2rem)/2)] lg:w-[calc((100%-4rem)/3)] max-w-full rounded-[2rem] shadow-[6px_6px_0px_rgba(0,0,0,1)] border-[4px] border-gray-900 p-4 md:p-6 bg-[length:100%_100%] bg-no-repeat h-[550px] flex-shrink-0 overflow-hidden" style={{ backgroundImage: "url('/fframe-x.png')" }}>
                      <div className="w-full h-full bg-white/50 backdrop-blur-md rounded-2xl animate-pulse"></div>
                    </div>
                  ))}
                </div>
              ) : (
                <motion.div 
                  ref={carouselRef}
                  className="w-full overflow-hidden cursor-grab active:cursor-grabbing pb-8"
                  whileTap={{ cursor: "grabbing" }}
                >
                  <motion.div 
                    className="flex gap-6 md:gap-8 items-start"
                    drag="x"
                    dragConstraints={{ right: 0, left: -carouselWidth }}
                    dragElastic={0.05}
                    dragTransition={{ bounceStiffness: 600, bounceDamping: 20 }}
                    style={{ x: dragX }}
                    animate={controls}
                  >
                    {tweetIds.map((id) => (
                      <motion.div 
                        key={id} 
                        className="w-[85vw] md:w-[calc((100%-2rem)/2)] lg:w-[calc((100%-4rem)/3)] max-w-full flex-shrink-0 rounded-[2rem] shadow-[6px_6px_0px_rgba(0,0,0,1)] border-[4px] border-gray-900 p-4 md:p-6 flex flex-col items-center justify-start bg-[length:100%_100%] bg-no-repeat h-[550px] overflow-hidden"
                        style={{ backgroundImage: "url('/fframe-x.png')" }}
                      >
                        {/* 
                          Fix height consistency! Set exact height + internal scroll.
                          This ensures the grid columns always remain aligned symmetrically.
                          `&::-webkit-scrollbar` hides the scrollbar line to keep it clean.
                          Removed custom CSS overrides ([&>div]:max-w-none) to preserve react-tweet's neat native layout!
                        */}
                        <div className="w-full h-full pointer-events-none sm:pointer-events-auto select-none overflow-y-auto overflow-x-hidden [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] flex justify-center items-start pb-8 pt-2">
                          <div className="w-full mx-auto max-w-[500px]">
                            <Tweet id={id} />
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                </motion.div>
              )}
            </div>

            {/* NEXT BUTTON */}
            <button 
              onClick={slideRight}
              className="hidden lg:flex flex-shrink-0 w-14 h-14 items-center justify-center bg-[#FFD700] border-[4px] border-gray-900 shadow-[4px_4px_0px_rgba(0,0,0,1)] rounded-full hover:bg-[#F2C900] hover:translate-x-[2px] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all z-40 relative group/btn"
              aria-label="Next"
            >
              <svg fill="none" stroke="currentColor" strokeWidth="3.5" viewBox="0 0 24 24" className="w-5 h-5 text-gray-900 group-hover/btn:translate-x-0.5 transition-transform"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"></path></svg>
            </button>

          </div>
        </div>
      </section>
      
      </div> {/* END OF PAGE 3 CONTENT LAYER */}
      </div> {/* END OF MAIN OVERLAP CONTAINER */}

      {/* FLOATING AUDIO BUTTON */}
      <button
        onClick={togglePlay}
        className="fixed bottom-6 right-6 z-50 w-16 h-16 md:w-20 md:h-20 rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all cursor-pointer flex items-center justify-center hover:bg-white/10"
      >
        <img 
          src={isPlaying ? "/button/stop.png" : "/button/play.png"} 
          alt={isPlaying ? "Stop Music" : "Play Music"} 
          className="w-full h-full object-contain drop-shadow-lg" 
        />
      </button>
      <audio ref={audioRef} src="/music-bg.mp3" loop />

    </div>
  );
}
