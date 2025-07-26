import axios from 'axios'
import { create } from 'zustand'
import { persist,createJSONStorage} from 'zustand/middleware'
import { listCategory, listCategoryPublic } from '../api/Category'
import { listFood } from '../api/Food'
import { listTdee } from '../api/Tdee'

const storegobal = (set) =>({
    user: null,
    token : null,
    categories : [],
    foods:[],
    tdees:[],
    logout:() =>{
      set({
        user: null,
        token : null,
        foods:[],
        tdees:[],
      })
      localStorage.removeItem("SadStore");
    },
    actionLogin: async (form)=>{
        const res = await axios.post('http://localhost:5001/api/login',form)
        set({ 
            user: res.data.payload,
            token: res.data.token
        }) 
        return res
    },
    getCategory: async (token) => {
      try {
        let res;
        if (token) {
          res = await listCategory(token);
        } else {
          res = await listCategoryPublic(); // ✅ fallback
        }
        set({ categories: res.data });
      } catch (err) {
        console.log(err);
      }
    },
      getFood : async (token) => {
        try {
          const res = await listFood(token);
          set({foods: res.data});
        } catch (err) {
          console.log(err);
        }
      },

      getTdee : async (token) => {
        try{
          const res = await listTdee(token);
          set({tdees: res.data});
        }catch (err) {
          console.log(err);
        }
      }
})

const usePersist = {
    name: 'SadStore',
    storage: createJSONStorage(()=>localStorage)
}
const useStoregobal = create( persist(storegobal,usePersist))

export default useStoregobal