import React, { useEffect, useState } from "react";
import "@toast-ui/editor/dist/toastui-editor.css";
import { Viewer } from "@toast-ui/react-editor";

const TViewer = (props: any) => {
  const [editorLoaded, setEditorLoaded] = useState(false);

  /** LIFECYCLES **/
  useEffect(() => {
    if (props.markdown) {
      setEditorLoaded(true);
    } else {
      setEditorLoaded(false);
    }
  }, [props.markdown]);

  return (
    <div className="mt-6 overflow-hidden rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      {editorLoaded ? (
        <Viewer
          initialValue={props.markdown}
          customHTMLRenderer={{
            htmlBlock: {
              iframe(node: any) {
                return [
                  {
                    type: "openTag",
                    tagName: "iframe",
                    outerNewLine: true,
                    attributes: node.attrs,
                  },
                  { type: "html", content: node.childrenHTML ?? "" },
                  { type: "closeTag", tagName: "iframe", outerNewLine: true },
                ];
              },
              div(node: any) {
                return [
                  {
                    type: "openTag",
                    tagName: "div",
                    outerNewLine: true,
                    attributes: node.attrs,
                  },
                  { type: "html", content: node.childrenHTML ?? "" },
                  { type: "closeTag", tagName: "div", outerNewLine: true },
                ];
              },
            },
            htmlInline: {
              big(node: any, { entering }: any) {
                return entering
                  ? { type: "openTag", tagName: "big", attributes: node.attrs }
                  : { type: "closeTag", tagName: "big" };
              },
            },
          }}
        />
      ) : (
        <div className="flex items-center justify-center py-10 text-sm text-gray-500">
          Loading…
        </div>
      )}
    </div>
  );
};

export default TViewer;
