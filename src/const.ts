const allowedMethods = ["GET", "OPTIONS", "HEAD"];
const vrUrlPrefix = "https://m.dcinside.com/voice/player?vr="
const vrUrlSuffix = "&vr_open=1&type=A";
const defaultHeaders = {
    'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64; rv:140.0) Gecko/20100101 Firefox/140.0',
    'Accept': '/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    'Accept-Encoding': 'gzip, deflate, br, zstd',
};
const findAudioPrefix = "https://vr.dcinside.com/viewvoice.php";

export { allowedMethods, vrUrlPrefix, vrUrlSuffix, defaultHeaders, findAudioPrefix };