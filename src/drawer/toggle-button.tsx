import classNames from "classnames";
import { useSnapshot } from "valtio";
import { state, toggleDrawer } from "./state";
export { closeDrawer } from "./state";

export function ToggleButton() {
  const { visible } = useSnapshot(state);
  return (
    <div
      className="absolute -z-10 top-2 -left-11 h-8 w-14 bg-contain bg-right bg-no-repeat"
      style={{
        backgroundImage: `url(${require("../../images/drawer-button.png")})`,
      }}
      onClick={toggleDrawer}
    >
      <div
        className={classNames(
          "h-5 w-5 mt-1.5 ml-6 bg-cover duration-300 ease-out",
          !visible && "rotate-180"
        )}
        style={{
          backgroundImage: `url(${require("../../images/drawer-arrow.png")})`,
        }}
      />
    </div>
  );
}
