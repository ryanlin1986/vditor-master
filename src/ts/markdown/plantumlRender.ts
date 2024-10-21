import { Constants } from "../constants";
import { addScript } from "../util/addScript";
import { plantumlRenderAdapter } from "./adapterRender";

declare const plantumlEncoder: {
    encode(options: string): string,
};

declare const requirejs: any;

export const plantumlRender = (element: (HTMLElement | Document) = document, cdn = Constants.CDN) => {
    const plantumlElements = plantumlRenderAdapter.getElements(element);
    if (plantumlElements.length === 0) {
        return;
    }
    if (typeof requirejs !== "undefined") {
        requirejs([`${cdn}/dist/js/plantuml/plantuml-encoder.min.js`], (plantumlEncoder: any) => {
            plantumlElements.forEach((e: HTMLDivElement) => {
                if (e.parentElement.classList.contains("vditor-wysiwyg__pre") ||
                    e.parentElement.classList.contains("vditor-ir__marker--pre")) {
                    return;
                }
                const text = plantumlRenderAdapter.getCode(e).trim();
                if (!text) {
                    return;
                }
                try {
                    e.innerHTML = `<img src="http://www.plantuml.com/plantuml/svg/~1${plantumlEncoder.encode(text)}">`;
                } catch (error) {
                    e.className = "vditor-reset--error";
                    e.innerHTML = `plantuml render error: <br>${error}`;
                }
            });
        });
    }
    else {
        addScript(`${cdn}/dist/js/plantuml/plantuml-encoder.min.js`, "vditorPlantumlScript").then(() => {
            plantumlElements.forEach((e: HTMLDivElement) => {
                if (e.parentElement.classList.contains("vditor-wysiwyg__pre") ||
                    e.parentElement.classList.contains("vditor-ir__marker--pre")) {
                    return;
                }
                const text = plantumlRenderAdapter.getCode(e).trim();
                if (!text) {
                    return;
                }
                try {
                    e.innerHTML = `<img src="http://www.plantuml.com/plantuml/svg/~1${plantumlEncoder.encode(text)}">`;
                } catch (error) {
                    e.className = "vditor-reset--error";
                    e.innerHTML = `plantuml render error: <br>${error}`;
                }
            });
        });
    }
};
