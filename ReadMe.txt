รหัส ADMIN 
tanapop.somjai@gmail.com
123456
-----------Server---------------
npm init -y
npm install express mongoose morgan body-parser cors nodemon socket.io
npm i cloudinary
npm install google-auth-library


MySQL
root
123456

npm install prisma
npx prisma init
npm install @prisma/client

// Doc ใช้ในการสร้างและอัพเดตฐานข้อมูล
npx prisma migrate dev --name projai



// update Scheme
npx prisma db push   // no log
npx prisma migrate dev --create-only
npx prisma migrate dev --name projai


//
อัพเดต Prisma schema
npx prisma migrate dev

------------Client--------------

npm create vite@latest
- client
- javascript

> cd my-projai
> npm install
> npm run dev

# ติดตั้ง core libraries
npm install axios zustand
npm install react-router-dom

# จัดการฟอร์มและ validation
npm install react-hook-form zod @hookform/resolvers zxcvbn

# UI และ icon
npm install react-icons lucide-react

# ตัวช่วยด้านเวลา ตัวเลข และข้อมูล
npm install moment numeral lodash

# components เสริมที่ใช้งาน
npm install rc-slider
npm install react-toastify
npm install react-image-file-resizer

