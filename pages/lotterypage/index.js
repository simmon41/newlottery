import Roundbutton  from '../../components/ui/roundbutton';
import {ethers } from "ethers";
import { useEffect, useState } from 'react';
import abi from "../../contract/abi/fourd.json";
import abihead from "../../contract/abi/fourdhead.json";
import {getlotteryState } from '../../helpers/lottery-utils';

//import {AiFillCloseCircle} from 'react-icons/ai'

const LotteryPage= (props) => {
const [tcontract,settcontract] = useState(null);
const [lottern,setlotteryn] = useState([]);
const [lotteryinfo,setlotteryinfot] = useState([5]);
const [wnumbers,setwnumbers] = useState([5]);
const [infotargetamount,setinfotargetamount] = useState(0);
const [infomaxticket,setinfomaxticket] = useState(0);
const [infoperticket,setinfoperticket] = useState(0);
const [infototalsold,setinfototalsold] = useState(0);
const [infostate,setInfostate] = useState(null);
const [lotterylist,setLotterylist] = useState([]);
const lotteryContract=process.env.NEXT_PUBLIC_FOURD_CONTRACT;
const divisor=1000000000000000000;
const [theadcontract,settheadcontract] = useState(null);
const lotteryheadContract=process.env.NEXT_PUBLIC_FOURD_HEAD_CONTRACT;

useEffect(()=>{
  getCommon();
},[props.csigner])

useEffect(()=>{
  llist();  
  //dataupdate();
},[theadcontract])

useEffect(()=>{
  
  dataupdate();
},[theadcontract,lottern])

const getCommon= async()=>{
  if(props.caddres!=="Connect Wallet"){
    settcontract(new ethers.Contract(lotteryContract,abi,props.csigner));
    settheadcontract(new ethers.Contract(lotteryheadContract,abihead,props.csigner))
    if(tcontract!==null && theadcontract!==null){

   } else {
       alert("Connect Wallet")
   }
}
}

const llist=async()=>{
  let lotlist=[];
  try {

      if(tcontract!==null && theadcontract!==null){
          //console.log(theadcontract);
     var i=1;
    
    
      do{
          //console.log(i)
          var nlotterycadd=await theadcontract.lotterylist(i)
          
          //console.log(nlotterycadd )
          if(nlotterycadd!=='0x0000000000000000000000000000000000000000') {    
          const ncontract= await new ethers.Contract(nlotterycadd,abi,props.csigner);   
         // await changeContract(nlotterycadd);
          const nlotterystatus=await ncontract.lotterysale().then((res)=>getlotteryState(Number(res))); 
               
          const newlottery={
              lotnum:i,
              cadd:nlotterycadd,
              status:nlotterystatus,       
          }
         
          lotlist.push(newlottery);  
          //console.log(lotlist)        
          i=i+1;
          //console.log(nlotterycadd)
      }
      } while(nlotterycadd!=='0x0000000000000000000000000000000000000000') 
     
      
      
  }
  } catch(e){
      console.log(e)

  } finally {
      setLotterylist(lotlist);
      //console.log(lotterylist)
  }
 
}

const dataupdate= async(c)=>{
  let newlot=[5] ;
  let wlist=[23] ;
 if(c!==undefined){
  settcontract(new ethers.Contract(c,abi,props.csigner));   
 }
  
 
 if(tcontract!==null ){       
     setinfotargetamount(await tcontract.targetAmount());
     setinfomaxticket(await tcontract.maxticketsallowed());
     setinfoperticket(await tcontract.perticketprice());
     setinfototalsold(await tcontract.totalSoldTickets());
    // setinfoopscommission(await tcontract.operatorcommission());
     
     //setinfoPrizepercent([Number(await tcontract.prizepercent(0)),Number(await tcontract.prizepercent(1)),
        // Number(await tcontract.prizepercent(2)),Number(await tcontract.prizepercent(3)),Number(await tcontract.prizepercent(4))]);
        // console.log(infoprizepercent);
     
     setInfostate(await tcontract.lotterysale());
     newlot[0]=infotargetamount;     
     newlot[1]=infoperticket;
     newlot[2]=infomaxticket;
     newlot[3]=infototalsold;
     
    
     setlotteryinfot(newlot);
     for(let i=0;i<23;i++){
      wlist[i]=await tcontract.winningnumbers(i)
      if(wlist[0]===0){
        return;
      }
     }
     setwnumbers(wlist);
     
     
    //  setinfoopsmoney(await tcontract.operatoraccount());
    //  setinfoopsaccount(await tcontract.operatoraddress());
    //  setinfototalsold(Number(await tcontract.totalSoldTickets()));
    //  setinfototalsoldmoney(convertedbnb(await tcontract.totalSoldMoney()));
    //  setinfoclaimableprize(getclaimableprize(tcontract));
 }
}



  return (
    <div className='bg-black font-poppins'>

  < Roundbutton lotterylist={lotterylist} dataupdate={dataupdate} lotteryinfo={lotteryinfo} divisor={divisor}     
  tcontract={tcontract} llist={llist} lotterysale={Number(infostate)} winningnumbers={wnumbers}/>
    </div>
   
  )
}

export default LotteryPage 