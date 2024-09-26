import Safari from "@/components/magicui/safari";
import { BorderBeam } from "../magicui/border-beam";

export function SafariDemo() {
  return (
    <div className="relative">
         <BorderBeam size={250} duration={12} delay={9}/>
         <Safari
  url="NectLink.chat"
  className="custom-image-size border border-zinc-400 rounded-xl "
  src="/thumbnail.png"
/>
     
    </div>
  );
}