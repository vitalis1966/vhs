import { Helmet } from "react-helmet-async";
import { useSEOGlobal } from "@/hooks/useSEO";

export function SEOScripts() {
  const { data: global } = useSEOGlobal();
  if (!global) return null;

  return (
    <Helmet>
      {/* Google Tag Manager */}
      {global.google_tag_manager_id && (
        <script>{`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${global.google_tag_manager_id}');`}</script>
      )}

      {/* Google Analytics */}
      {global.google_analytics_id && !global.google_tag_manager_id && (
        <>
          <script async src={`https://www.googletagmanager.com/gtag/js?id=${global.google_analytics_id}`} />
          <script>{`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${global.google_analytics_id}');`}</script>
        </>
      )}

      {/* Meta Pixel */}
      {global.meta_pixel_id && (
        <script>{`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${global.meta_pixel_id}');fbq('track','PageView');`}</script>
      )}

      {/* Hotjar */}
      {global.hotjar_id && (
        <script>{`(function(h,o,t,j,a,r){h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};h._hjSettings={hjid:${global.hotjar_id},hjsv:6};a=o.getElementsByTagName('head')[0];r=o.createElement('script');r.async=1;r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;a.appendChild(r);})(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');`}</script>
      )}

      {/* LinkedIn Partner */}
      {global.linkedin_partner_id && (
        <script>{`_linkedin_partner_id="${global.linkedin_partner_id}";window._linkedin_data_partner_ids=window._linkedin_data_partner_ids||[];window._linkedin_data_partner_ids.push(_linkedin_partner_id);`}</script>
      )}

      {/* Custom head script */}
      {global.custom_head_script && (
        <script>{global.custom_head_script}</script>
      )}
    </Helmet>
  );
}
