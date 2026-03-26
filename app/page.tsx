"use client";

import { useEffect, useState, useRef } from "react";
import { Tweet } from "react-tweet";
import { useProjectConfig } from "@/lib/useProjectConfig";
import Image from "next/image";
import Script from "next/script";
import { motion, useAnimation, useMotionValue } from "framer-motion";
import heroBgStatic from "../public/bg1.avif";
import islandBgStatic from "../public/page3.avif";
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

// Items to duplicate for seamless looping (3 items for LG layout)
const duplicatedIds = tweetIds.slice(0, 3);
const displayTweetIds = [...tweetIds, ...duplicatedIds];

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
    const gap = window.innerWidth >= 768 ? 32 : 24;
    const shiftAmt = card.offsetWidth + gap;
    
    const currentX = dragX.get();
    let targetIndex = Math.round(Math.abs(currentX) / shiftAmt) - 1;
    
    // Looping logic for Left
    if (targetIndex < 0) {
      // Jump instantly to the duplicated position at the end
      const jumpX = -tweetIds.length * shiftAmt;
      dragX.set(jumpX);
      targetIndex = tweetIds.length - 1;
    }
    
    const newX = -targetIndex * shiftAmt;
    controls.start({ x: newX, transition: { type: "tween", duration: 0.4, ease: "easeOut" } });
  };

  const slideRight = () => {
    const container = carouselRef.current?.firstElementChild as HTMLElement;
    const card = container?.firstElementChild as HTMLElement;
    if (!card || carouselWidth <= 0) return;
    const gap = window.innerWidth >= 768 ? 32 : 24;
    const shiftAmt = card.offsetWidth + gap;
    
    const currentX = dragX.get();
    let targetIndex = Math.round(Math.abs(currentX) / shiftAmt) + 1;
    
    const newX = -targetIndex * shiftAmt;
    
    controls.start({ x: newX, transition: { type: "tween", duration: 0.4, ease: "easeOut" } }).then(() => {
      // If we've reached or passed the end of original items, jump back to start
      if (targetIndex >= tweetIds.length) {
        dragX.set(0);
      }
    });
  };

  useEffect(() => {
    const updateWidth = () => {
      if (carouselRef.current) {
        const container = carouselRef.current.firstElementChild as HTMLElement;
        const card = container?.firstElementChild as HTMLElement;
        if (card) {
          const gap = window.innerWidth >= 768 ? 32 : 24;
          const shiftAmt = card.offsetWidth + gap;
          
          let visibleCount = 1;
          if (window.innerWidth >= 1024) visibleCount = 3;
          else if (window.innerWidth >= 768) visibleCount = 2;
          
          // carouselWidth is the maximum negative x value
          setCarouselWidth((displayTweetIds.length - visibleCount) * shiftAmt);
        }
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

  // Master Injection & Initialization for Jupiter Plugin V1 (No Deprecation Message)
  useEffect(() => {
    if (!mounted || !config?.contract_address) return;

    const initWidget = () => {
      const jupTerminal = document.getElementById('jupiter-terminal');
      if ((window as any).Jupiter && jupTerminal && config.contract_address) {
        (window as any).Jupiter.init({
          displayMode: "integrated",
          integratedTargetId: "jupiter-terminal",
          endpoint: "https://api.mainnet-beta.solana.com",
          strictTokenList: false,
          formProps: {
            initialInputMint: "So11111111111111111111111111111111111111112",
            initialOutputMint: config.contract_address.trim(),
          },
        });
        return true;
      }
      return false;
    };

    // 1. Manually Inject Plugin Script
    const existingScript = document.querySelector('script[src*="plugin.jup.ag"]');
    if (!existingScript) {
      const script = document.createElement('script');
      script.src = "https://plugin.jup.ag/plugin-v1.js";
      script.async = true;
      script.onload = () => setTimeout(initWidget, 500);
      document.body.appendChild(script);
    } else {
      initWidget();
    }

    // 2. Persistent Polling to ensure widget appears without gaps
    const interval = setInterval(() => {
      const terminalDiv = document.getElementById('jupiter-terminal');
      if (terminalDiv && terminalDiv.children.length === 0 && (window as any).Jupiter) {
        if (initWidget()) clearInterval(interval);
      }
    }, 1500);

    return () => clearInterval(interval);
  }, [mounted, config?.contract_address]);



  return (
    <div className="min-h-[100dvh] bg-transparent text-gray-900 font-sans selection:bg-gray-200">
      
      {/* NAVBAR */}
      <nav className="fixed top-10 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-4 px-6 py-2 bg-[#FFD700] shadow-clay-yellow rounded-2xl border-none">
        <a href="#" className="font-bubblebaz text-xl tracking-wider text-gray-900 hover:scale-105 transition-all px-2 uppercase">HOME</a>
        <a href="#about" className="font-bubblebaz text-xl tracking-wider text-gray-900 hover:scale-105 transition-all px-2 uppercase">ABOUT</a>
        <a 
          href="#buy" 
          className="font-bubblebaz text-xl tracking-wider text-gray-900 hover:scale-105 transition-all px-2 uppercase"
        >
          BUY
        </a>
      </nav>

      <div className="relative w-full">
        {/* SECTION 1: HERO LAYER */}
        <section className="relative w-full min-h-[125vh] overflow-hidden bg-[#B0E0E6]">
          
          {/* HERO BACKGROUND */}
          <div 
            className="absolute inset-x-0 top-0 h-[125vh] z-10 leading-[0]"
            style={{ 
              maskImage: 'linear-gradient(to bottom, black 115vh, transparent 125vh)',
              WebkitMaskImage: 'linear-gradient(to bottom, black 115vh, transparent 125vh)'
            }}
          >
            <Image 
              src="/bg1.avif" 
              alt="Hero Background"
              fill
              className="object-cover"
              priority
              unoptimized
              quality={100}
            />
          </div>

          {/* BACKGROUND STITCHING FOR LOWER SECTIONS */}
          <div className="absolute inset-0 -z-10 pointer-events-none">
             {[1, 2, 3, 4].map((index) => (
               <div 
                 key={index}
                 className="absolute w-full h-[110vh]"
                 style={{ 
                   top: `${115 + (index - 1) * 99}vh`, // Start right at the buffer point (115vh)
                   maskImage: 'linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)',
                   WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)',
                 }}
               >
                 <Image 
                   src="/page3.avif" 
                   alt={`Island Layer ${index}`}
                   fill
                   className="object-cover"
                   unoptimized
                   quality={100}
                 />
               </div>
             ))}
          </div>

          {/* HERO CONTENT OVERLAY */}
          <div className="absolute top-0 left-0 w-full h-screen flex flex-col items-center justify-center px-4 pt-16 z-50 pointer-events-none">
            <div className="flex flex-col items-center justify-center w-full max-w-[1240px] mt-0 pointer-events-auto">
              <Image 
                src={logoImg} 
                alt="Logo"
                className="w-[50%] sm:w-[45%] md:w-[35%] lg:w-[28%] max-w-[550px] h-auto object-contain mb-8"
                priority
                unoptimized
              />

              <div className="flex items-center justify-center gap-6 flex-wrap mb-8">
                {/* 1. X (TWITTER) */}
                <a 
                  href={config?.twitter_url || "#"} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-14 h-14 flex items-center justify-center bg-[#FFD700] shadow-clay-yellow rounded-2xl hover:bg-[#F2C900] hover:scale-110 active:scale-95 transition-all"
                >
                  <img src="/social/x.avif" alt="X/Twitter" className="w-8 h-8 object-contain brightness-0" />
                </a>

                {/* 2. COMMUNITY (TELEGRAM/GROUPS) */}
                <a 
                  href={config?.telegram_url || config?.community_url || "#"} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-14 h-14 flex items-center justify-center bg-[#FFD700] shadow-clay-yellow rounded-2xl hover:bg-[#F2C900] hover:scale-110 active:scale-95 transition-all"
                >
                  <img src="/social/community.avif" alt="Community" className="w-8 h-8 object-contain brightness-0" />
                </a>

                {/* 3. DEX (CHART) */}
                <a 
                  href={chartUrl || "#"} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-14 h-14 flex items-center justify-center bg-[#FFD700] shadow-clay-yellow rounded-2xl hover:bg-[#F2C900] hover:scale-110 active:scale-95 transition-all"
                >
                  <img src="/social/dex.avif" alt="Eagle/Dex" className="w-8 h-8 object-contain brightness-0" />
                </a>
              </div>

              <div className="max-w-[500px] w-full mx-auto text-center px-4">
                <div 
                  onClick={handleCopy}
                  title={copySuccess ? "Copied!" : "Copy CA"}
                  className="flex flex-row items-center justify-between gap-3 bg-white shadow-clay-white rounded-full px-5 py-3 w-full mx-auto cursor-pointer hover:scale-[1.02] transition-all active:scale-[0.98] group"
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
            </div>
          </div>
        </section>

        {/* PAGE 3 CONTENT LAYER */}
        {/* PAGE 3 CONTENT LAYER */}
        <div className="relative w-full z-20 -mt-[20vw] pt-[22vw] min-h-screen">
          
          {/* PAGE 3 BACKGROUND LAYER (Normal Scroll Behavior) */}
          <div 
            className="absolute inset-0 w-full h-full z-[-1] pointer-events-none" 
            style={{ 
              backgroundImage: "url('/page3.avif')",
              backgroundSize: "cover",
              backgroundPosition: "center top",
              backgroundAttachment: "fixed",
              maskImage: "linear-gradient(to bottom, rgba(0,0,0,0) 0vw, rgba(0,0,0,1) 20vw, rgba(0,0,0,1) 100%)",
              WebkitMaskImage: "linear-gradient(to bottom, rgba(0,0,0,0) 0vw, rgba(0,0,0,1) 20vw, rgba(0,0,0,1) 100%)"
            }}
          ></div>

        {/* SECTION 1.25: ABOUT / JOIN COMMUNITY */}
        <section id="about" className="w-full relative z-10 px-6 pt-12">
          <div className="max-w-[1240px] mx-auto text-center">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bubblebaz text-gray-900 tracking-normal font-normal mb-8 uppercase">
              Join To Community
            </h2>
            
            {/* NEW ABOUT IMAGE */}
            <div className="max-w-[1000px] mx-auto mb-12">
              <div className="relative rounded-[2.5rem] md:rounded-[3.5rem] overflow-hidden shadow-clay border-none">
                <Image 
                  src="/aboout.avif" 
                  alt="Join Community"
                  width={1200}
                  height={800}
                  className="w-full h-auto object-cover"
                  unoptimized
                />
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 1.5: ABOUT DETAILS (SIMPLIFIED) */}
        <section id="about-details" className="w-full relative z-30 px-6 py-8">
          <div className="max-w-[800px] mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bubblebaz text-gray-900 mb-6 uppercase">
              WHAT IS $TOMODACHI?
            </h2>
            <p className="text-xl md:text-2xl font-bubblebaz text-gray-700 leading-relaxed tracking-wide">
              Experience the nostalgic "waku waku" life with Tomodachi Collection. A community dedicated to the quirky lives and internet moments of Miis on the island. 
              We bring back the fun, the chaos, and the memories of your favorite childhood island life, now on the Solana blockchain.
            </p>
          </div>
        </section>

        {/* SECTION 2: TWITTER X SLIDER (MOVED UP) */}
        <section className="w-full px-4 md:px-8 pb-16 pt-8 relative z-30 flex justify-center">
          <div className="max-w-[1400px] w-full">
            {/* Title */}
            <div className="max-w-[1240px] mx-auto text-center mb-8">
              <h2 className="text-4xl md:text-5xl font-bubblebaz text-gray-900 tracking-normal font-normal uppercase">
                COMMUNITY X
              </h2>
            </div>

            {/* Container Wrapping Carousel + Nav Arrows */}
            <div className="w-full relative flex items-center justify-center gap-4 group">
              
              {/* PREV BUTTON (Visible on LG screens) */}
              <button 
                onClick={slideLeft}
                className="hidden lg:flex flex-shrink-0 w-14 h-14 items-center justify-center bg-[#FFD700] shadow-clay-yellow rounded-full hover:bg-[#F2C900] hover:scale-110 active:scale-95 transition-all z-40 relative group/btn border-none"
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
                    className="w-full overflow-hidden cursor-grab active:cursor-grabbing pb-12 px-4"
                    whileTap={{ cursor: "grabbing" }}
                  >
                    <motion.div 
                      className="flex gap-6 md:gap-8 items-start"
                      drag="x"
                      dragConstraints={{ right: 0, left: -carouselWidth }}
                      dragElastic={0.05}
                      dragTransition={{ bounceStiffness: 600, bounceDamping: 20 }}
                      onDragEnd={() => {
                        const currentX = dragX.get();
                        const container = carouselRef.current?.firstElementChild as HTMLElement;
                        const card = container?.firstElementChild as HTMLElement;
                        if (!card) return;
                        const gap = window.innerWidth >= 768 ? 32 : 24;
                        const shiftAmt = card.offsetWidth + gap;
                        
                        // Handle looping during manual drag
                        if (currentX > 0) {
                          dragX.set(currentX - (tweetIds.length * shiftAmt));
                        } else if (currentX < -(tweetIds.length * shiftAmt)) {
                          dragX.set(currentX + (tweetIds.length * shiftAmt));
                        }
                        
                        // Auto snap
                        const targetIndex = Math.round(Math.abs(dragX.get()) / shiftAmt);
                        controls.start({ x: -targetIndex * shiftAmt, transition: { type: "tween", duration: 0.4, ease: "easeOut" } });
                      }}
                      style={{ x: dragX }}
                      animate={controls}
                    >
                      {displayTweetIds.map((id, index) => (
                        <motion.div 
                          key={`${id}-${index}`} 
                          className="w-[85vw] md:w-[calc((100%-2rem)/2)] lg:w-[calc((100%-4rem)/3)] max-w-full flex-shrink-0 rounded-[2.5rem] shadow-clay border-none p-5 md:p-8 flex flex-col items-center justify-center bg-[length:100%_100%] bg-no-repeat h-[620px] lg:h-[650px]"
                          style={{ backgroundImage: "url('/fframe-x.png')" }}
                        >
                          <div className="w-full h-full pointer-events-none sm:pointer-events-auto select-none overflow-y-auto overflow-x-hidden [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] flex justify-center items-center">
                            <div className="w-full mx-auto max-w-[500px]">
                              <div className="rounded-[1.5rem] overflow-hidden shadow-2xl bg-black">
                                <Tweet id={id} />
                              </div>
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
                className="hidden lg:flex flex-shrink-0 w-14 h-14 items-center justify-center bg-[#FFD700] shadow-clay-yellow rounded-full hover:bg-[#F2C900] hover:scale-110 active:scale-95 transition-all z-40 relative group/btn border-none"
                aria-label="Next"
              >
                <svg fill="none" stroke="currentColor" strokeWidth="3.5" viewBox="0 0 24 24" className="w-5 h-5 text-gray-900 group-hover/btn:translate-x-0.5 transition-transform"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"></path></svg>
              </button>

            </div>
          </div>
        </section>

        {/* SECTION 3: JUP.SWAP */}
        <section id="buy" className="w-full px-6 pb-32 pt-16 relative z-10 flex flex-col items-center overflow-hidden">
          <div className="max-w-[1240px] w-full mx-auto">
            {/* Title with matching style */}
            <div className="text-center mb-8 px-4">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bubblebaz text-gray-900 tracking-normal font-normal uppercase">
                JUP.SWAP
              </h2>
            </div>
            
            {/* Grid for Two Main Components: Jupiter Swap & DexScreener Chart */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-10 items-stretch">
              
              {/* JUPITER SWAP WIDGET */}
              <div className="xl:col-span-12 lg:xl:col-span-5 flex flex-col">
                <div 
                  className="shadow-clay rounded-[2.5rem] p-5 md:p-8 bg-[length:100%_100%] bg-no-repeat h-full flex flex-col overflow-hidden border-none min-h-[650px] lg:min-h-[700px]"
                  style={{ backgroundImage: "url('/fframe-x.png')" }}
                >
                  <div className="pt-2 pb-4">
                    <h3 className="text-2xl md:text-3xl font-bubblebaz text-gray-900 text-center tracking-wider uppercase">SWAP $TOMODACHI</h3>
                  </div>
                  <div className="flex-1 w-full relative rounded-[1.5rem] overflow-hidden bg-black shadow-inner">
                    <div id="jupiter-terminal" className="absolute inset-0 w-full h-full" />
                  </div>
                </div>
              </div>
              {/* DEXSCREENER CHART */}
              <div className="xl:col-span-12 lg:xl:col-span-7 flex flex-col">
                <div 
                  className="shadow-clay rounded-[2.5rem] p-5 md:p-8 bg-[length:100%_100%] bg-no-repeat h-full flex flex-col overflow-hidden border-none min-h-[650px] lg:min-h-[700px]"
                  style={{ backgroundImage: "url('/fframe-x.png')" }}
                >
                  <div className="pt-2 pb-4">
                    <h3 className="text-2xl md:text-3xl font-bubblebaz text-gray-900 text-center tracking-wider uppercase">LIVE CHART</h3>
                  </div>
                  <div className="flex-1 w-full relative rounded-[1.5rem] overflow-hidden bg-black shadow-inner">
                    {config?.contract_address ? (
                      <div className="absolute inset-0 overflow-hidden bg-[#131722]">
                        <iframe 
                          src={`https://dexscreener.com/solana/${config.contract_address}?embed=1&theme=dark&trades=0&info=0&chart=1`} 
                          className="absolute border-none"
                          style={{ 
                            top: '-82px', 
                            left: '-62px', 
                            width: 'calc(100% + 82px)', 
                            height: 'calc(100% + 100px)',
                            maxWidth: 'none'
                          }}
                          title="DexScreener Chart"
                        />
                      </div>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-500 font-bubblebaz text-xl">
                        Live Chart Coming Soon
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
            </div>
          </div>
        </section>
      
      </div> {/* END OF PAGE 3 CONTENT LAYER */}
      </div> {/* END OF MAIN OVERLAP CONTAINER */}

      {/* FLOATING AUDIO BUTTON */}
      <button
        onClick={togglePlay}
        className="fixed bottom-6 right-6 z-50 w-16 h-16 md:w-20 md:h-20 rounded-full shadow-clay-yellow bg-[#FFD700] hover:scale-110 active:scale-95 transition-all cursor-pointer flex items-center justify-center border-none"
      >
        <img 
          src={isPlaying ? "/button/stop.png" : "/button/play.png"} 
          alt={isPlaying ? "Stop Music" : "Play Music"} 
          className="w-full h-full object-contain p-2" 
        />
      </button>
      <audio ref={audioRef} src="/music-bg.mp3" loop />

    </div>
  );
}
