import { CopyButton } from "./button";
import { HighlightedCode, Pre, RawCode, highlight } from "codehike/code";
import { callout } from "./annotations/callout";

// !fold[/className="(.*?)"/gm]
export function MyCode({ codeblock }: { codeblock: HighlightedCode }) {
  return (
    <div className="relative">
      <CopyButton text={codeblock.code} />
      <Pre className="m-0 px-4 bg-zinc-950"
        code={codeblock}
        handlers={[callout]}
        style={codeblock.style}
      />
    </div>
  )
}

// export async function MyCode({ codeblock }: { codeblock: RawCode }) {
//   const highlighted = await highlight(codeblock, "github-dark");
//   return <Pre code={highlighted} handlers={[callout]} />;
// }
