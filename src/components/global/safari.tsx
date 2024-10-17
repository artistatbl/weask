import  Safari  from "@/components/magicui/safari";
import { BorderBeam } from "../magicui/border-beam";
// import { NeonGradientCard } from "@/components/ui/neon-gradient-card";

export function SafariDemo() {
  return (

<>
      
    <BorderBeam size={250} duration={12} delay={9} />


           <Safari
             url="NectLink.chat"
             className="custom-image-size border border-zinc-400 rounded-xl"
             src="/thumbnail.png"
             />
    
             </>


      
  
  );
}