import React ,{useState,useEffect} from "react";
import { listFood } from "../../api/Food";
import SwiperFood from "../../../util/SwiperFood";
import { SwiperSlide } from "swiper/react";

const FoodHot = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    // code
    loadData();
  }, []);

  const loadData = () => {
    listFood("title")
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  console.log(data);
  return (
    <SwiperFood>
      {data?.map((item, index) => (
        <SwiperSlide>
          <SearchResults item={item} key={index} />
        </SwiperSlide>
      ))}
    </SwiperFood>
  );
};

export default FoodHot;
