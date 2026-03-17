"use client";

import { useEffect, useState, useRef } from "react";
import { Tweet } from "react-tweet";
import { InstagramEmbed } from "react-social-media-embed";
import { toPng } from "html-to-image";
import { useProjectConfig } from "@/lib/useProjectConfig";

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
  const { config } = useProjectConfig();

  // Buy button URL generator
  const getBuyUrl = () => {
    if (!config || !config.buy_platform) return null;
    let baseUrl = '';
    if (config.buy_platform === 'pumpfun') {
      baseUrl = 'https://pump.fun/coin/';
    } else if (config.buy_platform === 'jup') {
      baseUrl = 'https://jup.ag/swap/SOL-';
    }
    return config.contract_address ? `${baseUrl}${config.contract_address}` : null;
  };

  const chartUrl = config?.dexscreener_url || null;
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
    <div className="min-h-[100dvh] bg-[#FAFAFA] text-gray-900 font-sans selection:bg-gray-200">
      
      {/* SECTION 1: HERO */}
      <section className="w-full pt-12 pb-8 px-6">
        <div className="max-w-[1240px] mx-auto mb-6 md:mb-8">
          <h2 className="text-4xl md:text-6xl font-bubblebaz text-gray-900 tracking-normal drop-shadow-sm font-normal">
            My dad finding out I drive to the gym, just to walk on a treadmill.
          </h2>
        </div>
        <div className="max-w-[1240px] mx-auto rounded-[2rem] overflow-hidden relative shadow-sm border border-gray-100 bg-white leading-none flex">
          <img 
            src="/hero.avif" 
            alt="Skull hero banner"
            className="w-full h-auto block"
          />
          <div className="absolute inset-0 rounded-[2rem] ring-1 ring-inset ring-gray-900/10 pointer-events-none"></div>
        </div>
      </section>

      {/* SECTION 1.25: ABOUT */}
      <section className="w-full px-6 py-12 md:py-16">
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
              <a href={config.twitter_url} target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto bg-gray-900 hover:bg-black text-white font-bold py-3.5 px-8 rounded-xl transition-all shadow-sm active:scale-95 border-2 border-gray-900 shadow-[4px_4px_0px_rgba(17,24,39,1)] hover:shadow-[2px_2px_0px_rgba(17,24,39,1)] hover:translate-x-[2px] hover:translate-y-[2px]">
                Twitter
              </a>
            )}
            {config?.community_url && (
              <a href={config.community_url} target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto bg-gray-900 hover:bg-black text-white font-bold py-3.5 px-8 rounded-xl transition-all shadow-sm active:scale-95 border-2 border-gray-900 shadow-[4px_4px_0px_rgba(17,24,39,1)] hover:shadow-[2px_2px_0px_rgba(17,24,39,1)] hover:translate-x-[2px] hover:translate-y-[2px]">
                Community
              </a>
            )}
            {config?.telegram_url && (
              <a href={config.telegram_url} target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto bg-gray-900 hover:bg-black text-white font-bold py-3.5 px-8 rounded-xl transition-all shadow-sm active:scale-95 border-2 border-gray-900 shadow-[4px_4px_0px_rgba(17,24,39,1)] hover:shadow-[2px_2px_0px_rgba(17,24,39,1)] hover:translate-x-[2px] hover:translate-y-[2px]">
                Telegram
              </a>
            )}
            {chartUrl && (
              <a href={chartUrl} target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto bg-gray-900 hover:bg-black text-white font-bold py-3.5 px-8 rounded-xl transition-all shadow-sm active:scale-95 border-2 border-gray-900 shadow-[4px_4px_0px_rgba(17,24,39,1)] hover:shadow-[2px_2px_0px_rgba(17,24,39,1)] hover:translate-x-[2px] hover:translate-y-[2px]">
                Chart
              </a>
            )}
            {buyUrl && (
              <a href={buyUrl} target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto bg-gray-900 hover:bg-black text-white font-bold py-3.5 px-8 rounded-xl transition-all shadow-sm active:scale-95 border-2 border-gray-900 shadow-[4px_4px_0px_rgba(17,24,39,1)] hover:shadow-[2px_2px_0px_rgba(17,24,39,1)] hover:translate-x-[2px] hover:translate-y-[2px]">
                Buy
              </a>
            )}
          </div>
        </div>

        <div className="max-w-[800px] mx-auto text-center">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 bg-white border border-gray-100 rounded-2xl px-6 py-5 shadow-sm w-full">
             <span className="font-bubblebaz text-gray-900 text-2xl tracking-normal font-normal">CA:</span>
             <code className="text-gray-600 font-mono text-sm md:text-base break-all bg-gray-50 px-4 py-3 rounded-xl border border-gray-100 w-full sm:flex-1 text-center sm:text-left select-all cursor-text">
               {config?.contract_address || "(Contract Address Coming Soon)"}
             </code>
          </div>
        </div>
      </section>

      {/* SECTION 1.5: MEME GENERATOR */}
      <section className="w-full py-8 md:py-16 px-6 bg-gray-50 border-y border-gray-200">
        <div className="max-w-[1240px] mx-auto">
          
          <div className="mb-8 text-center">
            <h1 className="text-4xl md:text-6xl font-bubblebaz text-gray-900 tracking-normal mb-2 drop-shadow-sm font-normal">
              Make Your Own Meme
            </h1>
            <p className="text-gray-500 font-medium tracking-wide">Enter your own text and download.</p>
          </div>

          <div className="flex flex-col md:flex-row items-start justify-center gap-10">
            
            {/* MEME PREVIEW CONTAINER */}
            <div className="w-full md:w-[400px] flex-shrink-0 flex justify-center">
              <div 
                ref={memeRef} 
                className="w-full bg-white flex flex-col p-4 border border-gray-100 shadow-sm"
              >
                <div className="text-xl md:text-2xl font-medium text-gray-900 leading-snug mb-4 whitespace-pre-wrap break-words min-h-[4rem]">
                  {memeText || "When you say \"I'll be there in 5\" and they say \"I see your location\""}
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
                <label className="block text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">
                  Top Text
                </label>
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
                          onSubmit={(e) => { e.preventDefault(); alert("Feature coming soon!"); }}
                        >
                          <input 
                            type="text" 
                            className="w-full border border-gray-200 bg-gray-50 px-4 py-3 rounded-xl outline-none text-gray-900 focus:ring-2 focus:ring-gray-900 transition-all font-medium text-sm" 
                            placeholder="Paste meme link here..." 
                            required
                          />
                          
                          <button 
                            type="submit" 
                            className="w-full bg-gray-900 hover:bg-black text-white font-bold py-3.5 px-4 rounded-xl transition-all shadow-sm active:scale-95 flex items-center justify-center gap-2"
                          >
                            Submit
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
    </div>
  );
}
