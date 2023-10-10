import classNames from "classnames";
import { HTMLAttributes, useState } from "react";

interface Props
  extends Omit<HTMLAttributes<HTMLDivElement>, "defaultValue" | "onChange"> {
  defaultValue?: boolean;
  label?: string;
  onChange: (value: boolean) => void;
}

export function Switch({
  defaultValue = false,
  label,
  onChange,
  ...props
}: Props) {
  const [value, setValue] = useState(defaultValue);
  return (
    <div
      {...props}
      className={classNames(
        "gap-2 flex items-center",
        props.className as string
      )}
      onClick={(event) => {
        event.stopPropagation();
        setValue(!value);
        onChange(!value);
      }}
    >
      <div className="w-10 h-5 relative">
        <img
          className={classNames("h-full absolute")}
          src={
            value
              ? require("../../images/switch-on.png")
              : require("../../images/switch-off.png")
          }
        />
      </div>
      <div
        className="text-white text-sm font-semibold"
        style={{ textShadow: "0 0 3px #000" }}
      >
        {label}
      </div>
    </div>
  );
}
