import data from '../assets/patterns.json';

const BASE = 'http://localhost'; // ersetzten, durch den hostname, auf dem der Server (bzw. Backend) läuft


export  async function getAllPatterns() {
    //const resp = await fetch(makeHttpEndpoint('/patterns'));
    //const json = await resp.json();
    return new Promise((res, rej) => res({ patterns: data }));
}

export function makeHttpEndpoint(path) {
    return `${BASE}${path}`;
}
