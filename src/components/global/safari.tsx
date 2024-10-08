import  Safari  from "@/components/magicui/safari";
import { NeonGradientCard } from "@/components/ui/neon-gradient-card";

export function SafariDemo() {
  return (


        <NeonGradientCard 
          className="   border border-zinc-950 rounded-xl flex items-center justify-center"
          borderSize={3}
          borderRadius={16}
          neonColors={{ firstColor: "#F28C28", secondColor: "#F4BB44" }}
        >
        
            <Safari
              url="NectLink.chat"
              className="custom-image-size border border-zinc-400 rounded-xl"
              src="/thumbnail.png"
            />
          
        </NeonGradientCard>
 
  
  );
}