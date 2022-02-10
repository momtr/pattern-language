import React from "react";

const globalState = {
  jwt: null,
  user: null,
  roles: [],
};

const globalStateContext = React.createContext(globalState);
const dispatchStateContext = React.createContext((...state) =>
  console.error("Provider not set")
);

const GlobalStateProvider = ({ children }) => {
  const [state, dispatch] = React.useReducer(
    (state, newValue) => ({ ...state, ...newValue }),
    globalState
  );
  return (
    <globalStateContext.Provider value={state}>
      <dispatchStateContext.Provider value={dispatch}>
        {children}
      </dispatchStateContext.Provider>
    </globalStateContext.Provider>
  );
};

const useGlobalState = () => [
  React.useContext(globalStateContext),
  React.useContext(dispatchStateContext),
];

export { GlobalStateProvider, useGlobalState };
