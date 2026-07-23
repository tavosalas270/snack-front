import { forwardRef } from "react";
import { StyleSheet, View } from "react-native";
import WebView from "react-native-webview";

const META_PIXEL_ID = process.env.EXPO_PUBLIC_META_PIXEL_ID ?? "";
const TIKTOK_PIXEL_ID = process.env.EXPO_PUBLIC_TIKTOK_PIXEL_ID ?? "";

/**
 * HTML base que carga los scripts de Meta Pixel y TikTok Pixel.
 * Se renderiza en una WebView invisible (0x0).
 */
const PIXEL_HTML = `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />

    <!-- Meta Pixel -->
    <script>
      !function(f,b,e,v,n,t,s)
      {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};
      if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
      n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t,s)}(window,document,'script',
      'https://connect.facebook.net/en_US/fbevents.js');
      fbq('init', '${META_PIXEL_ID}');
      fbq('track', 'PageView');
    </script>
    <noscript>
      <img height="1" width="1" style="display:none"
        src="https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1"/>
    </noscript>

    <!-- TikTok Pixel -->
    <script>
      !function(w,d,t){
        w.TiktokAnalyticsObject=t;
        var ttq=w[t]=w[t]||[];
        ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie","holdConsent","revokeConsent","grantConsent"];
        ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};
        for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);
        ttq.instance=function(t){
          for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);
          return e
        };
        ttq.load=function(e,n){
          var r="https://analytics.tiktok.com/i18n/pixel/events.js",o=n&&n.partner;
          ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=r,
          ttq._t=ttq._t||{},ttq._t[e]=+new Date,
          ttq._o=ttq._o||{},ttq._o[e]=n||{};
          n=document.createElement("script");
          n.type="text/javascript",n.async=!0,
          n.src=r+"?sdkid="+e+"&lib="+t;
          e=document.getElementsByTagName("script")[0];
          e.parentNode.insertBefore(n,e)
        };
        ttq.load('${TIKTOK_PIXEL_ID}');
        ttq.page();
      }(window,document,'ttq');
    </script>
  </head>
  <body></body>
</html>
`;

/**
 * PixelWebView — WebView invisible que inicializa Meta Pixel y TikTok Pixel.
 *
 * Uso:
 *   const pixelRef = useRef<WebView>(null);
 *   <PixelWebView ref={pixelRef} />
 *
 * Para disparar eventos desde cualquier parte:
 *   pixelRef.current?.injectJavaScript(`
 *     fbq('track', 'CompleteRegistration');
 *     ttq.track('CompleteRegistration');
 *     true; // requerido por react-native-webview
 *   `);
 */
const PixelWebView = forwardRef<any, any>((props, ref) => {

  return (
    <View style={styles.container} pointerEvents="none">
      <WebView
        ref={ref}
        source={{ html: PIXEL_HTML }}
        style={styles.hidden}
        containerStyle={styles.hidden}
        javaScriptEnabled
        // Permite peticiones a dominios externos (Meta, TikTok)
        mixedContentMode="always"
        originWhitelist={["*"]}
      />
    </View>
  );
});

PixelWebView.displayName = "PixelWebView";

export default PixelWebView;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 0,
    height: 0,
    overflow: 'hidden',
    opacity: 0,
    zIndex: -9999,
  },
  hidden: {
    flex: 0,
    width: 0,
    height: 0,
    opacity: 0,
  },
});
