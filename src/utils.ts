import { load } from 'cheerio';
import { defaultHeaders, findAudioPrefix } from './const';

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

export { ParseAudiosFromHTML, FetchHTML };