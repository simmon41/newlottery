import React, { useEffect, useState } from 'react';
import classes from "./roundbuttoncss.module.css"
import { convertToBnb, getlotteryState,checkyourprize,claimprize,refundback } from '../../helpers/lottery-utils';

export default function Roundbutton(props) {

    const [fnum,setfnum]=useState("");
    const [snum,setsnum]=useState("");
    const [tnum,settnum]=useState("");
    const [rnum,setrnum]=useState("");
    const [count,setcount] = useState(1);
    const [lottern,setlotteryn] = useState(0);
    const [maxnum,setmaxnum] = useState(0);
    const [ssold,setssold] = useState(0);
    const [tprize,settprize] = useState(0);

    const firstnumb = [1,2,3,4,5,6,7,8,9]
    const secondnumb = [0,1,2,3,4,5,6,7,8,9]
    const thirdnumb = [0,1,2,3,4,5,6,7,8,9]
    const fourthnumb = [0,1,2,3,4,5,6,7,8,9]

    console.log(props);

     useEffect(()=>{
          if(props.tcontract!==null){
               props.dataupdate();
               findSpecificSold();
              
               setcount(1);
               
          }
         
     },[fnum,snum,tnum,rnum,lottern])

     useEffect(()=>{
          if(props.tcontract!==null){              
               getbutton(props.lotterysale);               
              
          }
        
     },[props.lotterysale,lottern])



    

    

    const doloopcolor=(s,numb, prefix )=>{
     for(let i=s;i<numb.length;i++){
          document.getElementById(`${prefix}${i}`).style.color="white"
          document.getElementById(`${prefix}${i}`).style.borderColor="#374151"
          document.getElementById(`${prefix}${i}`).style.background="#0f172a"          
         
       }
    }


    const firsthandleClick=(n)=>{
 
       setfnum(n+1);
       doloopcolor(0,firstnumb,"f")
       document.getElementById(`f${n}`).style.color="red"
       document.getElementById(`f${n}`).style.borderColor="red" 
       document.getElementById(`f${n}`).style.background="blue"     
    }

    const secondhandleClick=(n)=>{
        setsnum(n);
        doloopcolor(0,secondnumb,"s")
        document.getElementById(`s${n}`).style.color="red"
        document.getElementById(`s${n}`).style.borderColor="red" 
        document.getElementById(`s${n}`).style.background="blue"   

     }

   const thirdhandleClick=(n)=>{
        settnum(n);
        doloopcolor(0,thirdnumb ,"t")
        document.getElementById(`t${n}`).style.color="red"
       document.getElementById(`t${n}`).style.borderColor="red" 
       document.getElementById(`t${n}`).style.background="blue"    
    }

    const fourthhandleClick=(n)=>{
        setrnum(n);
        doloopcolor(0,fourthnumb ,"r")
        document.getElementById(`r${n}`).style.color="red"
        document.getElementById(`r${n}`).style.borderColor="red" 
        document.getElementById(`r${n}`).style.background="blue"    
    }

   const  handleCount=(x,e)=>{

     if(x==="+"){
          if(count<e){
          setcount(count+1);
          }
     }
     if(x==="-"){
          if(count>1){
               setcount(count-1);
          }
         
     }
   }

   const  findSpecificSold= async ()=>{
          try{
               if(props.tcontract!==null){
                    const selectednumber=`${fnum}${snum}${tnum}${rnum}`
                   if(parseInt(selectednumber)>999 && parseInt(selectednumber)<10000){
                    const soldnumber=await props.tcontract.specificNumberSold(selectednumber);
                    setmaxnum(Number(props.lotteryinfo[2])-parseInt(soldnumber))
                    //alert(maxnum)
                    setssold(parseInt(soldnumber))
                    count=1;
                   } else {
               
                    setmaxnum(Number(props.lotteryinfo[2])-parseInt(soldnumber))
                    return 0;
                   }
     
               }
          } catch (e) {
               console.log(e)
          }
     
   }

   const buyticket= async (s)=>{
    console.log(lottern)
     try{
          if(props.tcontract!==null){
               if(lottern>0){
                    const selectednumber=`${fnum}${snum}${tnum}${rnum}`
                    if(parseInt(selectednumber)>999 && parseInt(selectednumber)<10000){
                     await props.tcontract.buyTicket(count,selectednumber, {value: BigInt(count*Number(props.lotteryinfo[1]))})
                     const transactionReceipt = await transaction.wait();
                     findSpecificSold()
                     props.llist();
                     alert(transactionReceipt);
                    } else {
                     alert("Please select numbers from 1000 to 9999")
                    }
      
               } else {
                    alert("lottery number is not selected")
               }
              
          }
     } catch (e) {
          console.log(e)
     }
    
   }


   const getbutton=(salenum)=>{
     let c=parseInt(salenum)
     console.log(c)
     console.log(getlotteryState(c))
     if (getlotteryState(c)==="ALIVE" ){
          return <button className='mx-auto p-4 text-xl font-semibold mt-10 text-center border-2 border-gray-900 rounded-full '> Connect Wallet</button>
     } else if (getlotteryState(c)==="CANCEL" && lottern){
          return <>
               <div><button className='mx-auto p-4 text-xl font-semibold mt-10 text-center border-2 border-gray-900 rounded-full' onClick={()=>refundback(props.tcontract)}> Get My Refund</button></div>
          </>
     } else if (getlotteryState(c)==="CLOSE" && lottern){
          
          return <>
          <div className='pt-5 text-2xl font-bold text-white'>First Prize   </div>
          <div className='text-lime-500 text-2xl'>{Number(props.winningnumbers[0])} </div>

          <div className='pt-2 text-2xl font-bold text-white'>Second Prize   </div>
          <div className='text-lime-500 text-2xl'>{Number(props.winningnumbers[1])} </div>

          <div className='pt-2 text-2xl font-bold text-white'>Third Prize   </div>
          <div className='text-lime-500 text-2xl'>{Number(props.winningnumbers[2])} </div>

          <div className='pt-2 text-2xl font-bold text-white'>Fourth Prize   </div>
          <div className='text-lime-500 text-xl'>{Number(props.winningnumbers[3])}, {Number(props.winningnumbers[4])}, {Number(props.winningnumbers[5])}, {Number(props.winningnumbers[6])}, {Number(props.winningnumbers[7])}, 
          {Number(props.winningnumbers[8])}, {Number(props.winningnumbers[9])}, {Number(props.winningnumbers[10])}, {Number(props.winningnumbers[11])}, {Number(props.winningnumbers[12])} </div>
         
          <div className='pt-2 text-2xl font-bold text-white'>Consolation Prize   </div>
          <div className='text-lime-500 text-xl'>{Number(props.winningnumbers[13])}, {Number(props.winningnumbers[14])}, {Number(props.winningnumbers[15])}, {Number(props.winningnumbers[16])}, {Number(props.winningnumbers[17])}, 
          {Number(props.winningnumbers[18])}, {Number(props.winningnumbers[19])}, {Number(props.winningnumbers[20])}, {Number(props.winningnumbers[21])}, {Number(props.winningnumbers[22])} </div>
                 
         
          <div><button className='mx-auto p-4 text-xl font-semibold mt-10 text-center border-2 border-gray-700   bg-slate-900 text-white rounded-full' onClick={()=>checkyourprize(props.tcontract).then((res)=>settprize(res))}> Check Your Total Prize</button></div>
          <p className='text-white'>You Win: <span className='text-lime-500'>{tprize===0?0:convertToBnb(props.divisor,tprize)} BNB </span></p>
          <div><button className='mx-auto p-4 text-xl font-semibold mt-10 text-center border-2 border-gray-700   bg-slate-900 text-white rounded-full' onClick={()=>claimprize(props.tcontract)}> Claim Prize</button></div> </>
     }
     
   }
   

  return (
<>
<div className='mx-5 md:mx-24 lg:mx-10 2xl:mx-96 flex flex-row gap-1 flex-wrap  justify-center font-poppins'>





<div className='basis-12/12 md:py-5 w-full md:my-5 lg:basis-3/12 border-2 rounded-2xl border-white shadow-2xl drop-shadow-2xl border-spacing-14 shadow-slate-800 text-yellow-500 '>
<div className='text-center text-2xl py-2 font-stencil'>
    List of Lotteries
</div>
{props.lotterylist? props.lotterylist.map((lottery)=>
    <div className="text-yellow-500" key={lottery.lotnum} onClick={()=>{ const s=lottery.lotnum; const c=lottery.cadd;setlotteryn(s);props.dataupdate(c);}}>
    <ul className='bg-slate-800 mx-2 px-2 my-1 rounded-xl shadow-md shadow-slate-400 hover:bg-blue-900'>
        <li className='text-white text-xl'> Lucky Four: {lottery.lotnum} {lottery.status} </li>
        <div className='hidden'>{lottery.cadd}</div>  
            
    </ul>
</div>
): <div className='pl-5'> No List </div>
}
</div>


<div className='basis-12/12 w-full md:py-5 md:my-5 lg:basis-3/12 border-2 rounded-2xl border-white shadow-2xl drop-shadow-2xl border-spacing-14 shadow-slate-800'>
<div className='px-auto text-center text-2xl mt-5 text-yellow-500'> Select Your Lucky 4D</div>
<div className='px-auto text-center text-4xl mt-5 text-white  mx-5  '> {fnum?fnum:"X"}{snum?snum:"X"}{tnum?tnum:"X"}{rnum?rnum:"X"}</div>
<div className='flex flex-row gap-1  mt-5 justify-center '>
    
    <div className=' basis-1/5 p-4 mt-14'>
    {firstnumb.map((n)=>
    <div key={n}>    
    <a href="#" type='button' id={`f${n-1}`} className="w-10 h-10 border-gray-700 border-2   bg-slate-900 text-white  hover:text-lime-500 hover:text-2xl
          hover:shadow-md  hover:shadow-gray-300 text-center  inset-8  py-1 rounded-full font-medium text-xl my-2"  onClick={()=>firsthandleClick(n-1)}>{n}</a>
    </div>)}
    </div>

    <div className='basis-1/5 p-4'>
    {secondnumb.map((s)=>
    <div key={s}>    
    <a href="#" type='button' id={`s${s}`} className="w-10 h-10 border-gray-700 border-2   bg-slate-900  hover:text-lime-500 hover:text-2xl
       hover:shadow-md  hover:shadow-gray-300  text-white text-center  inset-8  py-1 rounded-full font-medium text-xl my-2" onClick={()=>secondhandleClick(s)} >{s}</a>
    </div>)}
    </div>

    <div className='basis-1/5 p-4'>
    {thirdnumb.map((t)=>
    <div key={t}>    
    <a href="#" type='button' id={`t${t}`} className="w-10 h-10  border-2 border-gray-700 bg-slate-900 text-white  hover:text-lime-500 hover:text-2xl
         hover:shadow-md  hover:shadow-gray-300 text-center  inset-8  py-1 rounded-full font-medium text-xl my-2" onClick={()=>thirdhandleClick(t)}>{t}</a>
    </div>)}
    </div>

    <div className='basis-1/5 p-4'>
    {fourthnumb.map((r)=>
    <div key={r}>    
    <a href="#" type='button' id={`r${r}`}  className="w-10 h-10 border-gray-700  border-2  bg-slate-900 text-white hover:text-lime-500 hover:text-2xl 
         hover:shadow-md  hover:shadow-gray-300 text-center  inset-8  py-1 rounded-full font-medium text-xl my-2" onClick={()=>fourthhandleClick(r)} >{r}</a>
    </div>)}
    </div>

    </div>
</div>

<div className='basis-12/12 w-full md:py-10 md:my-5 lg:basis-5/12 rounded-2xl shadow-2xl  shadow-slate-800 border-spacing-6 border-white border-4 text-yellow-500'>
{lottern?<div className='pl-10 text-2xl font-semibold pt-5 text-white'> Lottery Number: <span className='text-lime-500'>{lottern}</span></div>:null}
{getlotteryState(Number(props.lotterysale))==='ALIVE' && lottern?<>
<div className='pl-10 text-xl font-semibold pt-5 text-white'> Lottery Capped to: <span className='text-lime-500'> {convertToBnb(props.divisor,Number(props.lotteryinfo[0]))}  BNB </span></div>
<div className='pl-10 text-xl font-semibold pt-5 text-white'> Each ticket price: <span className='text-lime-500'> {convertToBnb(props.divisor,Number(props.lotteryinfo[1]))} BNB </span></div>
<div className='pl-10 text-xl font-semibold pt-5 text-white'> Overall <span className='text-lime-500'>{Number(props.lotteryinfo[2])} </span> tickets allowed to buy a number </div>
<div className='pl-10 text-sm font-semibold pt-5 text-white'> Lucky draw will be held on Lottery cap reached </div>



<div className='w-full text-center mt-10'>
<div className='text-4xl '> Selected Number: <span className='text-lime-500'> {fnum}{snum}{tnum}{rnum} </span></div>
<p className='text-white'>This Number Sold: <span className='text-lime-500'> {ssold} </span> </p>
<div className='mt-10'>
     <button className='text-7xl w-20 h-20 border-2 rounded-full  border-gray-700   bg-slate-900 text-white ' onClick={()=>handleCount("-",parseInt(maxnum))}>-</button>
     <button className='text-7xl w-24 mx-5 text-center'>{count}</button>
     <button className='text-7xl w-20 h-20  border-2 rounded-full border-gray-700   bg-slate-900 text-white' onClick={()=>handleCount("+",parseInt(maxnum))}>+</button>
</div>
<button className='mx-auto p-4 text-xl font-semibold mt-10 text-center border-2 border-gray-700   bg-slate-900 text-white rounded-full' onClick={()=>buyticket()}> Buy Ticket</button>

</div>


</>:
<div className='w-full text-center'>
{getbutton(props.lotterysale)}

</div>
}



</div>






</div>

<div className='mx-5 md:mx-24 md:py-5 lg:mx-10 xl:mx-96 flex flex-row gap-1 mt-10 text-white'>
     <div className='w-full border-2 rounded-2xl border-gray-700'>
     <div className='pl-10 text-xl font-semibold pt-5'>Prizes</div>
          <ul className='pl-10 text-xl font-semibold pt-5'>
               <li> One: First Prizes:30% Total Money</li>
               <li> One: Second Prizes:20% Total Money</li>
               <li> One: Third Prizes:10% Total Money</li>
               <li> Ten: Starter Prizes:20% Total Money will be distributed</li>
               <li> Ten: Consolidatation Prizes:10% Total Money will be distributed</li>
          </ul>
          <div className='pl-10 text-xl font-semibold pt-5'>Lottery Draw Process</div>
          <p className='px-14 pt-5'>      23 numbers will be randomnly  drawn from external using external algorithm (1 first Prize + 1 Second Prize+ 1 Third Prize + 10 Starter Prize + 10 Consolidation Prize) and will be 
          sent to block chain. All these drawn numbers are again reshuffled in block chain and finalised the results.</p>
     </div>
    
     
</div>
    
    <div className='mx-96 flex flex-row gap-1'>
    
    <div className='basis-1/4'>
    
  
    </div>

    <div className='basis-2/4'>

    </div>
    </div>

    </>
  
  )
}
