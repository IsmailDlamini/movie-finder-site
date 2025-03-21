import React, { useEffect, useRef } from "react";

const AdSenseAd = ({ client, slot, format = "auto", responsive = "true" }) => {
  const adLoaded = useRef(false); // Track if the ad is already loaded

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      window.adsbygoogle &&
      !adLoaded.current
    ) {
      try {
        window.adsbygoogle.push({});
        adLoaded.current = true; // Prevent duplicate loading
      } catch (e) {
        console.error("AdSense error:", e);
      }
    }
  }, []);

  return (
    <div>
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={client}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive}
      ></ins>
      <script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6737754409287179"
        crossorigin="anonymous"
      ></script>
    </div>
  );
};

export default AdSenseAd;
