import React, { useState } from 'react';
import {
    Accordion,
    AccordionItem,
    AccordionItemButton,
    AccordionItemHeading,
    AccordionItemPanel,
} from 'react-accessible-accordion';
import ds from "../../prizeinfo.json"

export default function FaqPage() {
const items=ds;


  return (
    <div className='w-screen h-screen bg-black'>
    <div className='mx-5 md:mx-16 xl:mx-96  bg-black  2xl:p-20 pt-10 rounded-tl-3xl rounded-br-3xl'>
    <div className='2xl:mx-20'>
    <Accordion>
    {items.map((item,index) => (
        <AccordionItem key={index}>
            <AccordionItemHeading>
                <AccordionItemButton>
                    <div className='bg-zinc-500  text-white text-xl pl-10 my-1 py-4 rounded-xl font-poppins'> {item.prizename}</div>
                </AccordionItemButton>
            </AccordionItemHeading>
            <AccordionItemPanel>
            <div className='border-2 border-white rounded-xl'>
              <div className='pl-12 text-white'>No of Prizes: {item.noofprize} </div>
              <div className='pl-12 text-white'>Prize Percentage: {item.pricepercent} </div>
              <div className='pl-12 text-white'> {item.Description} </div>
              </div>
            </AccordionItemPanel>
        </AccordionItem>
    ))}
</Accordion>
    </div>
    </div>
    </div>
  )
}
