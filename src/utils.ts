import { load } from 'cheerio';
import { defaultHeaders, findAudioPrefix, vrUrlPrefix } from './const';

const ParseVoiceFromHTML = (html: string) => {
    const $ = load(html);
    const voiceElements = $(`iframe[src*="${vrUrlPrefix}"]`);
    const voices: string[] = [];
    voiceElements.each((_, element) => {
        const src = $(element).attr('src');
        if (src) {
            voices.push(src);
        }
    });
    return voices;
}

const ParseAudiosFromHTML = (html: string) => {
    const $ = load(html);
    const inputElements = $(`input[type="hidden"][value*="${findAudioPrefix}"]`);
    const audioSources: string[] = [];
    inputElements.each((_, element) => {
        const src = $(element).attr('value');
        if (src) {
            audioSources.push(src);
        }
    });
    return audioSources;
}

const FetchHTML = async (url: string): Promise<string> => {
    const response = await fetch(url, { headers: defaultHeaders}).catch(() => null);
    if (!response || !response.ok) {
        throw new Error('Failed to fetch HTML');
    }
    return await response.text();
}

export { ParseVoiceFromHTML, ParseAudiosFromHTML, FetchHTML };