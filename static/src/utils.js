export const apiUrl = "https://actress.minganci.org/api/?limit=100";
export const apiDeleteUrl = "https://actress.minganci.org/api/?image=";

export function touchBottom() {
    const windowHeight = "innerHeight" in window ? window.innerHeight : document.documentElement.offsetHeight;
    const body = document.body;
    const html = document.documentElement;
    const docHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
    const windowBottom = windowHeight + window.pageYOffset;
    return windowBottom >= docHeight;
}
