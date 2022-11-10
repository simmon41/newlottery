import alertGradient from "@material-tailwind/react/theme/components/alert/alertGradient";
import { propTypesSize } from "@material-tailwind/react/types/components/avatar";
import { markAssetError } from "next/dist/client/route-loader";




 export const getlotteryState=(s)=> {
    const st=['ALIVE','SUSPEND','CANCEL','CLOSE','FINISH']
    return st[s];
 }  

//  export const getlotteryResults=(s)=> {
   
//  } 



export const setArray=(fp,sp,tp,strt,cons,ops)=>{
    let narr=[5]
    console.log(fp)
    if(fp<1 || sp<1 || tp<1 || strt<1 || cons<1){
        alert("First,Second,Third,Starter, Consolidation prize should not be less than 0")
        return;
    } else {
        if(parseInt(fp)+parseInt(sp)+parseInt(tp)+parseInt(strt)+parseInt(cons)+parseInt(ops)!==100){
            alert("First,Second,Third,Starter, Consolidation +ops Commission not summing up 100%")
            return;
        } else {
            narr[0]=fp;
            narr[1]=sp;
            narr[2]=tp;
            narr[3]=strt;
            narr[4]=cons;
            return narr;
        }
       
    }
}


export const convertToBnb=(divisor, numb)=>{
 return numb/divisor;
}




export const settargetprice= async (tcontract,tgtprice)=>{
    try{
        if(tcontract!=null){
           await tcontract.setTargetAmount(tgtprice);                      
          }
        } catch(e) {
           console.log(e);
        }
    }


    export const setticketprice= async (tcontract,tgtprice)=>{
        try{
            if(tcontract!=null){
               await tcontract.setperticketprice(tgtprice);                      
              }
            } catch(e) {
                console.log(e);
            }
        }

        export const setmaxticket= async (tcontract,tgtprice)=>{
            try{
                if(tcontract!=null){
                   await tcontract.setmaxticketsAllowed(tgtprice);                      
                  }
                } catch(e) {
                    console.log(e);
                }
            }      

            export const setopscommission= async (tcontract,tgtprice)=>{
                try{
                    if(tcontract!=null){
                       await tcontract.setOperatorCommisiion(tgtprice);                      
                      }
                    } catch(e) {
                        console.log(e);
                    }
                }       

                export const setpercentforprize = async (tcontract, prizenumber, lotterynumber,tgtprice)=>{
                    try{
                        if(tcontract!=null){
                           await tcontract.setPrizePercentageSetting(prizenumber,tgtprice);                      
                          }
                        } catch(e) {
                            console.log(e);
                        }
                    }       


    export const setchangestate = async (tcontract,statename)=>{
        try{
            if(tcontract!=null){
                if(statename==="OPEN"){
                    await tcontract.setLotteryOpen();
                } else if (statename==="CLOSE"){
                    await tcontract.setLotteryClose();
                } else if (statename==="SUSPEND"){
                    await tcontract.setLotterySuspend();
                } else if (statename==="CANCEL"){
                    await tcontract.setLotteryCancel();
                } else if (statename==="FINSIH"){
                    await tcontract.setLotteryFinish();
                }
                                       
            }
            } catch(e) {
              console.log(e);
                        }
        }     



        export const setlotteryresults=async(tcontract) =>{
            if(tcontract!=null){
                try {
                    const firstarr=await getrandomvalues(100,23)
                    const mfold= Math.floor(Math.random() * (60 - 15)) + 15;
                    // const secondarr=await getrandomvalues(100,40)
                   //console.log(firstarr)
                   //console.log(mfold)
                   await tcontract.setLotteryResults(firstarr,mfold)
                } catch (e) {
                    console.log(e)
                }
               
            }         
            }  
        


        
        export const operatorWithdraw = async (tcontract)=>{
            try{
                if(tcontract!=null){
                    await tcontract.operatorwithdraw();   
                }
                } catch(e) {
                  console.log(e);
                            }
            }     


            export const setclaimableprize = async (tcontract)=>{
                try{
                    if(tcontract!=null){
                        await tcontract.setClaimablePrizes();   
                    }
                    } catch(e) {
                      console.log(e);
                                }
                }     


                export const getclaimableprize = async (tcontract)=>{
                    var newarr=[5];
                    try{
                        if(tcontract!=null){
                            for( let i=0;i<5;i++){
                                newarr[i]=Number(await tcontract.claimableprize(i));
                                console.log(newarr[i])
                            }
                           
                        }
                        return newarr;
                        } catch(e) {
                          console.log(e);
                                    }

                    }                  

     
//connected to setlottery results
    export const getrandomvalues=async(maxarr,minarr) =>{
       // probably maxarr 100 numbers and minarr 23 number
       //for second list 200 numbers and minarr 100 numbers
        const array = new Uint32Array(maxarr);
        self.crypto.getRandomValues(array);
        let newarr=[];
        
        let i=0;
        for (const num of array) {
           // console.log(num)
            let mnx = num.toString().length-4;
            let randnum=Math.floor(Math.random() * mnx)
            const newnum=parseInt(num.toString().substring(randnum,randnum+4))
            const duppresence=findDuplicateinarray(newnum,newarr)
            if(newnum>1000 && newnum<10000 && duppresence===false){
                //console.log(newnum)
                newarr[i]=newnum;
                //console.log(newarr[i])
                i=i+1;
                if (i===minarr){
                    console.log(newarr)
                    return newarr;
                }
           }
 
        }

        
  
    }    
    
    //connected to getRandomValues
    const findDuplicateinarray=(fnum, arrnew)=>{
        const duppresence =false;
        for(const num of arrnew){
            if(fnum===num) {
                duppresence=true;
                return duppresence;
            }
        }
        return duppresence

    }

    export const checkyourprize= async(tcontract)=>{
        try{
            if(tcontract!=null){
                
               let tprize=await tcontract.checkyourprize();              
                return Number(tprize); 
            }
            } catch(e) {
                console.log(e);
                }
            } 
      
    export const claimprize= async(tcontract)=>{
        try{
            if(tcontract!=null){                        
                let tprize=await tcontract.claimyourprize();              
               
                 }
                } catch(e) {
                    console.log(e);
                    }
                }        


    export const refundback= async(tcontract)=>{
        try{
            if(tcontract!=null){                        
                let tprize=await tcontract.RefundBack();    
                }
                    } catch(e) {
                        console.log(e);
                                }
                            }      

                

    export const findtotalsold= async (tcontract,lotterynumber)=>{
        try{
            if(tcontract!=null){
               // console.log("chandra")
               let [sold,cost]=await tcontract.totalsold(lotterynumber)
              // console.log("dd",[Number(sold),Number(cost)])
                return [Number(sold),Number(cost)]; 
            }
            } catch(e) {
                console.log(e);
                }
            } 
                      

                  
   

       