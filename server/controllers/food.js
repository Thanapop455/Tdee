const prisma = require("../config/prisma");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// CREATE: เพิ่มอาหารใหม่
exports.create = async (req, res) => {
  try {
    const {
      title,
      description,
      calorie,
      categoryId,
      fat,
      carbohydrate,
      protein,
      servingSize,
      source,
      images,
    } = req.body;

    const food = await prisma.food.create({
      data: {
        title: title,
        description: description,
        calorie: parseFloat(calorie),
        fat: parseFloat(fat),
        carbohydrate: parseFloat(carbohydrate),
        protein: parseFloat(protein),
        servingSize: servingSize,
        source: source,
        categoryId: parseInt(categoryId),
        images: {
          create: images.map((item) => ({
            asset_id: item.asset_id,
            public_id: item.public_id,
            url: item.url,
            secure_url: item.secure_url,
          })),
        },
      },
    });
    res.send(food)
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// READ: อ่านข้อมูลอาหารตาม ID
exports.read = async (req, res) => {
  try {
      const { id } = req.params;

      // ค้นหาอาหาร
      const food = await prisma.food.findUnique({
          where: { id: parseInt(id) },
          include: { images: true, category: true },
      });

      if (!food) {
          return res.status(404).json({ message: "Food not found" });
      }

      // อัปเดตจำนวนการเข้าชม
      await prisma.food.update({
          where: { id: parseInt(id) },
          data: { views: { increment: 1 } }, // เพิ่ม views ทีละ 1
      });

      res.status(200).json(food);
  } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server Error" });
  }
};


// LIST: แสดงรายการอาหารทั้งหมด
exports.list = async (req, res) => {
  try {
    const foods = await prisma.food.findMany({
      include: { images: true, category: true },
      orderBy: { createdAt: "desc" },
    });
    res.status(200).json(foods);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// UPDATE: อัปเดตข้อมูลอาหาร
exports.update = async (req, res) => {
  try {
    const {
      title,
      description,
      calorie,
      fat,
      carbohydrate,
      protein,
      servingSize,
      source,
      categoryId,
      images,
    } = req.body;

    await prisma.image.deleteMany({
      where: {
        foodId: Number(req.params.id),
      },
    });

    // อัปเดตข้อมูล Food
    const food = await prisma.food.update({
      where: {
        id: Number(req.params.id),
      },
      data: {
        title,
        description,
        calorie: parseFloat(calorie),
        fat: parseFloat(fat),
        carbohydrate: parseFloat(carbohydrate),
        protein: parseFloat(protein),
        categoryId: parseInt(categoryId),
        servingSize,
        source,
        images: {
          create: images.map((item) => ({
            asset_id: item.asset_id,
            public_id: item.public_id,
            url: item.url,
            secure_url: item.secure_url,
          })),
        },
      },
    });
    res.send(food)
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

// DELETE: ลบอาหาร
exports.remove = async (req, res) => {
  try {
    const { id } = req.params;

    // ค้นหาอาหารพร้อมรูปภาพ
    const food = await prisma.food.findFirst({
      where: { id: Number(id) },
      include: { images: true },
    });

    if (!food) {
      return res.status(404).json({ message: "Food not found" });
    }

    // ลบรูปภาพจาก Cloudinary (ถ้าใช้ Cloudinary)
    const deletedImages = food.images
    .map((image) =>
        new Promise((resolve, reject) => {
          cloudinary.uploader.destroy(image.public_id, (error, result) => {
            if (error) reject(error);
            else resolve(result);
          });
        })
    );
    await Promise.all(deletedImages);

    // ลบอาหาร
    await prisma.food.delete({
      where: { id: Number(id) },
    });

    res.send('Deleted Success');
    // res.send('Hello Delete Food')
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// SEARCH FILTERS: ค้นหาอาหาร
exports.searchFilters = async (req, res) => {
  const { query, categoryId } = req.body;

  try {
    const foods = await prisma.food.findMany({
      where: {
        AND: [
          query //query, mode: "insensitive"
            ? { title: { contains: query.toLowerCase() } }
            : {},
          categoryId ? { categoryId: parseInt(categoryId) } : {},
        ],
      },
      include: { images: true, category: true },
    });
    res.status(200).json(foods);
    // res.send('Hello Filter Food')
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Search Error" });
  }
};

exports.getPopularFoods = async (req, res) => {
  try {
    const foods = await prisma.food.findMany({
      orderBy: { views: "desc" },
      take: 3,
      include: { images: true },
    });

    res.status(200).json(foods);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

const handleQuery = async (req, res, query) => {
  try {
    //code
    const foods = await prisma.food.findMany({
      where: {
        title: {
          contains: query,
        },
      },
      include: {
        category: true,
        images: true,
      },
    });
    res.send(foods);
  } catch (err) {
    //err
    console.log(err);
    res.status(500).json({ message: "Search Error" });
  }
};

exports.createImages = async (req, res) => {
  try {
    //code
    //   console.log(req.body)
    const result = await cloudinary.uploader.upload(req.body.image, {
      public_id: `Pond-${Date.now()}`,
      resource_type: "auto",
      folder: "Picture2025",
    });
    res.send(result);
  } catch (err) {
    //err
    console.log(err);
    res.status(500).json({ message: "Server Error" });
  }
};
exports.removeImage = async (req, res) => {
  try {
    //code
    const { public_id } = req.body;
    // console.log(public_id)
    cloudinary.uploader.destroy(public_id, (result) => {
      res.send("Remove Image Success!!!");
    });
  } catch (err) {
    //err
    console.log(err);
    res.status(500).json({ message: "Server Error" });
  }
};
