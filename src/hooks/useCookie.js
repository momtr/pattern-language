import { useCallback, useState } from "react";

/**
 * use a cookie by specifying its name
 * @param {} name 
 * @returns 
 */
export function useCookie(name) {
  const [val, setVal] = useState(getCookie(name));

  const set = useCallback(
    (value, days) => {
      setCookie(name, value, days);
      setVal(value);
    }, [setVal, name]);

  return [val, set];
}

/**
 * set the value for the cookie that is specified by the name for the given number of days
 * @param {} name 
 * @param {*} value 
 * @param {*} days 
 */
function setCookie(name, value, days) {
  let date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value}; expires=${date.toUTCString()}; path=/`;
}

/**
 * get the value of the cookie by specifying the cookie's name
 * @param {*} name 
 * @returns 
 */
function getCookie(name) {
  let fullName = name + "=";
  let ca = document.cookie.split(";");
  for (let v of ca) {
    v = v.trim();
    if (v.indexOf(fullName) === 0) return v.substring(fullName.length, v.length);
  }
  return null;
}
