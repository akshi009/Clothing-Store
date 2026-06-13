import { jsx } from "react/jsx-runtime";
const SplitErrorComponent = ({
  error
}) => /* @__PURE__ */ jsx("div", { className: "p-10 text-center", children: error.message });
export {
  SplitErrorComponent as errorComponent
};
