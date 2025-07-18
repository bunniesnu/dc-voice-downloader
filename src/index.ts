/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Bind resources to your worker in `wrangler.jsonc`. After adding bindings, a type definition for the
 * `Env` object can be regenerated with `npm run cf-typegen`.
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

import { allowedMethods, vrUrlPrefix, vrUrlSuffix } from "./const";
import { FetchHTML, ParseAudiosFromHTML, ParseVoiceFromHTML } from "./utils";

export default {
	async fetch(request, env, ctx): Promise<Response> {
		if (!allowedMethods.includes(request.method)) {
			return new Response('Method Not Allowed', { status: 405 });
		}
		const url = new URL(request.url);
		if (url.pathname === '/from-vr') {
			const vr = url.searchParams.get('vr');
			if (vr === null || vr === '') {
				return new Response('vr parameter is required', { status: 400 });
			}
			const html = await FetchHTML(`${vrUrlPrefix}${vr}${vrUrlSuffix}`).catch(() => null);
			if (!html) {
				return new Response('Failed to fetch HTML', { status: 500 });
			}
			const audioSources = ParseAudiosFromHTML(html);
			if (audioSources.length === 0) {
				return new Response('No audio sources found', { status: 404 });
			}
			if (audioSources.length > 1) {
				return new Response('Multiple audio sources found', { status: 400 });
			}
			const response = new Response(audioSources[0], {
				headers: {
					'Content-Type': 'text/plain',
					'Access-Control-Allow-Origin': '*',
					'Access-Control-Allow-Methods': allowedMethods.join(', ')
				}
			});
			return response;
		} else if (url.pathname === '/') {
			const paramUrl = url.searchParams.get('url');
			if (!paramUrl) {
				return new Response('url parameter is required', { status: 400 });
			}
			const reconstructedUrl = new URL(paramUrl);
			for (const param of url.searchParams.keys()) {
				if (param === 'url') continue;
				reconstructedUrl.searchParams.set(param, url.searchParams.get(param) || '');
			}
			const html = await FetchHTML(reconstructedUrl.toString()).catch(() => null);
			if (!html) {
				return new Response('Failed to fetch HTML', { status: 500 });
			}
			const voiceSources = ParseVoiceFromHTML(html);
			if (voiceSources.length === 0) {
				return new Response('No voice sources found', { status: 404 });
			}
			const returnSources = [];
			for (const source of voiceSources) {
				const voiceUrl = new URL(source);
				const vr = voiceUrl.searchParams.get('vr');
				if (vr === null || vr === '') {
					return new Response('vr parameter is required', { status: 400 });
				}
				const html = await FetchHTML(`${vrUrlPrefix}${vr}${vrUrlSuffix}`).catch(() => null);
				if (!html) {
					return new Response('Failed to fetch HTML', { status: 500 });
				}
				const audioSources = ParseAudiosFromHTML(html);
				if (audioSources.length === 0) {
					return new Response('No audio sources found', { status: 404 });
				}
				if (audioSources.length > 1) {
					return new Response('Multiple audio sources found', { status: 400 });
				}
				returnSources.push(audioSources[0]);
			}
			const response = new Response(JSON.stringify(returnSources), {
				headers: {
					'Content-Type': 'application/json',
					'Access-Control-Allow-Origin': '*',
					'Access-Control-Allow-Methods': allowedMethods.join(', ')
				}
			});
			return response;
		} else {
			return new Response('Not Found', { status: 404 });
		}
	},
} satisfies ExportedHandler<Env>;
