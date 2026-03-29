import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useGlobalScripts } from "@/hooks/useSEO";

export function GlobalScripts() {
  const scripts = useGlobalScripts();

  const gtmId = scripts?.google_tag_manager_id || "";
  const customBody = scripts?.custom_body_script || "";

  // GTM noscript body injection — immediately after <body> opens
  useEffect(() => {
    if (!gtmId) return;
    const existing = document.getElementById("gtm-noscript-container");
    if (existing) existing.remove();

    const ns = document.createElement("noscript");
    ns.id = "gtm-noscript-container";
    const iframe = document.createElement("iframe");
    iframe.src = `https://www.googletagmanager.com/ns.html?id=${gtmId}`;
    iframe.height = "0";
    iframe.width = "0";
    iframe.style.display = "none";
    iframe.style.visibility = "hidden";
    ns.appendChild(iframe);
    document.body.insertBefore(ns, document.body.firstChild);
    return () => {
      try {
        document.body.removeChild(ns);
      } catch {}
    };
  }, [gtmId]);

  // Custom body script injection
  useEffect(() => {
    if (!customBody) return;
    const el = document.createElement("script");
    el.innerHTML = customBody;
    document.body.insertBefore(el, document.body.firstChild);
    return () => {
      try {
        document.body.removeChild(el);
      } catch {}
    };
  }, [customBody]);

  if (!scripts) return null;

  const {
    google_analytics_id: ga4Id,
    google_ads_id: adsId,
    meta_pixel_id: pixelId,
    linkedin_partner_id: linkedinId,
    hotjar_id: hotjarId,
    intercom_app_id: intercomId,
    crisp_website_id: crispId,
    custom_head_script: customHead,
  } = scripts;

  const useGTM = !!gtmId;
  const useGA4 = !!ga4Id && !gtmId;
  const useAds = !!adsId && !gtmId;

  return (
    <Helmet>
      {/* GOOGLE TAG MANAGER */}
      {useGTM && (
        <script>{`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${gtmId}');`}</script>
      )}

      {/* GOOGLE ANALYTICS 4 (direct, only if no GTM) */}
      {useGA4 && (
        <script async src={`https://www.googletagmanager.com/gtag/js?id=${ga4Id}`} />
      )}
      {useGA4 && !useAds && (
        <script>{`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${ga4Id}');`}</script>
      )}
      {useGA4 && useAds && (
        <script>{`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${ga4Id}');gtag('config','${adsId}');`}</script>
      )}
      {useAds && !useGA4 && (
        <script async src={`https://www.googletagmanager.com/gtag/js?id=${adsId}`} />
      )}
      {useAds && !useGA4 && (
        <script>{`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${adsId}');`}</script>
      )}

      {/* META / FACEBOOK PIXEL */}
      {pixelId && (
        <script>{`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${pixelId}');fbq('track','PageView');`}</script>
      )}

      {/* LINKEDIN INSIGHT TAG */}
      {linkedinId && (
        <script>{`_linkedin_partner_id="${linkedinId}";window._linkedin_data_partner_ids=window._linkedin_data_partner_ids||[];window._linkedin_data_partner_ids.push(_linkedin_partner_id);(function(l){if(!l){window.lintrk=function(a,b){window.lintrk.q.push([a,b])};window.lintrk.q=[]}var s=document.getElementsByTagName("script")[0];var b=document.createElement("script");b.type="text/javascript";b.async=true;b.src="https://snap.licdn.com/li.lms-analytics/insight.min.js";s.parentNode.insertBefore(b,s)})(window.lintrk);`}</script>
      )}

      {/* HOTJAR */}
      {hotjarId && (
        <script>{`(function(h,o,t,j,a,r){h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};h._hjSettings={hjid:${hotjarId},hjsv:6};a=o.getElementsByTagName('head')[0];r=o.createElement('script');r.async=1;r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;a.appendChild(r);})(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');`}</script>
      )}

      {/* INTERCOM */}
      {intercomId && (
        <script>{`window.intercomSettings={api_base:"https://api-iam.intercom.io",app_id:"${intercomId}"};(function(){var w=window;var ic=w.Intercom;if(typeof ic==="function"){ic('reattach_activator');ic('update',w.intercomSettings);}else{var d=document;var i=function(){i.c(arguments);};i.q=[];i.c=function(args){i.q.push(args);};w.Intercom=i;var l=function(){var s=d.createElement('script');s.type='text/javascript';s.async=true;s.src='https://widget.intercom.io/widget/${intercomId}';var x=d.getElementsByTagName('script')[0];x.parentNode.insertBefore(s,x);};if(document.readyState==='complete'){l();}else if(w.attachEvent){w.attachEvent('onload',l);}else{w.addEventListener('load',l,false);}}})();`}</script>
      )}

      {/* CRISP CHAT */}
      {crispId && (
        <script>{`window.$crisp=[];window.CRISP_WEBSITE_ID="${crispId}";(function(){d=document;s=d.createElement("script");s.src="https://client.crisp.chat/l.js";s.async=1;d.getElementsByTagName("head")[0].appendChild(s);})();`}</script>
      )}

      {/* CUSTOM HEAD SCRIPT */}
      {customHead && <script>{customHead}</script>}
    </Helmet>
  );
}
