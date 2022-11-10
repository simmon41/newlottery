

export default async function handler(req, res) {
   
        const array = new Uint32Array(10);
        crypto.getRandomValues(array);

        console.log("Your lucky numbers:");
        for (const num of array) {
        console.log(num);
       


    }
    res.status(200).json({message:array})
}
