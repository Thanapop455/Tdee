import React, { useState } from "react";
import { toast } from "react-toastify";
import Resize from "react-image-file-resizer";
import { removefile, uploadfile } from "../../api/Food";
import useStoregobal from "../../store/storegobal";
import { LoaderCircle } from 'lucide-react';

const Uploadfile = ({ form, setForm }) => {
  const token = useStoregobal((state) => state.token);
  const [isLoading, setIsLoading] = useState(false);
  const handleOnChange = (e) => {
    setIsLoading(true)
    const files = e.target.files;
    if (files) {
      setIsLoading(true);
      let allFiles = form.images;
      for (let i = 0; i < files.length; i++) {
        //  console.log(files[i])

        const file = files[i];
        if (!file.type.startsWith("image/")) {
          toast.error(`File ${file.name} ไม่ใช่รูปภาพ`);
          continue;
        }
        Resize.imageFileResizer(
          files[i],
          720,
          720,
          "JPEG",
          100,
          0,
          (data) => {
            uploadfile(token, data)
              .then((res) => {
                console.log(res);
                allFiles.push(res.data);
                setForm({
                  ...form,
                  images: allFiles,
                });
                setIsLoading(false)
                toast.success("Upload image Success!!!");
              })
              .catch((err) => {
                console.log(err);
                setIsLoading(false)
              });
          },
          "base64"
        );
      }
    }
  }
  console.log(form);

  const handleDelete = (public_id) =>{
    const images = form.images
    removefile(token,public_id)
    .then((res)=>{
      const filterImages = images.filter((item,index)=>{
        console.log(item);
        
        return item.public_id !== public_id
      })
      console.log('filterImages',filterImages)
      setForm({
        ...form,
        images: filterImages
      })
      toast.error(res.data)
    })
    .catch((err)=>{
      console.log(err);
      
    })
  }
  
  return (
    <div>
      <div className="flex mx-4 gap-4 my-4">
      {
        isLoading && <LoaderCircle className="w-16 h-16 animate-spin"/>
      }
        {
          form.images?.map((item,index)=>
            <div className="relative" key={index}>
              <img
              className="w-24 h-24 hover:scale-105"
              src={item.url}/>
              <span
              onClick={()=>handleDelete(item.public_id)}
               className="absolute top-0 right-0 
              bg-red-600 p-1 rounded-md">X</span>
            </div>
          )
        }
      </div>
      <div>
        <input 
        onChange={handleOnChange} 
        type="file" 
        name="images" 
        multiple 
        />
      </div>
    </div>
  );
};

export default Uploadfile;
