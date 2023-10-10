import { createRoot } from "react-dom/client";
import { useSnapshot } from "valtio";
import { AreaPicker, closeAreaPicker } from "./area-picker";
import { closeDrawer, Drawer } from "./drawer";
import { GenshinMap } from "./genshin-map";
import { store } from "./store";

function Main() {
  const { mapData } = useSnapshot(store);
  if (!mapData) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <img
          className="max-w-[12rem] md:max-w-xs"
          src={require("../images/splash.jpg")}
        />
      </div>
    );
  }

  return (
    <>
      <GenshinMap />
      <AreaPicker />
      <Drawer />
    </>
  );
}

document.addEventListener("contextmenu", (event) => {
  event.preventDefault();
});

document.body.addEventListener("click", ({ target }) => {
  if ((target as HTMLElement).tagName == "CANVAS") {
    closeAreaPicker();
    if (window.innerWidth < 768) {
      closeDrawer();
    }
  }
});

createRoot(document.getElementById("main")!).render(<Main />);
