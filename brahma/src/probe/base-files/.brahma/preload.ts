import { JSDOM } from "jsdom";

const jsdom = new JSDOM();

global.window = jsdom.window as any;
global.document = jsdom.window.document;
global.MutationObserver = jsdom.window.MutationObserver;
