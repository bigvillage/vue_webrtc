declare module 'videojs-contrib-hls' {
    import videojs from 'video.js';

    const hlsPlugin: (options?: any) => videojs.Plugin;

    export default hlsPlugin;
}