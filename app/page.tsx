"use client";

import { useEffect, useState, useRef } from "react";
import { Tweet } from "react-tweet";
import { InstagramEmbed } from "react-social-media-embed";
import { toPng } from "html-to-image";
import { useProjectConfig } from "@/lib/useProjectConfig";
import Image from "next/image";
import bgImg from "../public/bg.avif";
import logoImg from "../public/logo.avif";

// Link collection data
const items = [
  { id: 1, type: "instagram", url: "https://www.instagram.com/p/DV0-DHIE-hD/" },
  { id: 2, type: "x", tweetId: "2032058298128531804" },
  { id: 3, type: "x", tweetId: "2032796518835777874" },
  { id: "submit_form", type: "submit_form" },
  { id: 4, type: "instagram", url: "https://www.instagram.com/p/DVhxZ7qEf4t/" },
  { id: 5, type: "x", tweetId: "2030213333589123269" },
  { id: 6, type: "reddit", url: "https://embed.reddit.com/r/me_irl/comments/1p1fzf5/me_irl/?embed=true" },
  { id: 7, type: "x", tweetId: "2032380628277071920" },
  { id: 8, type: "instagram", url: "https://www.instagram.com/p/DVw_79BF32O/" },
  { id: 9, type: "x", tweetId: "2033515604917850482" },
  { id: 10, type: "instagram", url: "https://www.instagram.com/p/DVtA8Y6E9Bl/" },
  { id: 11, type: "x", tweetId: "2032733892734525549" },
];

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const { config, loading } = useProjectConfig();
  const [copySuccess, setCopySuccess] = useState(false);
  const [linkInput, setLinkInput] = useState("");
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success">("idle");
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

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

  const [memeText, setMemeText] = useState("");
  const memeRef = useRef<HTMLDivElement>(null);

  const downloadMeme = async () => {
    if (memeRef.current === null) {
      return;
    }
    
    try {
      // Small timeout/delay can sometimes help rendering
      const dataUrl = await toPng(memeRef.current, { 
        cacheBust: true,
        backgroundColor: '#FFFFFF',
        pixelRatio: 2 // High quality download
      });
      
      const link = document.createElement('a');
      link.download = 'make-your-own-dad-meme.png';
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to generate image', err);
    }
  };

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
          
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <Image 
              src={logoImg} 
              alt="Logo"
              className="w-[70%] sm:w-[60%] md:w-[50%] lg:w-[40%] max-w-[800px] h-auto object-contain drop-shadow-2xl"
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
              The meme comes from the 2006 animated film Monster House, where the character’s strange expression and awkward energy have helped it regain virality across social media recently.
            </p>
            <p>
              The character Reginald &ldquo;Skull&rdquo; Skulinski is a crew member at Pizza Freak, known for his awkward personality and the distinct look that has made him a popular reaction meme.
            </p>
          </div>
          
          <h3 className="text-3xl font-bubblebaz text-gray-900 tracking-normal mb-6 drop-shadow-sm font-normal">
            SOCIALS
          </h3>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 flex-wrap">
            {config?.twitter_url && (
              <a href={config.twitter_url} target="_blank" rel="noopener noreferrer" className="w-[60px] h-[60px] flex items-center justify-center bg-gray-900 hover:bg-black text-white rounded-xl transition-all shadow-sm active:scale-95 border-2 border-gray-900 shadow-[4px_4px_0px_rgba(17,24,39,1)] hover:shadow-[2px_2px_0px_rgba(17,24,39,1)] hover:translate-x-[2px] hover:translate-y-[2px]">
                <img src="/social/x.avif" alt="Twitter/X" className="w-8 h-8 object-contain brightness-0 invert" />
              </a>
            )}
            {config?.community_url && (
              <a href={config.community_url} target="_blank" rel="noopener noreferrer" className="w-[60px] h-[60px] flex items-center justify-center bg-gray-900 hover:bg-black text-white rounded-xl transition-all shadow-sm active:scale-95 border-2 border-gray-900 shadow-[4px_4px_0px_rgba(17,24,39,1)] hover:shadow-[2px_2px_0px_rgba(17,24,39,1)] hover:translate-x-[2px] hover:translate-y-[2px]">
                <img src="/social/community.avif" alt="Community" className="w-8 h-8 object-contain brightness-0 invert" />
              </a>
            )}
            {config?.telegram_url && (
              <a href={config.telegram_url} target="_blank" rel="noopener noreferrer" className="w-[60px] h-[60px] flex items-center justify-center bg-gray-900 hover:bg-black text-white rounded-xl transition-all shadow-sm active:scale-95 border-2 border-gray-900 shadow-[4px_4px_0px_rgba(17,24,39,1)] hover:shadow-[2px_2px_0px_rgba(17,24,39,1)] hover:translate-x-[2px] hover:translate-y-[2px]">
                <img src="/social/community.avif" alt="Telegram" className="w-8 h-8 object-contain brightness-0 invert" />
              </a>
            )}
            {chartUrl && (
              <a href={chartUrl} target="_blank" rel="noopener noreferrer" className="w-[60px] h-[60px] flex items-center justify-center bg-gray-900 hover:bg-black text-white rounded-xl transition-all shadow-sm active:scale-95 border-2 border-gray-900 shadow-[4px_4px_0px_rgba(17,24,39,1)] hover:shadow-[2px_2px_0px_rgba(17,24,39,1)] hover:translate-x-[2px] hover:translate-y-[2px]">
                <img src="/social/dex.avif" alt="Chart" className="w-8 h-8 object-contain brightness-0 invert" />
              </a>
            )}
            {buyUrl && (
              <a href={buyUrl} target="_blank" rel="noopener noreferrer" className="h-[60px] px-6 font-bubblebaz tracking-widest text-2xl flex items-center justify-center bg-[#FFD700] hover:bg-[#F2C900] text-black rounded-xl transition-all shadow-sm active:scale-95 border-2 border-gray-900 shadow-[4px_4px_0px_rgba(17,24,39,1)] hover:shadow-[2px_2px_0px_rgba(17,24,39,1)] hover:translate-x-[2px] hover:translate-y-[2px]">
                BUY
              </a>
            )}
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

      {/* SECTION 1.5: MEME GENERATOR */}
      <section className="w-full py-8 md:py-16 px-6">
        <div className="max-w-[1240px] mx-auto">
          
          <div className="mb-8 text-center">
            <h1 className="text-4xl md:text-6xl font-bubblebaz text-gray-900 tracking-normal mb-2 drop-shadow-sm font-normal">
              Make Your Own Meme
            </h1>
          </div>

          <div className="flex flex-col md:flex-row items-start justify-center gap-10">
            
            {/* MEME PREVIEW CONTAINER */}
            <div className="w-full md:w-[400px] flex-shrink-0 flex justify-center">
              <div 
                ref={memeRef} 
                className="w-full bg-white flex flex-col p-4 border border-gray-100 shadow-sm"
              >
                <div className="text-xl md:text-2xl font-medium text-gray-900 leading-snug mb-4 whitespace-pre-wrap break-words min-h-[4rem]">
                  {memeText || "When you sold the bottom on $SKULL instead of buying more"}
                </div>
                <div className="w-full rounded-[14px] overflow-hidden relative leading-none flex">
                  <img 
                    src="/hero.avif" 
                    alt="Make Your Own Dad Meme"
                    className="w-full h-auto block"
                    crossOrigin="anonymous"
                  />
                  <div className="absolute inset-0 ring-1 ring-inset ring-black/5 rounded-[14px] pointer-events-none"></div>
                </div>
              </div>
            </div>

            {/* CONTROLS */}
            <div className="w-full md:w-[320px] bg-white p-6 rounded-3xl border border-gray-200 shadow-sm flex flex-col gap-5 sticky top-12">
              <div>

                <textarea 
                  className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-base rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all min-h-[120px] resize-none"
                  placeholder="Enter your custom meme caption here..."
                  value={memeText}
                  onChange={(e) => setMemeText(e.target.value)}
                  maxLength={150}
                ></textarea>
                <div className="text-right text-xs text-gray-400 mt-1">
                  {memeText.length}/150
                </div>
              </div>
              
              <button 
                onClick={downloadMeme}
                className="w-full bg-gray-900 hover:bg-black text-white font-bold py-3.5 px-4 rounded-xl transition-all flex items-center justify-center gap-2 active:scale-95 shadow-sm"
              >
                Download Meme
              </button>
            </div>
            
          </div>
        </div>
      </section>

      {/* SECTION 2: MASONRY POSTS */}
      <section className="max-w-[1240px] mx-auto px-6 pb-16 pt-12">


          {/* SKELETON LOADING STATE */}
          {!mounted ? (
            <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="break-inside-avoid">
                  <div className="w-full bg-white rounded-2xl border border-gray-100 p-5 h-[420px] shadow-sm animate-pulse flex flex-col gap-5">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gray-100 rounded-full"></div>
                      <div className="flex flex-col gap-2 flex-1">
                        <div className="h-4 bg-gray-100 rounded w-1/3"></div>
                        <div className="h-3 bg-gray-100 rounded w-1/4"></div>
                      </div>
                    </div>
                    <div className="flex-1 bg-gray-50 rounded-xl my-2"></div>
                    <div className="h-4 bg-gray-100 rounded w-full"></div>
                    <div className="h-4 bg-gray-100 rounded w-5/6"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* ACTUAL CONTENT (MASONRY) */
            <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
              {items.map((item) => (
                <div key={item.id} className="break-inside-avoid">
                  <div className="group relative w-full overflow-hidden rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
                    
                    {item.type === "instagram" && item.url && (
                      <div className="flex justify-center p-0 sm:p-5">
                        <InstagramEmbed url={item.url} width="100%" />
                      </div>
                    )}

                    {item.type === "x" && item.tweetId && (
                      <div className="p-4 flex justify-center w-full">
                        <div className="w-full max-w-md [&>div]:mx-auto">
                          <Tweet id={item.tweetId} />
                        </div>
                      </div>
                    )}

                    {item.type === "reddit" && item.url && (
                      <div className="flex flex-col items-center p-2 m-2">
                        <iframe
                          id={`reddit-embed-${item.id}`}
                          src={item.url.replace('embed.reddit.com', 'www.redditmedia.com')}
                          sandbox="allow-scripts allow-same-origin allow-popups"
                          style={{ border: "none" }}
                          height="500"
                          width="100%"
                          scrolling="no"
                          title="Reddit Embed"
                          className="rounded-lg bg-white"
                        ></iframe>
                      </div>
                    )}
                    
                    {item.type === "submit_form" && (
                      <div className="w-full h-full p-8 flex flex-col justify-center items-center bg-white border border-gray-100 rounded-2xl min-h-[300px] text-center shadow-sm">
                        <h3 className="text-2xl font-bubblebaz text-gray-900 tracking-normal mb-6 w-full">
                          Did we miss one?
                        </h3>
                        
                        <form 
                          className="w-full flex flex-col items-center justify-center gap-4"
                          onSubmit={handleLinkSubmit}
                        >
                          <input 
                            type="text"
                            value={linkInput}
                            onChange={(e) => setLinkInput(e.target.value)}
                            className="w-full border border-gray-200 bg-gray-50 px-4 py-3 rounded-xl outline-none text-gray-900 focus:ring-2 focus:ring-gray-900 transition-all font-medium text-sm" 
                            placeholder="Paste meme link here..." 
                            required
                          />
                          
                          <button 
                            type="submit"
                            disabled={submitStatus === "success"}
                            className={`w-full font-bold py-3.5 px-4 rounded-xl transition-all shadow-sm active:scale-95 flex items-center justify-center gap-2 ${
                              submitStatus === "success" 
                                ? "bg-green-500 hover:bg-green-600 text-white cursor-not-allowed" 
                                : "bg-gray-900 hover:bg-black text-white"
                            }`}
                          >
                            {submitStatus === "success" ? (
                              <>
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                Sent!
                              </>
                            ) : (
                              "Submit"
                            )}
                          </button>
                        </form>
                      </div>
                    )}
                    
                  </div>
                </div>
              ))}

              {items.length === 0 && (
                <div className="text-center py-20 px-6 border-2 border-dashed border-gray-100 rounded-3xl">
                  <h3 className="text-lg font-bold text-gray-900 mb-1">Empty Collection</h3>
                  <p className="text-gray-500 text-sm">No links currently available.</p>
                </div>
              )}
            </div>
          )}
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
