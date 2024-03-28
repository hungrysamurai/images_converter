import { useEffect } from "react";

function useOutsideClick(
 ref: React.MutableRefObject<HTMLElement>,
 cb: Function
) {
 useEffect(() => {
  function handleClickOutside(event: Event) {
   if (ref.current && !ref.current.contains(event.target as HTMLElement)) {
    cb();
   }
  }
  document.addEventListener("mousedown", handleClickOutside);
  document.addEventListener("touchstart", handleClickOutside);

  return () => {
   document.removeEventListener("mousedown", handleClickOutside);
   document.removeEventListener("touchstart", handleClickOutside);
  };
 }, [ref, cb]);
}

export default useOutsideClick;