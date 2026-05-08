import React, { useEffect, useState } from 'react'
import Loading from './Loading.jsx';
import { useAppContext } from '../context/useContext';

const Community = () => {

  const [images,setImages] = useState([]);
  const [loading,setLoading] = useState(false)
    const {toast,axios}=useAppContext();
  const fetchImages = async()=> {
    try {
      setLoading(true)
      const {data} = await axios.get('/api/user/published-images');
      if(data?.success){
        setImages(data?.images)
        toast.success(data.message)
      }else{
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }finally{
      setLoading(false)
    }
  
  
  
  }

  useEffect(()=>{
     fetchImages()
  },[])

  if(loading) return <Loading/>
  return (
    <div className='p-4 sm:p-6 pt-12 xl:px-12 2xl:px-20 w-full max-w-full mx-auto h-full overflow-y-auto min-w-0'>
        <h2 className='text-lg sm:text-xl font-semibold mb-4 sm:mb-6 text-gray-800 dark:text-purple-100'>Community Images</h2>
        {images.length>0 ? (
           <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 justify-items-center'>
               {images.map((item,index)=>(
                <a key={index} href={item.imageUrl} target='_blank' rel="noreferrer" className='relative group block rounded-lg overflow-hidden border border-white/40 shadow-sm hover:shadow-md transition-shadow duration-300 w-full max-w-sm'>
                  <img src={item.imageUrl} alt=""  className='w-full h-40 sm:h-48 md:h-52 2xl:h-60 object-cover group-hover:scale-105 transition-transform duration-300 ease-in-out'/>
                  <p className='absolute bottom-0 right-0 text-xs bg-black/50 backdrop-blur text-white px-4 py-1 opacity-0 group-hover:opacity-100 transition duration-300 rounded-md'>Created by {item.userName}</p>
                </a>
               ))}
               
           </div>
        ):
        (
           <p className='text-center text-gray-600 dark:text-purple-200 mt-10'>No Images Available.</p>
        )}
    </div>
  )
}

export default Community
