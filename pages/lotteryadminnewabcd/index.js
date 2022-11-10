import {useEffect,useState} from 'react';
import {ethers } from "ethers";
import abi from "../../contract/abi/fourd.json";
import abihead from "../../contract/abi/fourdhead.json";
import { convertToBnb,getlotteryState,
    settargetprice,setticketprice ,setmaxticket, setopscommission,setpercentforprize,
    setchangestate, operatorWithdraw,setlotteryresults,
    setclaimableprize, getclaimableprize} from '../../helpers/lottery-utils';



function AdminPage(props) {
    const [tcontract,settcontract] = useState(null);
    const [theadcontract,settheadcontract] = useState(null);
    const [lottern,setlotteryn] = useState(0);
    const [infotargetamount,setinfotargetamount] = useState(0);
    const [infomaxticket,setinfomaxticket] = useState(0);
    const [infoperticket,setinfoperticket] = useState(0);
    const [infoopscommission,setinfoopscommission] = useState(0);
    const [infoprizepercent,setinfoPrizepercent] = useState([]);
    const [infostate,setinfostate] = useState(0);
    const [infoopsmoney,setinfoopsmoney] = useState(0);
    const [infoopsaccount,setinfoopsaccount] = useState('');
    const [infototalsold,setinfototalsold] = useState(0);
    const [infototalsoldmoney,setinfototalsoldmoney] = useState(0);
    const [infoclaimableprize,setinfoclaimableprize] = useState([]);

    const [bperticketprice, setbperticketprice] = useState(0);
    const [bmaxticket, setbmaxticket] = useState(0);
    const [bopcommission, setbopcommission] = useState(0);
    const [fp,setfp] = useState(30);
    const [sp,setsp] = useState(20);
    const [tp,settp] = useState(10);
    const [strt,setstrt] = useState(20);
    const [cons,setcons] = useState(10);
    const [winlist,setwinlist] = useState([]);
    const [rollover,setrollover] =useState(0);
    const [lotterylist,setLotterylist] = useState([])
    const [btargetamount, setbtargetamount] = useState(0);
    
    const [lstate,setlstate] = useState([]);
 
    const lotteryContract=process.env.NEXT_PUBLIC_FOURD_CONTRACT;
    const lotteryheadContract=process.env.NEXT_PUBLIC_FOURD_HEAD_CONTRACT;

    const divisor=1000000000000000000;
   

useEffect(()=>{
    getCommon();
},[props.csigner])

useEffect(()=>{
   llist();  
   //dataupdate();
},[theadcontract])



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






const getwinnerslist=async(s)=>{
    if(lstate===3){
        let wlist=[]
        for(let i=0;i<23;i++){
            const newd=await tcontract.winnerslist(s)(i);
            if(newd!==0){
                wlist.push(newd)
            } else {
                return
            }
            return wlist;
        }
    }
}

const dataupdate= async(c)=>{
     var newarr=[5]
     settcontract(new ethers.Contract(c,abi,props.csigner));    
    if(tcontract!==null ){       
        setinfotargetamount(await tcontract.targetAmount());
        setinfomaxticket(await tcontract.maxticketsallowed());
        setinfoperticket(await tcontract.perticketprice());
        setinfoopscommission(await tcontract.operatorcommission());
        await tcontract.prizepercent(0).then((res)=>newarr[0]=Number(res))
        await tcontract.prizepercent(1).then((res)=>newarr[1]=Number(res))
        await tcontract.prizepercent(2).then((res)=>newarr[2]=Number(res))
        await tcontract.prizepercent(3).then((res)=>newarr[3]=Number(res))
        await tcontract.prizepercent(4).then((res)=>newarr[4]=Number(res))
        setinfoPrizepercent([newarr[0],newarr[1],newarr[2],newarr[3],newarr[4]]);
                  
        
        setinfostate(await tcontract.lotterysale());
        setinfoopsmoney(await tcontract.operatoraccount());
        setinfoopsaccount(await tcontract.operatoraddress());
        setinfototalsold(Number(await tcontract.totalSoldTickets()));
        setinfototalsoldmoney(convertedbnb(await tcontract.totalSoldMoney()));
        setinfoclaimableprize(getclaimableprize(tcontract));
    }
}
 



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

const convertedbnb=(tgt)=>{
    return (
        <div>  {convertToBnb(divisor, Number(tgt))} bnb  </div> )
  
}






  return (
   <>
<div className='mx-96 border-2 border-gray-900 rounded-3xl mt-10'>
<div className='flex flex-rows gap-2'>

{/* Lottery List */}
<div className='basis-1/5 border-r-2  border-gray-900'>
<div className='text-center py-2'>
    List of Lotteries
</div>
{lotterylist? lotterylist.map((lottery)=>
    <div key={lottery.lotnum} onClick={()=>{ const s=lottery.lotnum; const c=lottery.cadd;setlotteryn(s); dataupdate(c)}}>
    <ul className='pl-5'>
        <li> Lucky Four: {lottery.lotnum} {lottery.status} </li>
        <div >{lottery.cadd}</div>        
    </ul>
</div>
): <div className='pl-5'> No List </div>
}
</div>



<div className='basis-4/5 pl-10 py-10'>
{/* <div className='border-2 border-gray-900 bg-zinc-300 rounded-sm mt-10 mx-10 pl-5'> 
<div>Create New Lottery</div>
<div className='my-2'> 
<label>Max Tickets Allowed(1,2,3..etc):</label> 

<input type="number" defaultValue="1" className="text-black text-center ml-8 border-2 border-black" onChange={(e)=>setMaxticket(e.target.value)}/>
</div>
<div className='my-2'> 
<label>Target Amount in wei:</label> 
<input type="number" defaultValue="1" className="text-black text-center w-72 border-2 border-black ml-24" onChange={(e)=>setTargetAmount(e.target.value)}/>
<p>{convertToBnb(divisor,targetAmount).toFixed(18)} bnp</p>
</div>
<div className='my-2'> 
<label>Operator Commission(1-100):</label> 
<input type="number" defaultValue="1" className="text-black text-center border-2 border-black ml-10" onChange={(e)=>setCommission(e.target.value)}/>
</div>
<div className='my-2'> 
<label>Per Ticket Price in Wei:</label> 
<input type="number" defaultValue="1" className="text-black text-center w-72 border-2 border-black ml-24" onChange={(e)=>setPerTicket(e.target.value)}/>
<p>{convertToBnb(divisor,perticket).toFixed(18)} bnp</p>
</div>
<div className='my-2'> 
<label className='mr-5'>Prize Percentage[30,20,10,20,10]:</label> 
<label>FP</label>
<input type="number" defaultValue={fp} className="text-black text-center w-14 border-2 border-black mx-2"  onChange={(e)=>{setfp(e.target.value);}}/>
<label>SP</label>
<input type="number"  defaultValue={sp} className="text-black text-center w-14 border-2 border-black mx-2"   onChange={(e)=>{setsp(e.target.value);}}/>
<label>TP</label>
<input type="number"  defaultValue={tp} className="text-black text-center w-14 border-2 border-black mx-2"  onChange={(e)=>{settp(e.target.value);}}/>
<label>ST</label>
<input type="number"  defaultValue={strt} className="text-black text-center w-14 border-2 border-black mx-2"  onChange={(e)=>{setstrt(e.target.value);}}/>
<label>CN</label>
<input type="number"  defaultValue={cons} className="text-black text-center w-14 border-2 border-black mx-2"  onChange={(e)=>{setcons(e.target.value);}}/>
</div>
<button className='border-2 border-gray-900  bg-orange-300  rounded-full px-4 py-1 my-2' onClick={()=>{const cl=setArray(fp,sp,tp,strt,cons,commission);CreateNewLottery(tcontract,maxticket,targetAmount,commission,cl,perticket)}}> Create</button>
</div> */}


<div className=' text-4xl mt-10 mx-10 pl-5'> Lottery No: {lottern}</div>
<div className='border-2 border-gray-900 rounded-sm mt-10 mx-10 pl-5'> 
<div className='inline-block'>Max Lottery Cap: {convertToBnb(divisor, Number(infotargetamount))} bnb  </div>
<div>
<input type="number" defaultValue="1" className="text-black text-center border-2 border-black mr-5" placeholder='TargetAmount' onChange={(e)=>{setbtargetamount(e.target.value)}}/>
<button className='border-2 border-gray-900  bg-orange-300  rounded-full px-4 py-1 my-2' onClick={()=>settargetprice(tcontract,btargetamount,lottern)}> Set Target Amount</button>
{convertedbnb(btargetamount)}
<div> Collected tilldate:{infototalsoldmoney} bnb (included 10% of operator account money)  </div>
<div> Sold no of tickets tilldate:{infototalsold} </div>
</div>
</div>

<div className='border-2 border-gray-900 rounded-sm mt-10 mx-10 pl-5'> 
<div >Each Ticket Price {convertToBnb(divisor,Number(infoperticket))} bnb </div>
<input type="number" defaultValue="1" className="text-black text-center border-2 border-black mr-5" placeholder='Ticket Price' onChange={(e)=>setbperticketprice(e.target.value)}/>
{convertedbnb(bperticketprice)}
<button className='border-2 border-gray-900  bg-orange-300  rounded-full px-4 py-1 my-2' onClick={()=>setticketprice(tcontract,bperticketprice)}> Set Ticket Price</button>
</div>

<div className='border-2 border-gray-900 rounded-sm mt-10 mx-10 pl-5'> 
<div > Current Max Tickets Allowed:{Number(infomaxticket)} </div>
<input type="number" defaultValue="1" className="text-black text-center border-2 border-black mr-5" placeholder='Ticket Price' onChange={(e)=>setbmaxticket(e.target.value)}/>
<button className='border-2 border-gray-900  bg-orange-300  rounded-full px-4 py-1 my-2' onClick={()=>setmaxticket(tcontract,bmaxticket)}> Set Max Tickets</button>
</div>

<div className='border-2 border-gray-900 rounded-sm mt-10 mx-10 pl-5'> 
<div > Current Operator Commission:{Number(infoopscommission)} </div>
<input type="number" defaultValue="1" className="text-black text-center border-2 border-black mr-5" placeholder='Ticket Price' onChange={(e)=>setbopcommission(e.target.value)}/>
<button className='border-2 border-gray-900  bg-orange-300  rounded-full px-4 py-1 my-2' onClick={()=>setopscommission(tcontract,bopcommission)}> Set Operator Commission</button>
</div>

<div className='border-2 border-gray-900 rounded-sm mt-10 mx-10 pl-5'> 
<div >Current Prize Percentage:[{infoprizepercent[0]},{infoprizepercent[1]},{infoprizepercent[2]},{infoprizepercent[3]},{infoprizepercent[4]}] </div><div className='my-2'> 
<div>
<label>First Prize </label>
<input type="number" defaultValue={fp} className="text-black text-center w-14 border-2 border-black mx-2"  onChange={(e)=>{setfp(e.target.value);}}/>
<button className='border-2 border-gray-900  bg-orange-300  rounded-full px-4 py-1 my-2' onClick={()=>setpercentforprize(tcontract,0,fp)}>Set First Prize</button>
</div>

<div>
<label>Second Prize</label>
<input type="number"  defaultValue={sp} className="text-black text-center w-14 border-2 border-black mx-2"   onChange={(e)=>{setsp(e.target.value);}}/>
<button className='border-2 border-gray-900  bg-orange-300  rounded-full px-4 py-1 my-2' onClick={()=>setpercentforprize(tcontract,1,sp)}>Set Second Prize</button>
</div>

<div>
<label>Third Prize</label>
<input type="number"  defaultValue={tp} className="text-black text-center w-14 border-2 border-black mx-2"  onChange={(e)=>{settp(e.target.value);}}/>
<button className='border-2 border-gray-900  bg-orange-300  rounded-full px-4 py-1 my-2'  onClick={()=>setpercentforprize(tcontract,2,tp)} >Set Third Prize</button>
</div>

<div>
<label>Starter Prize</label>
<input type="number"  defaultValue={strt} className="text-black text-center w-14 border-2 border-black mx-2"  onChange={(e)=>{setstrt(e.target.value);}}/>
<button className='border-2 border-gray-900  bg-orange-300  rounded-full px-4 py-1 my-2'  onClick={()=>setpercentforprize(tcontract,3,strt)}>Set Starter Prize</button>
</div>

<div>
<label>Consolidation Prize</label>
<input type="number"  defaultValue={cons} className="text-black text-center w-14 border-2 border-black mx-2"  onChange={(e)=>{setcons(e.target.value);}}/>
<button className='border-2 border-gray-900  bg-orange-300  rounded-full px-4 py-1 my-2' onClick={()=>setpercentforprize(tcontract,4,cons)}>Set Consolidation Prize</button>
</div>
</div>

</div>

<div className='border-2 border-gray-900 rounded-sm mt-10 mx-10 pl-5'> 
<div >Current Ticket State: {getlotteryState(Number(infostate))} </div>
<button className='border-2 border-gray-900  bg-orange-300  rounded-full px-4 py-1 my-2 mx-2' onClick={()=>setchangestate(tcontract,"OPEN")}> SET ALIVE</button>
<button className='border-2 border-gray-900  bg-orange-300  rounded-full px-4 py-1 my-2 mx-2' onClick={()=>setchangestate(tcontract,"SUSPEND")}> SET SUSPEND</button>
<button className='border-2 border-gray-900  bg-orange-300  rounded-full px-4 py-1 my-2 mx-2' onClick={()=>setchangestate(tcontract,"CANCEL")}> SET CANCEL</button>
<button className='border-2 border-gray-900  bg-orange-300  rounded-full px-4 py-1 my-2 mx-2' onClick={()=>setchangestate(tcontract,"CLOSE")}> SET CLOSE</button>
<button className='border-2 border-gray-900  bg-orange-300  rounded-full px-4 py-1 my-2 mx-2' onClick={()=>setchangestate(tcontract,"FINISH")}> SET FINISH</button>
<p> "Alive"- users able to buy ticket. "Suspend"- temperorily block users buying tickets "Cancel": Lottery is Cancelled.Users can able to get their refund. "Close":
Lottery Closed. Now admin can do the lucky draw process. Be Carefult before you proceed to set Finish.(You can't revoke) </p>
</div>

<div className='border-2 border-gray-900 rounded-sm mt-10 mx-10 pl-5'> 
{/* {winlist.length>0?<p>{winlist}</p>:<p> Winner List not revealed</p>} */}
<button className='border-2 border-gray-900  bg-orange-300  rounded-full px-4 py-1 my-2' onClick={()=>setlotteryresults(tcontract)}> Set Lottery Results</button>
<div>
<button className='border-2 border-gray-900  bg-orange-300  rounded-full px-4 py-1 my-2' onClick={()=>setclaimableprize(tcontract)}> Set Claimable Prize</button>
<p>{infoclaimableprize[0]>0?infoclaimableprize[0]:"0"},{infoclaimableprize[1]>0?infoclaimableprize[1]:"0"},{infoclaimableprize[2]>0?infoclaimableprize[2]:"0"},
{infoclaimableprize[3]>0?infoclaimableprize[3]:"0"},{infoclaimableprize[4]>0?infoclaimableprize[4]:"0"}</p>
</div>
<p> Need to Change Lottery State to "CLOSE" prior to Click the this button. However ClOSE only possible if  Target Amount is achieved</p>
</div>



<div className='border-2 border-red-900 rounded-sm mt-10 mx-10 pl-5'> 
<div >Ops account: {Number(infoopsmoney)} bnb </div>
<div >Ops account: {infoopsaccount} </div>
<button className='border-2 border-gray-900  bg-orange-600  rounded-full px-4 py-1 my-2' onClick={()=> operatorWithdraw(tcontract)}> Operator With Draw</button>
</div>

<div className='border-2 border-red-900 rounded-sm mt-10 mx-10 pl-5'> 
<div >Withdraw unclaimed of Particular Lottery Number: </div>
<button className='border-2 border-gray-900  bg-orange-600  rounded-full px-4 py-1 my-2' 
onClick={()=>{if (tcontract!==null){tcontract.withdrawunclaimed(lottern)}}}> Withdraw Unclaimed Money</button>
</div>

<div className='border-2 border-red-900 rounded-sm mt-10 mx-10 pl-5'> 
<div >Current Balance: </div>
<button className='border-2 border-gray-900  bg-orange-600  rounded-full px-4 py-1 my-2' 
 onClick={()=>{if (tcontract!==null){tcontract.withdrawall()}}}>Withdraw All</button>
</div>

<div className='border-2 border-red-900 rounded-sm mt-10 mx-10 pl-5'> 
<div >Unclaimed Prize: 5 bnb </div>
<input type="number"  className="text-black text-center border-2 border-black mr-5" placeholder='Amount to Transfer'onChange={(e)=>setrollover(e.target.value)}/>
<button className='border-2 border-gray-900  bg-orange-600  rounded-full px-4 py-1 my-2'onClick={()=>{if (tcontract!==null){tcontract.rollOverFundToNewLottery({value:rollover})}}}> Rollover to New Lottery</button>
</div>



<button className='border-2 border-gray-900  bg-orange-600  rounded-full px-4 py-1 my-2' onClick={()=>setlotteryresults(tcontract,'3',lottern)}> get Random Values</button>






</div>

</div>
</div>

   </>
  )
}

export default AdminPage