import { createElement } from "react";
import { createRoot } from "react-dom/client";
import { ShaderBackground } from "../components/ui/waves-shader.tsx";
import "../components/ui/waves-shader.css";

export function mountWavesBackground() {
  if (typeof document === "undefined" || !document.body) return () => {};

  const existingHost = document.querySelector(".site-waves-host");
  if (existingHost) return () => {};

  const host = document.createElement("div");
  host.className = "site-waves-host";
  host.setAttribute("aria-hidden", "true");
  document.body.classList.add("has-waves-background");
  document.body.prepend(host);

  const root = createRoot(host);
  root.render(createElement(ShaderBackground, { className: "site-waves-canvas" }));

  const unmount = () => {
    root.unmount();
    host.remove();
    document.body.classList.remove("has-waves-background");
  };

  if (import.meta.hot) import.meta.hot.dispose(unmount);
  return unmount;
}
